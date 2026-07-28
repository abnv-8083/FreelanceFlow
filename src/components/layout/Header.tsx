import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
 
import { 
  Menu, Search, Plus, Sparkles, Moon, Sun, Palette, 
  Database, UserCheck, ShieldCheck, Check
} from 'lucide-react';
import { AccentTheme } from '../../types';
import clsx from 'clsx';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenAddClient: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar, onOpenAddClient }) => {
  const { 
    user, 
    setTheme, 
    setAccent, 
    setIsCommandPaletteOpen, 
    setIsAIDrawerOpen,
    setActiveModule
  } = useApp();

  const [isAccentMenuOpen, setIsAccentMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const accentOptions: { id: AccentTheme; name: string; colorClass: string }[] = [
    { id: 'blue', name: 'Sapphire Blue', colorClass: 'bg-blue-500' },
    { id: 'emerald', name: 'Emerald Green', colorClass: 'bg-emerald-500' },
    { id: 'purple', name: 'Violet Purple', colorClass: 'bg-purple-500' },
    { id: 'amber', name: 'Sunset Amber', colorClass: 'bg-amber-500' },
    { id: 'rose', name: 'Rose Red', colorClass: 'bg-rose-500' },
    { id: 'cyan', name: 'Cyan Wave', colorClass: 'bg-cyan-500' },
  ];

  return (
    <header className="sticky top-0 z-30 h-20 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-8 flex items-center justify-between">
      {/* Left side: Hamburger & Global Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar Ctrl+K trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium transition-all hover:border-slate-300 dark:hover:border-slate-600 w-52 sm:w-80 md:w-96"
        >
          <Search className="w-4 h-4 text-accent-500 shrink-0" />
          <span className="truncate">Search or press Ctrl + K</span>
          <kbd className="hidden sm:inline-block ml-auto px-2 py-0.5 text-xs font-mono font-bold bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Add, AI, Theme & Accent, MongoDB Status */}
      <div className="flex items-center gap-2 sm:gap-3">

 

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-500 text-white font-bold text-xs shadow-md shadow-accent-500/25 hover:bg-accent-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {isQuickAddOpen && (
            <div 
              onMouseLeave={() => setIsQuickAddOpen(false)}
              className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl p-2 shadow-xl border border-slate-200 dark:border-slate-800 z-50 text-xs font-medium space-y-1"
            >
              <button
                onClick={() => { onOpenAddClient(); setIsQuickAddOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-200"
              >
                <span>New Client CRM</span>
                <span className="text-[10px] text-accent-500 font-mono font-bold">REQ</span>
              </button>
              <button
                onClick={() => { setActiveModule('leads'); setIsQuickAddOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                New Pipeline Lead
              </button>
              <button
                onClick={() => { setActiveModule('projects'); setIsQuickAddOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                Create Project
              </button>
              <button
                onClick={() => { setActiveModule('invoices'); setIsQuickAddOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                Generate Invoice
              </button>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={() => setIsAIDrawerOpen(true)}
          title="Open FlowAI Assistant"
          className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Accent Color Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsAccentMenuOpen(!isAccentMenuOpen)}
            title="Choose Accent Color Theme"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Palette className="w-4 h-4" />
          </button>

          {isAccentMenuOpen && (
            <div 
              onMouseLeave={() => setIsAccentMenuOpen(false)}
              className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl p-3 shadow-xl border border-slate-200 dark:border-slate-800 z-50"
            >
              <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-2 px-1">
                Accent Theme
              </div>
              <div className="grid grid-cols-3 gap-2">
                {accentOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAccent(opt.id);
                      setIsAccentMenuOpen(false);
                    }}
                    title={opt.name}
                    className={clsx(
                      "w-full h-8 rounded-xl flex items-center justify-center transition-all",
                      opt.colorClass,
                      user.accent === opt.id ? "ring-2 ring-white dark:ring-slate-900 scale-105 shadow-md" : "opacity-75 hover:opacity-100"
                    )}
                  >
                    {user.accent === opt.id && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Mode Toggle (Dark/Light) */}
        <button
          onClick={() => setTheme(user.theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${user.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {user.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
};
