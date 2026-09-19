import React, { useState } from 'react';
import { Resource } from '../types';
import { X, Search, Check, Plus, Bookmark } from 'lucide-react';

interface AddFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({
  isOpen,
  onClose,
  resources,
  favorites,
  onToggleFavorite,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  if (!isOpen) return null;

  const categories = Array.from(new Set(resources.map(r => r.category)));

  const filtered = resources.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || r.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#1A1A1A]/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg bg-[#FAFAF8] border border-[#E5E2DA] rounded-md shadow-xl flex flex-col max-h-[85vh] text-[#1A1A1A]">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E2DA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#1A1A1A] fill-[#1A1A1A]" />
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Add to Favorites
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#777777] hover:text-[#1A1A1A] cursor-pointer"
          >
            <X className="w-4 h-4 text-[#1A1A1A]" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 bg-white border-b border-[#E5E2DA] space-y-2">
          <div className="flex items-center gap-2 px-2.5 py-1.5 border border-[#DDD9CF] rounded bg-[#FAF9F5]">
            <Search className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <input
              type="text"
              placeholder="Filter by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-0 text-xs text-[#1A1A1A] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCat('all')}
              className={`px-2 py-0.5 rounded flex-shrink-0 cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-[#1A1A1A] text-white font-medium'
                  : 'bg-[#F4F2ED] text-[#555555]'
              }`}
            >
              All ({resources.length})
            </button>
            {categories.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCat(c)}
                className={`px-2 py-0.5 rounded flex-shrink-0 cursor-pointer ${
                  selectedCat === c
                    ? 'bg-[#1A1A1A] text-white font-medium'
                    : 'bg-[#F4F2ED] text-[#555555]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 divide-y divide-[#EFECE5]">
          {filtered.slice(0, 40).map((r) => {
            const isFav = favorites.includes(r.id);
            return (
              <div
                key={r.id}
                className="py-2 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-[#1A1A1A] truncate">{r.name}</div>
                  <div className="text-[11px] text-[#777777]">{r.category}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleFavorite(r.id)}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold text-xs cursor-pointer transition-colors ${
                    isFav
                      ? 'bg-[#B85C8A] text-white'
                      : 'border border-[#DDD9CF] bg-white text-[#333333] hover:border-[#B85C8A] hover:text-[#B85C8A]'
                  }`}
                >
{isFav ? (
                      <>
                        <Check className="w-3 h-3 text-white" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-[#1A1A1A]" />
                        <span>Add</span>
                      </>
                    )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#E5E2DA] bg-[#F4F2ED] flex items-center justify-between text-xs">
          <span className="text-[#666666] font-medium">
            {favorites.length} saved
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-[#1A1A1A] text-white hover:bg-[#8B3A2F] font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
