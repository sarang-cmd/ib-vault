import { Resource, ResourceStatus } from '../types';
import { INITIAL_RESOURCES } from '../data/resources';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_RESOURCES_KEY = 'ibvault_user_resources';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'ibvault_submissions';

export interface SubmitResourcePayload {
  name: string;
  url: string;
  description: string;
  category: string;
  cost: 'Free' | 'Freemium';
  suggested_by?: string;
}

async function getResourcesFromSupabase(): Promise<Resource[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('rank', { ascending: false });
  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }
  return (data || []).map(mapDbToResource);
}

async function getPendingFromSupabase(): Promise<Resource[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'pending')
    .order('added_date', { ascending: false });
  if (error) {
    console.error('Supabase pending fetch error:', error);
    return [];
  }
  return (data || []).map(mapDbToResource);
}

function mapDbToResource(row: Record<string, unknown>): Resource {
  return {
    id: row.id as string,
    name: row.name as string,
    url: row.url as string,
    description: row.description as string,
    category: row.category as string,
    cost: row.cost as 'Free' | 'Freemium',
    rank: row.rank as number,
    is_new: row.is_new as boolean,
    added_date: row.added_date as string,
    status: row.status as ResourceStatus,
    suggested_by: row.suggested_by as string | undefined,
  };
}

function resourceToDb(resource: Resource): Record<string, unknown> {
  return {
    id: resource.id,
    name: resource.name,
    url: resource.url,
    description: resource.description,
    category: resource.category,
    cost: resource.cost,
    rank: resource.rank,
    is_new: resource.is_new,
    added_date: resource.added_date,
    status: resource.status,
    suggested_by: resource.suggested_by || null,
  };
}

export async function getStoredResources(): Promise<Resource[]> {
  if (isSupabaseConfigured) {
    const fromDb = await getResourcesFromSupabase();
    if (fromDb.length > 0) return fromDb;
  }
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_RESOURCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored resources', e);
  }
  return INITIAL_RESOURCES;
}

export async function getPendingSubmissions(): Promise<Resource[]> {
  if (isSupabaseConfigured) {
    const fromDb = await getPendingFromSupabase();
    if (fromDb.length > 0) return fromDb;
  }
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading submissions', e);
  }
  return [
    {
      id: 'sub-openstax-calc',
      name: 'OpenStax Calculus Vol 1 & 2',
      url: 'https://openstax.org/subjects/math',
      description: 'Peer-reviewed open source calculus textbooks ideal for deep HL Calculus practice',
      category: 'Mathematics AA HL',
      cost: 'Free',
      rank: 4,
      is_new: true,
      added_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      suggested_by: 'alex.ib2025@gmail.com'
    },
    {
      id: 'sub-chem-libre-kinetics',
      name: 'LibreTexts Chemical Kinetics Simulator',
      url: 'https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps',
      description: 'Interactive Arrhenius equation calculations and reaction rate constant graphing',
      category: 'Chemistry HL',
      cost: 'Free',
      rank: 4,
      is_new: true,
      added_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      suggested_by: 'sophie_m_ib@proton.me'
    }
  ];
}

export async function submitResource(payload: SubmitResourcePayload): Promise<{ success: boolean; data?: Resource; error?: string }> {
  try {
    const id = `sub-${payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    const today = new Date().toISOString().split('T')[0];

    const newResource: Resource = {
      id,
      name: payload.name.trim(),
      url: payload.url.trim(),
      description: payload.description.trim(),
      category: payload.category,
      cost: payload.cost,
      rank: 4,
      is_new: true,
      added_date: today,
      status: 'pending',
      suggested_by: payload.suggested_by || 'Anonymous Contributor'
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('resources').insert(resourceToDb(newResource));
      if (error) throw error;
      return { success: true, data: newResource };
    }

    const pending = await getPendingSubmissions();
    pending.unshift(newResource);
    try {
      localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(pending));
    } catch (e) {
      console.error('Error saving submissions', e);
    }
    return { success: true, data: newResource };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Submission failed' };
  }
}

export async function approveSubmission(id: string): Promise<{ success: boolean; resource?: Resource }> {
  const pending = await getPendingSubmissions();
  const index = pending.findIndex(r => r.id === id);
  if (index === -1) return { success: false };

  const item = { ...pending[index], status: 'approved' as ResourceStatus };
  pending.splice(index, 1);

  if (isSupabaseConfigured && supabase) {
    const { error: delError } = await supabase.from('resources').delete().eq('id', id);
    if (delError) throw delError;
    const { error: insError } = await supabase.from('resources').insert(resourceToDb(item));
    if (insError) throw insError;
  } else {
    try {
      localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(pending));
      const all = await getStoredResources();
      const exists = all.findIndex(r => r.id === id);
      if (exists >= 0) all[exists] = item;
      else all.unshift(item);
      localStorage.setItem(LOCAL_STORAGE_RESOURCES_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Error saving resources', e);
    }
  }
  return { success: true, resource: item };
}

export async function rejectSubmission(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
  const pending = await getPendingSubmissions();
  const filtered = pending.filter(r => r.id !== id);
  try {
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error saving submissions', e);
  }
  return true;
}

export async function updateResourceStatus(id: string, status: ResourceStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('resources').update({ status }).eq('id', id);
    if (error) throw error;
    return true;
  }
  const all = await getStoredResources();
  const idx = all.findIndex(r => r.id === id);
  if (idx >= 0) {
    all[idx].status = status;
    try {
      localStorage.setItem(LOCAL_STORAGE_RESOURCES_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Error saving resources', e);
    }
    return true;
  }
  return false;
}

export async function resetResourcesToDefault(): Promise<Resource[]> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('resources').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error } = await supabase.from('resources').insert(INITIAL_RESOURCES.map(resourceToDb));
    if (error) console.error('Reset error:', error);
    return INITIAL_RESOURCES;
  }
  localStorage.removeItem(LOCAL_STORAGE_RESOURCES_KEY);
  localStorage.removeItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
  return INITIAL_RESOURCES;
}