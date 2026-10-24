import React from 'react';
import { BookOpen } from 'lucide-react';

export type AppTab = 'halogen_sr' | 'metal_sr' | 'double_replacement_ppt' | 'mixed' | 'homework';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenReference: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenReference,
}) => {
  const navTabs: { id: AppTab; label: string }[] = [
    { id: 'halogen_sr', label: 'Halogen SR' },
    { id: 'metal_sr', label: 'Metal SR' },
    { id: 'double_replacement_ppt', label: 'Precipitation' },
    { id: 'mixed', label: 'Mixed Practice' },
    { id: 'homework', label: 'Homework' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('mixed');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            Rx
          </span>
          <span>ReactionLab</span>
        </a>

        {/* Zone 2: Navigation Links (single-line tabs) */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (Reference Charts drawer toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReference}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Reference Tables</span>
            <span className="sm:hidden">Ref</span>
          </button>
        </div>
      </div>
    </header>
  );
};
