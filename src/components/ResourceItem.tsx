import React, { useState } from 'react';
import { Resource } from '../types';
import { Bookmark, Star, ExternalLink, Info, AlertTriangle } from 'lucide-react';

interface ResourceItemProps {
  resource: Resource;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: Resource) => void;
  showAddedDate?: boolean;
  onResourceClick?: (resourceId: string) => void;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  resource,
  isFavorite,
  onToggleFavorite,
  onSelectResource,
  showAddedDate = false,
  onResourceClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative py-1 group/item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-baseline justify-between gap-1.5 leading-snug">
        {/* Resource Name: Plain black underlined text */}
        <div className="flex-1 min-w-0 flex items-baseline flex-wrap gap-x-1.5">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onResourceClick?.(resource.id)}
            className="text-[#1A1A1A] underline decoration-1 underline-offset-2 hover:text-[#000000] hover:decoration-[#000000] transition-colors font-medium text-[14.5px] break-words cursor-pointer"
          >
            {resource.name}
          </a>

          {/* NEW Badge pill */}
          {resource.is_new && (
            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#6E7A99] text-white tracking-wide align-middle select-none">
              NEW
            </span>
          )}

          {/* Broken link indicator if flagged */}
          {resource.status === 'broken' && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#C97064] align-middle select-none" title="Reported as broken mirror">
              <AlertTriangle className="w-2.5 h-2.5 text-[#1A1A1A]" />
              <span>broken</span>
            </span>
          )}
        </div>

        {/* Subtle quick action controls on hover */}
        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(resource.id);
            }}
            className={`p-0.5 rounded transition-colors cursor-pointer ${
              isFavorite
                ? 'text-[#B85C8A]'
                : 'text-[#888888] hover:text-[#B85C8A]'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#1A1A1A]' : ''} text-[#1A1A1A]`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectResource(resource);
            }}
            className="p-0.5 text-[#888888] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            title="View details & review"
            aria-label="View details"
          >
            <Info className="w-3.5 h-3.5 text-[#1A1A1A]" />
          </button>
        </div>
      </div>

      {/* Added date sub-line for New Tools column or newly added */}
      {(showAddedDate || resource.added_date) && (
        <div className="text-[11.5px] text-[#777777] font-normal leading-tight mt-0.5">
          Added {resource.added_date}
        </div>
      )}

      {/* Hover Tooltip (clean index card style, no neon glow, neutral cream background) */}
      {isHovered && (
        <div
          className="absolute z-40 left-0 sm:left-4 top-full mt-1.5 w-72 max-w-[90vw] p-3 bg-white text-[#1A1A1A] border border-[#E5E2DA] rounded shadow-md pointer-events-auto"
          role="tooltip"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[#F0ECE1] pb-1.5 mb-2">
            <div>
              <div className="font-semibold text-xs text-[#1A1A1A]">{resource.name}</div>
              <div className="text-[11px] text-[#777777]">{resource.category}</div>
            </div>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                resource.cost === 'Free'
                  ? 'bg-[#8FAE72]/15 text-[#3e6820]'
                  : 'bg-[#E0A96D]/20 text-[#8a5518]'
              }`}
            >
              {resource.cost}
            </span>
          </div>

          <p className="text-xs text-[#333333] leading-relaxed mb-2.5">
            {resource.description}
          </p>

          <div className="flex items-center justify-between text-[11px] text-[#666666] pt-1 border-t border-[#F0ECE1]">
            <div className="flex items-center gap-0.5 text-[#8B3A2F]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < resource.rank ? 'fill-[#8B3A2F] text-[#8B3A2F]' : 'text-[#DDD9CF]'
                  }`}
                />
              ))}
              <span className="ml-1 text-[11px] text-[#555555] font-medium">{resource.rank}/5</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectResource(resource)}
                className="underline hover:text-[#1A1A1A] cursor-pointer"
              >
                More info
              </button>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium underline text-[#1A1A1A] hover:text-[#8B3A2F] cursor-pointer"
              >
                <span>Visit</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#1A1A1A]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
