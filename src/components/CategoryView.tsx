import React, { useState, useMemo } from 'react';
import { Resource } from '../types';
import { getCategoryMeta, CATEGORY_DEFINITIONS } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import {
  ArrowLeft,
  Printer,
  Share2,
  Bookmark,
  Star,
  ExternalLink,
  Info,
  Check,
  Search,
  AlertTriangle
} from 'lucide-react';
import { exportCategoryToPdf } from '../lib/pdfExport';

interface CategoryViewProps {
  slug: string;
  resources: Resource[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: Resource) => void;
  onNavigateHome: () => void;
  onSelectCategory: (slug: string) => void;
  onReportResource: (resource: Resource) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  slug,
  resources,
  favorites,
  onToggleFavorite,
  onSelectResource,
  onNavigateHome,
  onSelectCategory,
  onReportResource,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [costFilter, setCostFilter] = useState<'all' | 'Free' | 'Freemium'>('all');

  const meta = getCategoryMeta(slug);
  const categoryResources = useMemo(() => {
    return resources.filter(
      r => r.category.toLowerCase() === meta.name.toLowerCase()
    );
  }, [resources, meta.name]);

  const filteredResources = useMemo(() => {
    return categoryResources.filter(r => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCost =
        costFilter === 'all' || r.cost === costFilter;
      return matchesSearch && matchesCost;
    });
  }, [categoryResources, searchQuery, costFilter]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    exportCategoryToPdf(meta.name, categoryResources);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#444444] hover:text-[#1A1A1A] underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Board</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[#DDD9CF] rounded bg-white text-[#333333] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#5FA39A]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link copied' : 'Share category'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-[#DDD9CF] rounded bg-white text-[#333333] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors cursor-pointer"
            title="Export printable PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#8B3A2F]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Category Header Card */}
      <div className="rounded-md overflow-hidden border border-[#E5E2DA] bg-[#FAFAF8] mb-6 shadow-2xs">
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: meta.color, color: meta.textColor }}
        >
          <div className="flex items-center gap-3">
            <CategoryIcon name={meta.iconName} className="w-6 h-6 flex-shrink-0" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                {meta.name}
              </h1>
              <p className="text-xs opacity-90 mt-0.5">
                {categoryResources.length} Free & Freemium Resources Available
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 text-sm text-[#333333] border-b border-[#EFECE5]">
          <p className="leading-relaxed">{meta.description}</p>
        </div>

        {/* Filter bar inside category card */}
        <div className="p-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#777777]" />
            <input
              type="text"
              placeholder={`Filter in ${meta.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 focus:outline-none text-xs text-[#1A1A1A] placeholder-[#888888]"
            />
          </div>

          <div className="flex items-center gap-1">
            {(['all', 'Free', 'Freemium'] as const).map((cost) => (
              <button
                key={cost}
                type="button"
                onClick={() => setCostFilter(cost)}
                className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                  costFilter === cost
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-[#F4F2ED] text-[#555555] hover:text-[#1A1A1A]'
                }`}
              >
                {cost === 'all' ? 'All tiers' : cost}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded List Items */}
      <div className="space-y-3">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource, index) => {
            const isFav = favorites.includes(resource.id);
            return (
              <div
                key={resource.id}
                className="p-4 rounded-md border border-[#E5E2DA] bg-[#FAFAF8] hover:border-[#CCC6B8] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline flex-wrap gap-2">
                      <span className="text-xs font-bold text-[#888888]">#{index + 1}</span>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1A1A1A] underline font-semibold text-base hover:text-black transition-colors"
                      >
                        {resource.name}
                      </a>

                      {resource.is_new && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#6E7A99] text-white">
                          NEW
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          resource.cost === 'Free'
                            ? 'bg-[#8FAE72]/15 text-[#3e6820]'
                            : 'bg-[#E0A96D]/20 text-[#8a5518]'
                        }`}
                      >
                        {resource.cost}
                      </span>

                      {resource.status === 'broken' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C97064]">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Mirror issues reported</span>
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 text-xs sm:text-sm text-[#444444] leading-relaxed">
                      {resource.description}
                    </p>

                    {resource.added_date && (
                      <div className="mt-2 text-[11px] text-[#777777]">
                        Added {resource.added_date}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(resource.id)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        isFav
                          ? 'text-[#B85C8A] bg-[#B85C8A]/10'
                          : 'text-[#777777] hover:text-[#B85C8A] hover:bg-[#EBE8E0]'
                      }`}
                      title={isFav ? 'Remove favorite' : 'Add to favorites'}
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-[#B85C8A]' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectResource(resource)}
                      className="p-1.5 text-[#777777] hover:text-[#1A1A1A] hover:bg-[#EBE8E0] rounded transition-colors cursor-pointer"
                      title="Inspect resource info"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#1A1A1A] hover:text-[#8B3A2F] hover:bg-[#EBE8E0] rounded transition-colors cursor-pointer"
                      title="Open website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#EFECE5] flex items-center justify-between text-xs text-[#666666]">
                  <div className="flex items-center gap-1 text-[#8B3A2F]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < resource.rank ? 'fill-[#8B3A2F] text-[#8B3A2F]' : 'text-[#DDD9CF]'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-[#555555]">Rating {resource.rank}/5</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onReportResource(resource)}
                    className="text-[11px] text-[#777777] hover:text-[#C97064] underline cursor-pointer"
                  >
                    Report link issue
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-[#FAFAF8] border border-[#E5E2DA] rounded">
            <p className="text-sm text-[#777777]">No resources match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Other Categories Browser */}
      <div className="mt-12 pt-6 border-t border-[#E5E2DA]">
        <h3 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-3">
          Explore Other Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORY_DEFINITIONS.filter(c => c.slug !== slug).map((other) => (
            <button
              key={other.slug}
              type="button"
              onClick={() => onSelectCategory(other.slug)}
              className="flex items-center gap-2 p-2 rounded border border-[#E5E2DA] bg-[#FAFAF8] hover:border-[#1A1A1A] text-left text-xs transition-colors cursor-pointer"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: other.color }}
              />
              <span className="truncate font-medium text-[#1A1A1A]">{other.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
