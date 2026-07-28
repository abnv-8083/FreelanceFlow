import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Users, Briefcase, FolderKanban, CheckSquare, 
  Clock, IndianRupee, Wallet, FileText, FolderArchive, Calendar, 
  MessageSquare, BarChart3, Settings, Zap, Sparkles, ShieldCheck, 
  LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileOpen, 
  setIsMobileOpen, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const { 
    activeModule, 
    setActiveModule, 
    setIsAIDrawerOpen,
    clients,
    projects,
    tasks,
    invoices,
    leads,
    currentUser,
    logout,
    resetRequests
  } = useApp();

  const pendingResetCount = resetRequests.filter(r => r.status === 'Pending').length;

  const navGroups = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'clients', label: 'Client CRM', icon: Users, badge: clients.length },
        { id: 'leads', label: 'Sales Pipeline', icon: Briefcase, badge: leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost').length },
        { id: 'projects', label: 'Projects & Tasks', icon: FolderKanban, badge: projects.length },
      ]
    },
    {
      title: 'FINANCE & BILLING',
      items: [
        { id: 'invoices', label: 'Invoices & Billing', icon: IndianRupee, badge: invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').length },
        { id: 'contracts', label: 'Contracts & Proposals', icon: FileText },
      ]
    },
    {
      title: 'WORKSPACE & ADMIN',
      items: [
        ...(currentUser?.role === 'Admin' ? [
          { id: 'users', label: 'User & Reset Requests', icon: ShieldCheck, badge: pendingResetCount }
        ] : []),
        { id: 'files', label: 'File Vault', icon: FolderArchive },
        { id: 'calendar', label: 'Calendar & Meetings', icon: Calendar },
        { id: 'communication', label: 'Client Communication', icon: MessageSquare },
        { id: 'analytics', label: 'Business Insights', icon: BarChart3 },
        { id: 'settings', label: 'Settings & Branding', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-all duration-300 lg:translate-x-0",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveModule('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-600 to-accent-400 flex items-center justify-center text-white font-black shadow-lg shadow-accent-500/20 shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                  Freelance<span className="text-accent-500">Flow</span>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1">
                  <span>{currentUser?.role || 'Freelancer'} Mode</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* AI Assistant Quick Trigger Banner */}
        <div className="p-3 mx-2 mt-3">
          <button
            onClick={() => setIsAIDrawerOpen(true)}
            title="FlowAI Assistant (Ctrl+K)"
            className={clsx(
              "w-full flex items-center p-3 rounded-2xl bg-gradient-to-r from-accent-500/15 via-purple-500/15 to-accent-500/15 border border-accent-500/30 hover:border-accent-500/60 transition-all duration-200 group",
              isCollapsed && !isMobileOpen ? "justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-accent-500 text-white shadow-sm shrink-0">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-accent-500 transition-colors">
                    FlowAI Assistant
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Gemini 1.5 Flash Copilot
                  </div>
                </div>
              )}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-xs font-mono font-bold text-accent-500">Ctrl+K</span>
            )}
          </button>
        </div>

        {/* Navigation Items Scrollable */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              {(!isCollapsed || isMobileOpen) ? (
                <div className="px-3 mb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {group.title}
                </div>
              ) : (
                <div className="h-px bg-slate-200/60 dark:border-slate-800 my-2" />
              )}
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id);
                        setIsMobileOpen(false);
                      }}
                      title={isCollapsed && !isMobileOpen ? item.label : undefined}
                      className={clsx(
                        "w-full flex items-center rounded-2xl text-sm font-semibold transition-all duration-150 group relative",
                        isCollapsed && !isMobileOpen ? "justify-center p-3" : "justify-between px-3 py-2.5",
                        isActive
                          ? "bg-accent-500 text-white shadow-md shadow-accent-500/20"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={clsx("w-5 h-5 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200")} />
                        {(!isCollapsed || isMobileOpen) && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={clsx(
                          "px-2 py-0.5 text-xs font-bold rounded-full",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                          isCollapsed && !isMobileOpen && "absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px]"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer User Profile & Logout */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800">
          <div className={clsx(
            "flex items-center p-2 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40",
            isCollapsed && !isMobileOpen ? "justify-center" : "justify-between"
          )}>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="truncate max-w-[100px]">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Alex Morgan'}
                  </div>
                  <div className="text-[10px] font-semibold text-accent-500 truncate">
                    {currentUser?.role || 'Freelancer'}
                  </div>
                </div>
              )}
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
