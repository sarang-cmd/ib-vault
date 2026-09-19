import React, { useState, useEffect, useRef } from 'react';
import { Resource } from '../types';
import { Search, X, ExternalLink, Bookmark, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: Resource) => void;
  onViewCategory: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  resources,
  favorites,
  onToggleFavorite,
  onSelectResource,
  onViewCategory,
}) => {
  const [query, setQuery] = useState('');
  const [filterCost, setFilterCost] = useState<'all' | 'Free' | 'Freemium'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = resources.filter((r) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);

    const matchesCost = filterCost === 'all' || r.cost === filterCost;
    return matchesQuery && matchesCost;
  }).slice(0, 25);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        className="fixed inset-0 bg-[#1A1A1A]/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl bg-[#FAFAF8] border border-[#E5E2DA] rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-[#E5E2DA] bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-[#1A1A1A] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search resources"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-sm sm:text-base text-[#1A1A1A] placeholder-[#888888] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#777777] hover:text-[#1A1A1A] cursor-pointer"
            >
              <X className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] uppercase font-sans font-medium px-1.5 py-0.5 bg-[#F4F2ED] text-[#777777] border border-[#DDD9CF] rounded">
            ESC
          </kbd>
        </div>

        {/* Cost Filter Quick Tabs */}
        <div className="px-4 py-2 bg-[#F4F2ED] border-b border-[#E5E2DA] flex items-center justify-between text-xs text-[#555555]">
          <div className="flex items-center gap-2">
            <span>Filter cost:</span>
            {(['all', 'Free', 'Freemium'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCost(c)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  filterCost === c
                    ? 'bg-[#1A1A1A] text-white font-medium'
                    : 'bg-white text-[#555555] hover:text-[#1A1A1A]'
                }`}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#777777]">
            {results.length} results
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-3 divide-y divide-[#EFECE5]">
          {results.length > 0 ? (
            results.map((resource) => {
              const isFav = favorites.includes(resource.id);
              const catSlug = resource.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              return (
                <div
                  key={resource.id}
                  className="py-2.5 px-3 rounded hover:bg-white transition-colors group flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline flex-wrap gap-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1A1A1A] underline font-semibold text-sm hover:text-black cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {resource.name}
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          onViewCategory(catSlug);
                          onClose();
                        }}
                        className="text-[11px] text-[#666666] hover:text-[#1A1A1A] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{resource.category}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-60 text-[#1A1A1A]" />
                      </button>

                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                          resource.cost === 'Free'
                            ? 'bg-[#8FAE72]/20 text-[#3e6820]'
                            : 'bg-[#E0A96D]/20 text-[#8a5518]'
                        }`}
                      >
                        {resource.cost}
                      </span>
                    </div>

                    <p className="text-xs text-[#555555] mt-1 line-clamp-2">
                      {resource.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0 self-center">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(resource.id)}
                      className={`p-1 rounded cursor-pointer ${
                        isFav ? 'text-[#B85C8A]' : 'text-[#888888] hover:text-[#B85C8A]'
                      }`}
                      title={isFav ? 'Remove favorite' : 'Add to favorites'}
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-[#1A1A1A]' : ''} text-[#1A1A1A]`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectResource(resource);
                        onClose();
                      }}
                      className="px-2 py-1 text-xs text-[#555555] hover:text-[#1A1A1A] underline cursor-pointer"
                    >
                      Details
                    </button>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-[#1A1A1A] hover:text-[#8B3A2F] cursor-pointer"
                      title="Open website"
                    >
                      <ExternalLink className="w-4 h-4 text-[#1A1A1A]" />
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#777777]">
              No resources found for "{query}"
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-[#F4F2ED] border-t border-[#E5E2DA] flex items-center justify-between text-[11px] text-[#777777] px-4">
          <span>Search links descriptions and category tags</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
