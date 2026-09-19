export type ResourceCost = 'Free' | 'Freemium';
export type ResourceStatus = 'approved' | 'pending' | 'broken';

export interface Resource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  cost: ResourceCost;
  rank: number; // 1-5
  is_new: boolean;
  added_date?: string;
  status: ResourceStatus;
  suggested_by?: string;
}

export interface CategoryMeta {
  name: string;
  slug: string;
  color: string; // Header pill background color
  textColor: string; // Header text color: '#ffffff' or '#1a1a1a'
  iconName: string;
  description: string;
}

export interface ActivityEntry {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  category?: string;
}

export type VaultRoute = 
  | { view: 'board' }
  | { view: 'dashboard' }
  | { view: 'category'; slug: string }
  | { view: 'about' }
  | { view: 'submit' }
  | { view: 'admin' };
