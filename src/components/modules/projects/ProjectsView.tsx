import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Project, ProjectStatus, PriorityLevel, TaskStatus, TaskViewMode } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { 
  FolderKanban, Plus, Calendar, IndianRupee, 
  CheckCircle2, AlertTriangle, Clock, Trash2, ArrowLeft,
  CheckSquare, List, LayoutGrid, Check, Tag, UserCheck
} from 'lucide-react';
import clsx from 'clsx';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    clients, 
    tasks, 
    addProject, 
    deleteProject, 
    addTask, 
    updateTaskStatus, 
    toggleTaskChecklist, 
    deleteTask 
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskViewMode, setTaskViewMode] = useState<TaskViewMode>('board');

  // New Project Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [category, setCategory] = useState('Web Application');
  const [budget, setBudget] = useState(25000);
  const [deadline, setDeadline] = useState('2026-08-30');
  const [priority, setPriority] = useState<PriorityLevel>('High');

  // New Task Form State (inside selected project)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2026-07-31');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('High');
  const [taskEstimatedHours, setTaskEstimatedHours] = useState(4);
  const [taskLabels, setTaskLabels] = useState('Frontend, Development');

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectTasks = selectedProject ? tasks.filter(t => t.projectId === selectedProject.id) : [];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedClient = clients.find(c => c.id === clientId);

    const newProj = addProject({
      name: name.trim(),
      description: description.trim() || 'Client development project',
      clientId: clientId || clients[0]?.id || 'c-101',
      clientName: selectedClient?.name || 'Client',
      category,
      budget: Number(budget),
      spentBudget: 0,
      currency: selectedClient?.preferredCurrency || 'INR',
      startDate: new Date().toISOString().split('T')[0],
      deadline,
      priority,
      status: 'In Progress',
      health: 'On Track',
      progressPercentage: 25,
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Discovery & Design Tokens', dueDate: deadline, completed: false }
      ]
    });

    setName('');
    setDescription('');
    setIsAddProjectModalOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedProject) return;

    addTask({
      title: taskTitle.trim(),
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      clientId: selectedProject.clientId,
      clientName: selectedProject.clientName,
      dueDate: taskDueDate,
      priority: taskPriority,
      status: 'Todo',
      estimatedHours: Number(taskEstimatedHours),
      actualHours: 0,
      labels: taskLabels.split(',').map(l => l.trim()).filter(Boolean),
      checklist: [],
      comments: []
    });

    setTaskTitle('');
    setIsAddTaskModalOpen(false);
  };

  const taskStatuses: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="space-y-6">
      {/* SCENARIO A: SINGLE PROJECT WORKSPACE (WITH EMBEDDED TASKS & VIEWS) */}
      {selectedProject ? (
        <div className="space-y-6">
          {/* Back Navigation Bar & Project Header */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedProjectId(null)}
                  className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>All Projects</span>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {selectedProject.name}
                    </h1>
                    <Badge variant={selectedProject.health === 'On Track' ? 'emerald' : 'amber'}>
                      {selectedProject.health}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Client: <span className="font-bold text-accent-500">{selectedProject.clientName}</span> | Category: {selectedProject.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent-500 text-white font-extrabold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
                >
                  <Plus className="w-4.5 h-4.5" />
                  <span>Add Task to Project</span>
                </button>
              </div>
            </div>

            {/* Project Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <div>
                <div className="text-xs font-mono font-bold text-slate-400">Project Budget</div>
                <div className="text-base font-mono font-extrabold text-slate-900 dark:text-white">
                  ₹{selectedProject.budget.toLocaleString()} INR
                </div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-400">Deadline</div>
                <div className="text-base font-mono font-bold text-slate-700 dark:text-slate-200">
                  {selectedProject.deadline}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-400">Progress</div>
                <div className="text-base font-mono font-extrabold text-emerald-500">
                  {selectedProject.progressPercentage}% Completed
                </div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-slate-400">Tasks Count</div>
                <div className="text-base font-mono font-bold text-accent-500">
                  {projectTasks.length} Active Tasks
                </div>
              </div>
            </div>
          </div>

          {/* TASKS & MULTI-VIEWS TOOLBAR */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-6 h-6 text-accent-500" />
                  Project Tasks & Interactive Views
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage tasks assigned specifically to {selectedProject.name}
                </p>
              </div>

              {/* View Switcher Controls */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setTaskViewMode('board')}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    taskViewMode === 'board' ? "bg-white dark:bg-slate-700 text-accent-500 shadow" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Kanban Board</span>
                </button>
                <button
                  onClick={() => setTaskViewMode('list')}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    taskViewMode === 'list' ? "bg-white dark:bg-slate-700 text-accent-500 shadow" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <List className="w-4 h-4" />
                  <span>List View</span>
                </button>
                <button
                  onClick={() => setTaskViewMode('calendar')}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    taskViewMode === 'calendar' ? "bg-white dark:bg-slate-700 text-accent-500 shadow" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Calendar</span>
                </button>
              </div>
            </div>

            {/* VIEW MODE 1: KANBAN BOARD */}
            {taskViewMode === 'board' && (
              <div className="overflow-x-auto scrollbar-top pt-3 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-[900px] scrollbar-top-content">
                  {taskStatuses.map(status => {
                  const statusTasks = projectTasks.filter(t => t.status === status);
                  return (
                    <div
                      key={status}
                      className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 min-h-[350px]"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">{status}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {statusTasks.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {statusTasks.map(task => (
                          <div
                            key={task.id}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2 group"
                          >
                            <div className="flex items-start justify-between">
                              <h4 className={`font-bold text-sm ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                {task.title}
                              </h4>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant={task.priority === 'Urgent' || task.priority === 'High' ? 'rose' : 'blue'}>
                                {task.priority}
                              </Badge>
                              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.estimatedHours}h
                              </span>
                            </div>

                            {/* Status Change Selector */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-400">Due {task.dueDate}</span>
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                                className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
                              >
                                {taskStatuses.map(s => (
                                  <option key={s} value={s} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white font-semibold">
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}

                        {statusTasks.length === 0 && (
                          <div className="text-center py-8 text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            No tasks in {status}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            )}

            {/* VIEW MODE 2: LIST VIEW */}
            {taskViewMode === 'list' && (
              <div className="space-y-3 pt-2">
                {projectTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateTaskStatus(task.id, task.status === 'Completed' ? 'Todo' : 'Completed')}
                        className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-colors ${
                          task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <div>
                        <h4 className={`font-extrabold text-base ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span>Due: {task.dueDate}</span>
                          <span>Est: {task.estimatedHours} hrs</span>
                          {task.labels.length > 0 && <span>Labels: {task.labels.join(', ')}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={task.status === 'Completed' ? 'emerald' : task.status === 'In Progress' ? 'blue' : 'amber'}>
                        {task.status}
                      </Badge>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {projectTasks.length === 0 && (
                  <div className="text-center py-12 text-sm text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                    No tasks created for this project yet. Click "+ Add Task to Project" above!
                  </div>
                )}
              </div>
            )}

            {/* VIEW MODE 3: CALENDAR VIEW */}
            {taskViewMode === 'calendar' && (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Project Tasks Due Schedule Calendar
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {projectTasks.map(task => (
                    <div key={task.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-accent-500">{task.dueDate}</span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{task.title}</h5>
                      <span className="text-[10px] text-slate-400">Status: {task.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SCENARIO B: ALL PROJECTS OVERVIEW GRID */
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <FolderKanban className="w-7 h-7 text-accent-500" />
                Projects & Integrated Tasks Workspace
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select any project to open its dedicated Tasks & Views workspace, milestones, and board.
              </p>
            </div>

            <button
              onClick={() => setIsAddProjectModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Create New Project</span>
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(proj => {
              const pTasksCount = tasks.filter(t => t.projectId === proj.id).length;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:shadow-2xl hover:border-accent-500/50 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant={proj.health === 'On Track' ? 'emerald' : proj.health === 'At Risk' ? 'amber' : 'rose'}>
                        {proj.health === 'On Track' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{proj.health}</span>
                      </Badge>

                      <Badge variant="blue">{proj.status}</Badge>
                    </div>

                    {/* Title & Client */}
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-accent-500 transition-colors">
                      {proj.name}
                    </h3>
                    <div className="text-xs font-semibold text-accent-500 mt-0.5">
                      Client: {proj.clientName}
                    </div>

                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-300">Progress</span>
                        <span className="font-mono text-accent-500">{proj.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full transition-all duration-500"
                          style={{ width: `${proj.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-5 grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50">
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Budget</div>
                        <div className="font-mono font-extrabold text-slate-900 dark:text-white">
                          ₹{proj.budget.toLocaleString()} INR
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Tasks</div>
                        <div className="font-mono font-bold text-accent-500">
                          {pTasksCount} Active Tasks
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-accent-500 group-hover:underline flex items-center gap-1">
                      <span>Open Tasks & Board →</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(proj.id);
                      }}
                      title="Delete Project"
                      className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      <Modal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        title="Create New Project"
        subtitle="Set budget, client assignment, deadlines, and priority"
      >
        <form onSubmit={handleCreateProject} className="space-y-5">
          <div>
            <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nexus Cloud Dashboard 2.0"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Assign Client *
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white font-semibold">
                    {c.name} ({c.company || 'Client'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Project Budget (₹ INR)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base font-mono font-bold focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Deadline Date
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddProjectModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-2xl text-base font-extrabold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE TASK FOR PROJECT MODAL */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title={`Add Task to ${selectedProject?.name || 'Project'}`}
        subtitle="Specify task title, priority, due date, and estimated effort"
      >
        <form onSubmit={handleCreateTask} className="space-y-5">
          <div>
            <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement REST API endpoints"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Estimated Hours
              </label>
              <input
                type="number"
                value={taskEstimatedHours}
                onChange={(e) => setTaskEstimatedHours(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base font-mono focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Labels (Comma separated)
              </label>
              <input
                type="text"
                value={taskLabels}
                onChange={(e) => setTaskLabels(e.target.value)}
                placeholder="Frontend, API, Bug"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-2xl text-base font-extrabold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
