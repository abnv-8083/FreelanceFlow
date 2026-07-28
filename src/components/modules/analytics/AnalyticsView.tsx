import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  BarChart3, TrendingUp, IndianRupee, Users, 
  Clock, CheckCircle2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { invoices, projects, clients } = useApp();

  const totalRev = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0);

  const revenueData = [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 },
    { month: 'Jul', revenue: totalRev },
  ];

  const completedProj = projects.filter(p => p.status === 'Completed').length;
  const inProgressProj = projects.filter(p => p.status === 'In Progress').length;
  const planningProj = projects.filter(p => p.status === 'Planning').length;

  const pieData = projects.length > 0 ? [
    { name: 'Completed', value: completedProj || 1 },
    { name: 'In Progress', value: inProgressProj || 0 },
    { name: 'Planning', value: planningProj || 0 },
  ] : [{ name: 'No Projects', value: 1 }];

  const COLORS = ['#10b981', '#3b82f6', '#a855f7'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-accent-500" />
          Business Analytics & Growth Telemetry
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time financial charts, revenue projections, and project completion metrics.
        </p>
      </div>

      {/* Chart 1: Revenue Trajectory Graph */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Monthly Revenue Trajectory (₹ INR)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              7-Month financial cashflow growth
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-blue-500">● Revenue</span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  borderColor: 'rgba(51, 65, 85, 0.8)', 
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Health & Completion Metrics */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          Project Completion Breakdown
        </h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
