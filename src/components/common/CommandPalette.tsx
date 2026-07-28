import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Users, FolderKanban, CheckSquare, Clock, FileText, 
  PlusCircle, Sparkles, IndianRupee, Settings, Calendar, Briefcase 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    searchQuery, 
    setSearchQuery, 
    setActiveModule, 
    setIsAIDrawerOpen,
    clients,
    projects,
    startTimer
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (module: string) => {
    setActiveModule(module);
    setIsCommandPaletteOpen(false);
    setSearchQuery('');
  };

  const quickActions = [
    { label: 'Open FlowAI Assistant', icon: Sparkles, action: () => { setIsAIDrawerOpen(true); setIsCommandPaletteOpen(false); } },
    { label: 'Jump to Clients CRM', icon: Users, action: () => navigateTo('clients') },
    { label: 'Jump to Sales Pipeline (Kanban)', icon: Briefcase, action: () => navigateTo('leads') },
    { label: 'Jump to Active Projects', icon: FolderKanban, action: () => navigateTo('projects') },
    { label: 'Jump to Task Manager', icon: CheckSquare, action: () => navigateTo('tasks') },
    { label: 'Generate New Invoice', icon: FileText, action: () => navigateTo('invoices') },
    { label: 'Contracts & Proposals', icon: IndianRupee, action: () => navigateTo('contracts') },
    { label: 'Integrated Calendar', icon: Calendar, action: () => navigateTo('calendar') },
    { label: 'System Settings & MongoDB Status', icon: Settings, action: () => navigateTo('settings') },
  ];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCommandPaletteOpen(false)}
          className="fixed inset-0 glass-overlay"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-2xl glass-panel rounded-3xl p-4 shadow-2xl border border-slate-200/80 dark:border-slate-800 z-10 overflow-hidden"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-200/60 dark:border-slate-800">
            <Search className="w-5 h-5 text-accent-500 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a command or search clients, projects, tasks... (Esc to close)"
              className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
            />
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Action Results */}
          <div className="mt-3 max-h-96 overflow-y-auto space-y-4 px-1">
            {/* Quick Actions Group */}
            <div>
              <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Quick Actions & Navigation
              </div>
              <div className="space-y-1">
                {quickActions
                  .filter(a => a.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={item.action}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-accent-500/10 hover:text-accent-600 dark:hover:text-accent-400 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-accent-500 transition-colors" />
                          <span>{item.label}</span>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-accent-500">Jump ↵</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Clients Results */}
            {searchQuery && filteredClients.length > 0 && (
              <div>
                <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Matching Clients CRM
                </div>
                <div className="space-y-1">
                  {filteredClients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => navigateTo('clients')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{client.name}</div>
                        <div className="text-xs text-slate-400">{client.company || 'Individual Client'} • {client.phone}</div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-500 font-semibold">{client.status}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Results */}
            {searchQuery && filteredProjects.length > 0 && (
              <div>
                <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Matching Projects
                </div>
                <div className="space-y-1">
                  {filteredProjects.map(proj => (
                    <button
                      key={proj.id}
                      onClick={() => navigateTo('projects')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{proj.name}</div>
                        <div className="text-xs text-slate-400">{proj.clientName} • Deadline: {proj.deadline}</div>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{proj.progressPercentage}% complete</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
