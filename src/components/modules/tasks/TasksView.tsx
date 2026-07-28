import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Task, TaskStatus, PriorityLevel, TaskViewMode } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { 
  CheckSquare, Plus, List, LayoutGrid, Calendar, 
  Clock, Check, AlertCircle, Trash2, ArrowRight 
} from 'lucide-react';
import clsx from 'clsx';

export const TasksView: React.FC = () => {
  const { tasks, projects, addTask, updateTaskStatus, toggleTaskChecklist, deleteTask } = useApp();
  const [viewMode, setViewMode] = useState<TaskViewMode>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Task Form
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-07-31');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [labels, setLabels] = useState('Frontend, UI/UX');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedProj = projects.find(p => p.id === projectId);

    addTask({
      title: title.trim(),
      projectId,
      projectName: selectedProj?.name || 'General Task',
      clientId: selectedProj?.clientId,
      clientName: selectedProj?.clientName,
      dueDate,
      priority,
      status: 'Todo',
      estimatedHours: Number(estimatedHours),
      actualHours: 0,
      labels: labels.split(',').map(l => l.trim()).filter(Boolean),
      checklist: [],
      comments: []
    });

    setTitle('');
    setIsAddModalOpen(false);
  };

  const statuses: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-accent-500" />
            Task Management & Multi-Views
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Toggle between List View, Kanban Board, Calendar, and Timeline Gantt charts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                viewMode === 'list' ? "bg-white dark:bg-slate-700 text-accent-500 shadow" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                viewMode === 'board' ? "bg-white dark:bg-slate-700 text-accent-500 shadow" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                viewMode === 'calendar' ? "bg-white dark:bg-slate-700 text-accent-500 shadow" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                viewMode === 'gantt' ? "bg-white dark:bg-slate-700 text-accent-500 shadow" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gantt</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* 1. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="space-y-3">
            {tasks.map(t => (
              <div
                key={t.id}
                className="flex items-start justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => updateTaskStatus(t.id, t.status === 'Completed' ? 'Todo' : 'Completed')}
                    className={clsx(
                      "w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 transition-colors shrink-0",
                      t.status === 'Completed'
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 dark:border-slate-600 hover:border-accent-500"
                    )}
                  >
                    {t.status === 'Completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <div className={clsx(
                      "text-sm font-bold text-slate-900 dark:text-white transition-all",
                      t.status === 'Completed' && "line-through text-slate-400 dark:text-slate-500"
                    )}>
                      {t.title}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{t.projectName || 'General Task'}</span>
                      <span>•</span>
                      <span>Due: {t.dueDate}</span>
                      <span>•</span>
                      <span className="font-mono text-accent-500">{t.estimatedHours}h est</span>
                    </div>

                    {/* Subtasks checklist */}
                    {t.checklist.length > 0 && (
                      <div className="mt-2.5 space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                        {t.checklist.map(item => (
                          <div
                            key={item.id}
                            onClick={() => toggleTaskChecklist(t.id, item.id)}
                            className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:text-accent-500"
                          >
                            <span className={clsx("w-3.5 h-3.5 rounded border flex items-center justify-center", item.completed ? "bg-accent-500 text-white" : "border-slate-400")}>
                              {item.completed && <Check className="w-2.5 h-2.5" />}
                            </span>
                            <span className={item.completed ? "line-through text-slate-400" : ""}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={t.priority === 'Urgent' ? 'rose' : t.priority === 'High' ? 'amber' : 'blue'}>
                    {t.priority}
                  </Badge>

                  <select
                    value={t.status}
                    onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                    className="bg-transparent text-xs font-bold text-slate-500 focus:outline-none cursor-pointer"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. KANBAN BOARD VIEW */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statuses.map(st => {
            const stTasks = tasks.filter(t => t.status === st);
            return (
              <div key={st} className="glass-panel rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800 font-bold text-sm">
                  <span>{st}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-200 dark:bg-slate-800">
                    {stTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stTasks.map(t => (
                    <div key={t.id} className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 shadow-sm space-y-2">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</div>
                      <div className="text-xs text-slate-400">{t.projectName}</div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800 text-xs">
                        <Badge variant={t.priority === 'Urgent' ? 'rose' : 'blue'}>{t.priority}</Badge>
                        <select
                          value={t.status}
                          onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                          className="bg-transparent text-[10px] font-bold text-slate-400"
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Task Due Date Schedule
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tasks.map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-accent-500">{t.dueDate}</span>
                  <Badge variant={t.status === 'Completed' ? 'emerald' : 'blue'}>{t.status}</Badge>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</div>
                <div className="text-xs text-slate-400">{t.projectName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. GANTT TIMELINE VIEW */}
      {viewMode === 'gantt' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Gantt Hours & Estimated Timeline
          </div>
          <div className="space-y-4">
            {tasks.map(t => (
              <div key={t.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{t.title}</span>
                  <span className="font-mono text-accent-500">{t.estimatedHours} Hours</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-500 to-purple-500 rounded-full"
                    style={{ width: `${Math.min(t.estimatedHours * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Task"
        subtitle="Set priority, estimated hours, and project association"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Dark/Light Mode Switcher"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
