import React from 'react';
import { X, Shield, Bookmark, Trash2, Download, ExternalLink, GripVertical } from 'lucide-react';
import { Resource } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  resources: Resource[];
  onClearFavorites: () => void;
  onNavigateAdmin: () => void;
  isReorderMode: boolean;
  onToggleReorderMode: (enabled: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  favorites,
  resources,
  onClearFavorites,
  onNavigateAdmin,
  isReorderMode,
  onToggleReorderMode,
}) => {
  if (!isOpen) return null;

  const handleExportFavorites = () => {
    const favResources = resources.filter(r => favorites.includes(r.id));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(favResources, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ib-vault-favorites.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#1A1A1A]/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-[#FAFAF8] border border-[#E5E2DA] rounded-md shadow-xl p-5 text-[#1A1A1A]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E2DA]">
          <h2 className="text-base font-bold text-[#1A1A1A]">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#777777] hover:text-[#1A1A1A] cursor-pointer"
          >
            <X className="w-4 h-4 text-[#1A1A1A]" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Favorites Management */}
          <div className="p-3 bg-white border border-[#E5E2DA] rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#1A1A1A]" />
                <span>Favorites ({favorites.length})</span>
              </span>
            </div>
            <p className="text-xs text-[#666666]">
              Favorites are stored in your browser local storage
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportFavorites}
                disabled={favorites.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[#DDD9CF] rounded bg-[#FAF9F5] text-[#333333] hover:text-[#1A1A1A] disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear all saved favorites?')) {
                    onClearFavorites();
                  }
                }}
                disabled={favorites.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[#C97064]/30 rounded text-[#C97064] hover:bg-[#C97064]/10 disabled:opacity-40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>Clear Favorites</span>
              </button>
            </div>
          </div>

          {/* Admin & Maintainer tools */}
          <div className="p-3 bg-white border border-[#E5E2DA] rounded space-y-2">
            <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#1A1A1A]" />
              <span>Admin Access</span>
            </span>
            <p className="text-xs text-[#666666]">
              Review pending submissions and manage links
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateAdmin();
              }}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#1A1A1A] text-white hover:bg-[#8B3A2F] cursor-pointer"
            >
              <span>Open Admin</span>
              <ExternalLink className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Column Reorder Mode */}
          <div className="p-3 bg-white border border-[#E5E2DA] rounded space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GripVertical className="w-4 h-4 text-[#1A1A1A]" />
                <span className="font-bold text-[#1A1A1A]">Column Reorder Mode</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleReorderMode(!isReorderMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  isReorderMode
                    ? 'bg-[#8B3A2F] text-white'
                    : 'bg-[#F4F2ED] text-[#1A1A1A] hover:bg-[#EBE8E0]'
                }`}
              >
                <span>{isReorderMode ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
            <p className="text-xs text-[#666666]">
              When enabled, drag the grip icon on column headers to reorder columns. Changes are saved automatically.
            </p>
          </div>

          {/* About Metadata */}
          <div className="text-center pt-2 text-[11px] text-[#888888]">
            <p>Vault IB v3.0 • Built with Vite, React, TypeScript and Tailwind CSS</p>
            <p className="mt-0.5">Non-commercial educational archive for the IB DP community</p>
          </div>
        </div>
      </div>
    </div>
  );
};
