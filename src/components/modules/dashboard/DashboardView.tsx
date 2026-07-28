import React from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Badge } from '../../common/Badge';
import { 
  Users, FolderKanban, IndianRupee, Clock, CheckSquare, 
  FileText, TrendingUp, Plus, ArrowRight, Zap, Sparkles 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    clients, 
    projects, 
    tasks, 
    invoices, 
    contracts, 
    timeLogs, 
    setActiveModule, 
    setIsAIDrawerOpen,
    updateTaskStatus,
    startTimer
  } = useApp();

  const totalClientsCount = clients.length;
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const totalMonthlyRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingPaymentsAmount = invoices
    .filter(i => i.status === 'Sent' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const todayTasks = tasks.filter(t => t.status !== 'Completed');

  // Dynamic Chart Data based on actual invoices or 0
  const chartData = [
    { name: 'Mon', revenue: 0 },
    { name: 'Tue', revenue: 0 },
    { name: 'Wed', revenue: 0 },
    { name: 'Thu', revenue: 0 },
    { name: 'Fri', revenue: 0 },
    { name: 'Sat', revenue: 0 },
    { name: 'Sun', revenue: totalMonthlyRevenue },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-accent-500/30 bg-gradient-to-r from-accent-500/10 via-transparent to-purple-500/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 text-xs font-mono font-bold border border-accent-500/20 mb-3">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>FREELANCER CRM DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user.name || 'Freelancer'}! ⚡
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              You have <span className="font-bold text-accent-500">{activeProjectsCount} active projects</span> in progress and <span className="font-bold text-emerald-500">₹{pendingPaymentsAmount.toLocaleString()} INR</span> in pending invoices.
            </p>
          </div>

          <div className="flex items-center gap-3">
 
            <button
              onClick={() => setIsAIDrawerOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>FlowAI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Clients CRM"
          value={totalClientsCount}
          change={totalClientsCount > 0 ? `${totalClientsCount} Active` : "0 Clients"}
          isPositive={totalClientsCount > 0}
          icon={Users}
          subtitle="Mandatory Name & Phone validation"
          onClick={() => setActiveModule('clients')}
        />
        <StatCard
          title="Active Projects"
          value={activeProjectsCount}
          change={activeProjectsCount > 0 ? `${activeProjectsCount} On Track` : "0 Projects"}
          isPositive={activeProjectsCount > 0}
          icon={FolderKanban}
          subtitle="Health metrics & milestones"
          onClick={() => setActiveModule('projects')}
        />
        <StatCard
          title="Monthly Paid Revenue"
          value={`₹${totalMonthlyRevenue.toLocaleString()}`}
          change="₹0 Collected"
          isPositive={totalMonthlyRevenue > 0}
          icon={IndianRupee}
          subtitle="UPI, Razorpay & Bank payments"
          onClick={() => setActiveModule('invoices')}
        />
        <StatCard
          title="Pending Invoices"
          value={`₹${pendingPaymentsAmount.toLocaleString()}`}
          change={`${invoices.filter(i => i.status !== 'Paid').length} Pending`}
          isPositive={false}
          icon={FileText}
          subtitle="Due within 15 days"
          onClick={() => setActiveModule('invoices')}
        />
      </div>

      {/* Chart & Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Area Graph */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Revenue Trajectory (₹ INR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly financial cashflow breakdown
              </p>
            </div>
            <button
              onClick={() => setActiveModule('analytics')}
              className="text-xs font-bold text-accent-500 hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="dashRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#dashRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Today's Actionable Tasks */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-accent-500" />
                Today's Action Items
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-accent-500/10 text-accent-500">
                {todayTasks.length}
              </span>
            </div>

            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => updateTaskStatus(task.id, task.status === 'Completed' ? 'Todo' : 'Completed')}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 shrink-0 ${task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400'}`}>
                      {task.status === 'Completed' && <CheckSquare className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {task.projectName || 'Task'} • {task.priority}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No tasks scheduled for today.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveModule('tasks')}
            className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-accent-500 hover:text-white transition-colors text-center"
          >
            Manage All Tasks & Views →
          </button>
        </div>
      </div>

      {/* Active Contracts & Clients Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Contracts List */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Active Contracts & NDAs
            </h3>
            <button onClick={() => setActiveModule('contracts')} className="text-xs font-bold text-accent-500 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {contracts.length > 0 ? (
              contracts.map(cnt => (
                <div key={cnt.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{cnt.title}</div>
                    <div className="text-slate-400">{cnt.clientName}</div>
                  </div>
                  <Badge variant={cnt.status === 'Signed' ? 'emerald' : 'amber'}>{cnt.status}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No active contracts created yet.
              </div>
            )}
          </div>
        </div>

        {/* Client Directory Quick View */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Top Clients CRM
            </h3>
            <button onClick={() => setActiveModule('clients')} className="text-xs font-bold text-accent-500 hover:underline">
              Manage CRM
            </button>
          </div>

          <div className="space-y-3">
            {clients.length > 0 ? (
              clients.slice(0, 3).map(c => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                      <div className="text-slate-400 font-mono">{c.phone}</div>
                    </div>
                  </div>
                  <Badge variant="emerald">{c.status}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No clients added to CRM yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
