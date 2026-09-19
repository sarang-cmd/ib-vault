import React from 'react';
import { Menu, Search, Settings, PlusCircle } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
  onOpenSubmit: () => void;
  totalCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenSettings,
  onNavigateHome,
  onOpenSubmit,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F4F2ED] border-b border-[#E5E2DA] transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Left: Hamburger & Wordmark Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded text-[#1A1A1A] hover:bg-[#EBE8E0] transition-colors focus:outline-none focus:ring-1 focus:ring-[#8B3A2F]"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5 text-[#1A1A1A]" />
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer"
          >
            <img src="/favicon.svg" alt="" className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
            <span className="font-logo font-extrabold text-2xl sm:text-[26px] tracking-tight text-[#8B3A2F] leading-none select-none">
              VAULT IB
            </span>
            <span className="hidden md:inline-block text-[12px] font-medium text-[#777777] border-l border-[#DCD7CE] pl-2 leading-none">
              {totalCount} Free DP Resources
            </span>
          </button>
        </div>

        {/* Center/Right: Quick Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Submit link */}
          <button
            type="button"
            onClick={onOpenSubmit}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[#D5D0C5] text-[#333333] hover:text-[#1A1A1A] hover:border-[#1A1A1A] bg-white transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Suggest Link</span>
          </button>

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#555555] bg-white border border-[#E5E2DA] rounded hover:border-[#8B3A2F] hover:text-[#1A1A1A] transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#8B3A2F] cursor-pointer"
            aria-label="Search resources"
          >
            <Search className="w-4 h-4 text-[#1A1A1A]" />
            <span className="hidden sm:inline text-xs font-medium text-[#777777]">
              Search vault...
            </span>
            <kbd className="hidden sm:inline-block text-[10px] uppercase font-sans font-medium px-1.5 py-0.5 bg-[#F4F2ED] text-[#666666] border border-[#DDD9CF] rounded">
              ⌘K
            </kbd>
          </button>

          {/* Settings / Gear */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded text-[#444444] hover:text-[#1A1A1A] hover:bg-[#EBE8E0] transition-colors focus:outline-none focus:ring-1 focus:ring-[#8B3A2F] cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="w-4.5 h-4.5 text-[#1A1A1A]" />
          </button>
        </div>
      </div>
    </header>
  );
};
