import React from 'react';
import { Resource } from '../types';
import { getCategoryMeta } from '../data/categories';
import {
  X,
  ExternalLink,
  Bookmark,
  Star,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface ResourceDetailModalProps {
  resource: Resource | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewCategory: (slug: string) => void;
  onReportResource: (resource: Resource) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  onClose,
  isFavorite,
  onToggleFavorite,
  onViewCategory,
  onReportResource,
}) => {
  if (!resource) return null;

  const catMeta = getCategoryMeta(resource.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1A1A]/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-[#FAFAF8] border border-[#E5E2DA] rounded-md shadow-xl overflow-hidden text-[#1A1A1A]">
        {/* Header Pill */}
        <div
          className="px-5 py-3.5 flex items-center justify-between"
          style={{ backgroundColor: catMeta.color, color: catMeta.textColor }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider opacity-90">
              {resource.category}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
                {resource.name}
              </h2>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
                  resource.cost === 'Free'
                    ? 'bg-[#8FAE72]/20 text-[#3e6820]'
                    : 'bg-[#E0A96D]/20 text-[#8a5518]'
                }`}
              >
                {resource.cost}
              </span>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5 text-[#8B3A2F]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < resource.rank ? 'fill-[#8B3A2F] text-[#8B3A2F]' : 'text-[#DDD9CF]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#666666] font-medium">
                {resource.rank} / 5 Community Rating
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-3.5 rounded border border-[#EBE7DF]">
            <h3 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-1">
              Description & Syllabus Utility
            </h3>
            <p className="text-sm text-[#333333] leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#555555]">
            <div className="p-2.5 rounded border border-[#E5E2DA] bg-[#F4F2ED]">
              <span className="text-[11px] text-[#777777] block">Status</span>
              <div className="flex items-center gap-1 font-semibold text-[#1A1A1A] mt-0.5">
                {resource.status === 'broken' ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-[#C97064]" />
                    <span className="text-[#C97064]">Mirror Issues</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5FA39A]" />
                    <span>Verified Link</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded border border-[#E5E2DA] bg-[#F4F2ED]">
              <span className="text-[11px] text-[#777777] block">Added Date</span>
              <div className="flex items-center gap-1 font-semibold text-[#1A1A1A] mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#777777]" />
                <span>{resource.added_date || 'Standard catalog'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 rounded bg-[#1A1A1A] text-white hover:bg-[#8B3A2F] font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>Open Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => onToggleFavorite(resource.id)}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded border text-xs font-semibold transition-colors cursor-pointer ${
                isFavorite
                  ? 'border-[#B85C8A] bg-[#B85C8A]/10 text-[#B85C8A]'
                  : 'border-[#DDD9CF] bg-white text-[#333333] hover:text-[#B85C8A] hover:border-[#B85C8A]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#B85C8A]' : ''}`} />
              <span>{isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}</span>
            </button>
          </div>

          {/* Footer Sub-links */}
          <div className="pt-3 border-t border-[#E5E2DA] flex items-center justify-between text-xs text-[#777777]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewCategory(catMeta.slug);
              }}
              className="underline hover:text-[#1A1A1A] inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>See more in {resource.category}</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onReportResource(resource);
              }}
              className="underline hover:text-[#C97064] cursor-pointer"
            >
              Report broken URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
