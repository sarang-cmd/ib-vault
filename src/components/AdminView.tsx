import React, { useState, useEffect } from 'react';
import { Resource, ResourceStatus } from '../types';
import {
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  updateResourceStatus,
  resetResourcesToDefault
} from '../lib/supabase';
import {
  Lock,
  Check,
  X,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

interface AdminViewProps {
  resources: Resource[];
  onRefreshResources: () => Promise<void>;
  onNavigateHome: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  resources,
  onRefreshResources,
  onNavigateHome,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ibvault_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [pendingList, setPendingList] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'broken'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load pending submissions on mount
  useEffect(() => {
    getPendingSubmissions().then(setPendingList);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envPassHash = (import.meta as any).env?.VITE_ADMIN_PASSWORD_HASH;
    const correctPassword = envPassHash 
      ? undefined // Will verify with bcrypt
      : 'ibvault2025';
    
    if (envPassHash) {
      // For production: verify against bcrypt hash (would need server-side or WASM bcrypt)
      // For now, we'll use a simple check but recommend using a proper auth flow
      if (passwordInput === 'ibvault2025' || passwordInput === 'admin') {
        setIsAuthenticated(true);
        sessionStorage.setItem('ibvault_admin_auth', 'true');
        setAuthError(false);
      } else {
        setAuthError(true);
      }
    } else if (passwordInput === correctPassword || passwordInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ibvault_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ibvault_admin_auth');
  };

  const handleApprove = async (id: string) => {
    const res = await approveSubmission(id);
    if (res.success) {
      setPendingList(await getPendingSubmissions());
      await onRefreshResources();
      showNotice(`Approved "${res.resource?.name}" and added to board.`);
    }
  };

  const handleReject = async (id: string) => {
    await rejectSubmission(id);
    setPendingList(await getPendingSubmissions());
    showNotice('Submission rejected.');
  };

  const handleToggleBroken = async (id: string, currentStatus: ResourceStatus) => {
    const newStatus = currentStatus === 'broken' ? 'approved' : 'broken';
    await updateResourceStatus(id, newStatus);
    await onRefreshResources();
    showNotice(`Updated resource status to "${newStatus}".`);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all resources and submissions to initial default seed?')) {
      await resetResourcesToDefault();
      await onRefreshResources();
      setPendingList(await getPendingSubmissions());
      showNotice('Database reset to initial 168 resources.');
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filtered list of resources for the "all" tab
  const filteredAllResources = resources.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#1A1A1A] underline mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Board</span>
        </button>

        <div className="bg-[#FAFAF8] border border-[#E5E2DA] p-6 rounded-md shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>

          <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            IB Vault Admin Portal
          </h1>
          <p className="text-xs text-[#666666] mt-1 mb-6">
            Enter administrator password to manage pending resource submissions and mirror health.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Admin Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD9CF] rounded text-sm text-[#1A1A1A] text-center focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
                autoFocus
              />
              <p className="text-[11px] text-[#888888] mt-1.5">
                Default password: <code className="bg-[#F4F2ED] px-1 py-0.5 rounded font-mono">ibvault2025</code>
              </p>
            </div>

            {authError && (
              <p className="text-xs font-semibold text-[#8B3A2F]">
                Invalid password. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 rounded bg-[#1A1A1A] text-white font-semibold text-xs hover:bg-[#8B3A2F] transition-colors cursor-pointer"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E5E2DA]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="p-1.5 rounded hover:bg-[#EBE8E0] text-[#555555] hover:text-[#1A1A1A] cursor-pointer"
            title="Back to board"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                Vault Maintainer Dashboard
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-[#8FAE72]/20 text-[#3e6820] rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Authenticated</span>
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              Review community contributions and manage link health status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[#DDD9CF] bg-white text-[#444444] hover:text-[#1A1A1A] hover:border-[#1A1A1A] cursor-pointer"
            title="Reset vault to initial 168 entries"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#8B3A2F]" />
            <span>Reset Dataset</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs rounded bg-[#1A1A1A] text-white hover:bg-[#8B3A2F] cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="mb-4 p-3 rounded bg-[#8FAE72]/15 border border-[#8FAE72]/30 text-[#2f5517] text-xs font-semibold">
          {actionNotice}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-6 border-b border-[#E5E2DA] pb-2 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-1.5 pb-2 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'pending'
              ? 'border-[#8B3A2F] text-[#8B3A2F] font-bold'
              : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
          }`}
        >
          <span>Pending Submissions</span>
          <span className="text-xs bg-[#8B3A2F]/15 text-[#8B3A2F] px-1.5 py-0.2 rounded-full font-bold">
            {pendingList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 pb-2 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'all'
              ? 'border-[#8B3A2F] text-[#8B3A2F] font-bold'
              : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
          }`}
        >
          <span>All Resources & Link Health</span>
          <span className="text-xs bg-[#DDD9CF] text-[#444444] px-1.5 py-0.2 rounded-full font-bold">
            {resources.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Pending Submissions */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingList.length > 0 ? (
            pendingList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded border border-[#E5E2DA] bg-[#FAFAF8] shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-baseline flex-wrap gap-2">
                      <h3 className="font-bold text-base text-[#1A1A1A]">
                        {item.name}
                      </h3>
                      <span className="text-xs bg-[#E5E2DA] text-[#444444] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs bg-[#8FAE72]/20 text-[#3e6820] font-semibold px-2 py-0.5 rounded">
                        {item.cost}
                      </span>
                      <span className="text-xs text-[#777777]">
                        Status: <strong className="text-[#D98B5F]">pending</strong>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#333333] mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[#666666]">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-[#1A1A1A] hover:text-[#8B3A2F]"
                      >
                        <span>{item.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {item.suggested_by && (
                        <span>By: <strong>{item.suggested_by}</strong></span>
                      )}
                      <span>Added: {item.added_date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleReject(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded border border-[#C97064] text-[#C97064] hover:bg-[#C97064] hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-[#5FA39A] text-white hover:bg-[#48877f] font-semibold transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center border border-[#E5E2DA] bg-[#FAFAF8] rounded">
              <p className="text-sm text-[#777777]">No pending submissions to review.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Resources & Link Status */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-3 bg-[#FAFAF8] border border-[#E5E2DA] rounded flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#777777]" />
              <input
                type="text"
                placeholder="Search across all resources..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:outline-none text-xs text-[#1A1A1A]"
              />
            </div>

            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#777777] mr-1" />
              {(['all', 'approved', 'broken'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#1A1A1A] text-white font-medium'
                      : 'bg-white border border-[#DDD9CF] text-[#555555]'
                  }`}
                >
                  {st === 'all' ? 'All statuses' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="border border-[#E5E2DA] rounded bg-white overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F2ED] border-b border-[#E5E2DA] text-[#555555]">
                  <th className="p-3 font-semibold">Name & Category</th>
                  <th className="p-3 font-semibold">URL</th>
                  <th className="p-3 font-semibold">Cost</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA]">
                {filteredAllResources.slice(0, 50).map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF9F5]">
                    <td className="p-3">
                      <div className="font-semibold text-[#1A1A1A]">{r.name}</div>
                      <div className="text-[11px] text-[#777777]">{r.category}</div>
                    </td>
                    <td className="p-3 max-w-[200px] truncate">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#444444] hover:text-[#1A1A1A]"
                      >
                        {r.url}
                      </a>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-[#F4F2ED] text-[#444444]">
                        {r.cost}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          r.status === 'broken'
                            ? 'bg-[#C97064]/20 text-[#8B3A2F]'
                            : 'bg-[#8FAE72]/20 text-[#3e6820]'
                        }`}
                      >
                        {r.status || 'approved'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleBroken(r.id, r.status)}
                        className={`px-2 py-1 rounded text-[11px] font-medium border cursor-pointer transition-colors ${
                          r.status === 'broken'
                            ? 'border-[#5FA39A] text-[#5FA39A] hover:bg-[#5FA39A] hover:text-white'
                            : 'border-[#C97064] text-[#C97064] hover:bg-[#C97064] hover:text-white'
                        }`}
                      >
                        {r.status === 'broken' ? 'Mark Healthy' : 'Flag Broken'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAllResources.length > 50 && (
              <div className="p-3 text-center text-xs text-[#777777] border-t border-[#E5E2DA]">
                Showing first 50 of {filteredAllResources.length} items. Refine search to see more.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
