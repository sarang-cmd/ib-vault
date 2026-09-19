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
            <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" viewBox="0 0 64 64" aria-hidden="true">
              <rect x="2" y="2" width="60" height="60" rx="10" fill="#F4F2ED"/>
              <path d="M18 46 L18 24 Q18 18 24 18 L40 18 Q46 18 46 24 L46 46 Z" fill="#8B3A2F"/>
              <path d="M22 46 L22 24 Q22 20 26 20 L38 20 Q42 20 42 24 L42 46 Z" fill="#6B2D23"/>
              <path d="M28 28 L32 38 L36 28" stroke="#F4F2ED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <text x="32" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" fill="#1A1A1A" text-anchor="middle" letter-spacing="1">IB</text>
            </svg>
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
