import React from 'react';
import {
  X,
  Home,
  Bookmark,
  Clock,
  Printer,
  Info,
  Send,
  Shield,
  ExternalLink,
  Flame,
  Sparkles
} from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateSubmit: () => void;
  onNavigateAdmin: () => void;
  onSelectCategory: (slug: string) => void;
  onScrollToColumn: (colId: string) => void;
  onExportPdf: () => void;
  favoritesCount: number;
  activeCategorySlug?: string;
  isCategoryView?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onNavigateAbout,
  onNavigateSubmit,
  onNavigateAdmin,
  onSelectCategory,
  onScrollToColumn,
  onExportPdf,
  favoritesCount,
  activeCategorySlug,
  isCategoryView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1A1A]/30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative z-10 w-80 max-w-[85vw] h-full bg-[#FAFAF8] border-r border-[#E5E2DA] shadow-xl flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-[#E5E2DA] flex items-center justify-between bg-[#F4F2ED]">
          <div>
            <span className="font-logo font-black text-xl text-[#8B3A2F] tracking-tight">
              VAULT-IB
            </span>
            <p className="text-[11px] text-[#777777] font-medium mt-0.5">
              Diploma Programme Resources
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-[#555555] hover:text-[#1A1A1A] hover:bg-[#EBE8E0] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
          {/* Main Views */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-[#EBE8E0] text-[#1A1A1A] transition-colors cursor-pointer text-left"
            >
              <Home className="w-4 h-4 text-[#1A1A1A]" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onScrollToColumn('col-favorites');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded hover:bg-[#EBE8E0] text-[#1A1A1A] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-[#1A1A1A]" />
                <span>Favorites</span>
              </div>
              <span className="text-xs bg-[#B85C8A]/15 text-[#B85C8A] font-semibold px-2 py-0.5 rounded-full">
                {favoritesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onScrollToColumn('col-trending');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-[#EBE8E0] text-[#1A1A1A] transition-colors cursor-pointer text-left"
            >
              <Flame className="w-4 h-4 text-[#1A1A1A]" />
              <span>Trending</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onScrollToColumn('col-new-tools');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-[#EBE8E0] text-[#1A1A1A] transition-colors cursor-pointer text-left"
            >
              <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
              <span>New Tools</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateAbout();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-[#EBE8E0] text-[#1A1A1A] transition-colors cursor-pointer text-left"
            >
              <Clock className="w-4 h-4 text-[#1A1A1A]" />
              <span>Activity Log</span>
            </button>
          </div>

          <div className="border-t border-[#E5E2DA] my-2 pt-2">
            <h3 className="px-3 text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-1.5">
              Categories
            </h3>

            <div className="space-y-0.5">
              {CATEGORY_DEFINITIONS.map((cat) => {
                const isActive = isCategoryView && activeCategorySlug === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.slug);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs rounded transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#E5E2DA] text-[#1A1A1A] font-semibold'
                        : 'text-[#333333] hover:bg-[#EBE8E0] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions & Links */}
        <div className="p-3 border-t border-[#E5E2DA] bg-[#F4F2ED] space-y-1 text-xs">
          <button
            type="button"
            onClick={() => {
              onNavigateSubmit();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[#E5E2DA] text-[#333333] hover:text-[#1A1A1A] text-left cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Suggest Resource</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigateAbout();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[#E5E2DA] text-[#333333] hover:text-[#1A1A1A] text-left cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>About</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigateAdmin();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-[#E5E2DA] text-[#666666] hover:text-[#1A1A1A] text-left cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Admin</span>
          </button>

          <a
            href="https://www.reddit.com/r/IBO/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#E5E2DA] text-[#666666] hover:text-[#1A1A1A] text-left"
          >
            <span>r/IBO</span>
            <ExternalLink className="w-3 h-3 text-[#1A1A1A]" />
          </a>
        </div>

        {/* Floating circular PDF Export Button (bottom-right of sidebar view as requested in Part 1.6) */}
        <div className="absolute bottom-4 right-4 z-20">
          <button
            type="button"
            onClick={onExportPdf}
            className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white hover:bg-[#8B3A2F] shadow-md flex items-center justify-center transition-colors cursor-pointer group"
            title="Export view as printable PDF"
            aria-label="Export as printable PDF"
          >
            <Printer className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
