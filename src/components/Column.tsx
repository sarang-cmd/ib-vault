import React from 'react';
import { Resource } from '../types';
import { ResourceItem } from './ResourceItem';
import { CategoryIcon } from './CategoryIcon';
import { Plus, ArrowRight } from 'lucide-react';

interface ColumnProps {
  id: string;
  title: string;
  slug?: string;
  color: string;
  textColor?: string;
  iconName: string;
  resources: Resource[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: Resource) => void;
  onOpenAddFavoriteModal?: () => void;
  onViewCategory?: (slug: string) => void;
  isPinned?: boolean;
  isFavoritesColumn?: boolean;
  isNewToolsColumn?: boolean;
}

export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  slug,
  color,
  textColor = '#FFFFFF',
  iconName,
  resources,
  favorites,
  onToggleFavorite,
  onSelectResource,
  onOpenAddFavoriteModal,
  onViewCategory,
  isFavoritesColumn = false,
  isNewToolsColumn = false,
}) => {
  return (
    <div
      id={id}
      className="w-full sm:w-[250px] flex-shrink-0 flex flex-col rounded-t-md overflow-visible transition-shadow scroll-mt-20"
    >
      {/* Colored Header Pill: Rounded top corners only, flat where it meets the list body below */}
      <div
        className="px-3.5 py-2.5 rounded-t-md flex items-center justify-between select-none shadow-2xs"
        style={{ backgroundColor: color, color: textColor }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <CategoryIcon name={iconName} className="w-4 h-4 flex-shrink-0" />
          <h2 className="font-semibold text-[13.5px] tracking-tight truncate leading-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 pl-1">
          {/* Item count badge */}
          <span
            className="text-[11px] font-bold px-1.5 py-0.2 rounded-full opacity-90"
            style={{
              backgroundColor: textColor === '#FFFFFF' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)',
              color: textColor
            }}
          >
            {resources.length}
          </span>

          {/* Quick link to full category page if regular category */}
          {slug && onViewCategory && (
            <button
              type="button"
              onClick={() => onViewCategory(slug)}
              className="p-0.5 rounded opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
              title={`View all ${title} resources in full page`}
              aria-label={`Open ${title} category page`}
            >
              <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
            </button>
          )}
        </div>
      </div>

      {/* List Body: White or very light gray #FAFAF8, thin 1px border #E5E2DA, barely-visible drop shadow */}
      <div className="flex-1 bg-[#FAFAF8] border-x border-b border-[#E5E2DA] rounded-b-md p-3.5 shadow-2xs min-h-[140px] flex flex-col justify-between">
        {resources.length > 0 ? (
          <div className="space-y-0.5 divide-y divide-[#F1EFEA]">
            {resources.map((resource) => (
              <ResourceItem
                key={resource.id}
                resource={resource}
                isFavorite={favorites.includes(resource.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectResource={onSelectResource}
                showAddedDate={isNewToolsColumn}
              />
            ))}
          </div>
        ) : (
          <div className="py-6 px-2 text-center my-auto">
{isFavoritesColumn ? (
              <div className="space-y-2">
                <p className="text-xs text-[#777777] italic">No favorites</p>
                <button
                  type="button"
                  onClick={onOpenAddFavoriteModal}
                  className="inline-flex items-center gap-1 text-xs text-[#1A1A1A] underline hover:text-[#B85C8A] font-medium cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-[#1A1A1A]" />
                  <span>Add to favorites</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#777777] italic">No resources found</p>
            )}
          </div>
        )}

        {/* Column footer for favorites if empty or has items */}
        {isFavoritesColumn && resources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-[#EFECE5] flex items-center justify-between text-[11px] text-[#777777]">
            <button
              type="button"
              onClick={onOpenAddFavoriteModal}
              className="inline-flex items-center gap-1 text-[#1A1A1A] underline hover:text-[#B85C8A] cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add more</span>
            </button>
            <span>Saved in browser</span>
          </div>
        )}
      </div>
    </div>
  );
};
