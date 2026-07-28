import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { 
  Clock, Play, Pause, Square, Plus, 
  Calendar, CheckCircle2, FileText 
} from 'lucide-react';

export const TimeTrackerView: React.FC = () => {
  const { 
    timeLogs, 
    activeTimer, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer, 
    addManualTimeLog, 
    projects
  } = useApp();

  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual log state
  const [manualDesc, setManualDesc] = useState('');
  const [manualHours, setManualHours] = useState(2.5);

  const formatSeconds = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    startTimer(description.trim() || 'Work session', projectId, undefined);
    setDescription('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDesc.trim()) return;

    const selectedProj = projects.find(p => p.id === projectId);
    const secs = Math.round(Number(manualHours) * 3600);

    addManualTimeLog({
      projectId,
      projectName: selectedProj?.name || 'General Work',
      clientId: selectedProj?.clientId,
      clientName: selectedProj?.clientName,
      description: manualDesc.trim(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: secs,
      isBillable: true,
      hourlyRate: 0,
      totalEarnings: 0,
      date: new Date().toISOString().split('T')[0]
    });

    setManualDesc('');
    setIsManualModalOpen(false);
  };

  const totalHoursLogged = (timeLogs.reduce((acc, l) => acc + l.durationSeconds, 0) / 3600).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-accent-500" />
            Time Tracking & Work Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total Hours Logged: <span className="font-mono font-bold text-accent-500">{totalHoursLogged} hrs</span>
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Time Log</span>
        </button>
      </div>

      {/* Live Stopwatch Panel */}
      <div className="glass-panel rounded-3xl p-6 border border-accent-500/30 bg-gradient-to-r from-accent-500/10 via-transparent to-accent-500/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Digital Clock Display */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-accent-500 text-white shadow-xl shadow-accent-500/30">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase font-bold text-slate-400">
                Live Session Timer
              </div>
              <div className="text-4xl sm:text-5xl font-mono font-black text-slate-900 dark:text-white tracking-wider">
                {formatSeconds(activeTimer.elapsedSeconds)}
              </div>
            </div>
          </div>

          {/* Controls & Inputs */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
            {!activeTimer.isRunning && activeTimer.elapsedSeconds === 0 ? (
              <>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you working on right now?"
                  className="w-full sm:w-64 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleStart}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-accent-500 text-white font-extrabold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Live Timer</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {activeTimer.isRunning ? (
                  <button
                    onClick={pauseTimer}
                    className="px-5 py-2.5 rounded-2xl bg-amber-500 text-white font-extrabold text-sm shadow-md hover:bg-amber-600 transition-colors flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeTimer}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-500 text-white font-extrabold text-sm shadow-md hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume</span>
                  </button>
                )}

                <button
                  onClick={stopTimer}
                  className="px-6 py-2.5 rounded-2xl bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-colors flex items-center gap-2"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Save & Stop Log</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Time Logs Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          Logged Sessions
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase">
              <tr>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Description</th>
                <th className="p-4 font-bold">Project / Client</th>
                <th className="p-4 font-bold">Duration</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {timeLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono text-slate-500">{log.date}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{log.description}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{log.projectName || 'General Work'}</td>
                  <td className="p-4 font-mono font-bold text-accent-500">
                    {(log.durationSeconds / 3600).toFixed(2)} hrs
                  </td>
                  <td className="p-4">
                    <Badge variant="emerald">Logged</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Time Log Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Add Manual Time Log"
        subtitle="Log past hours worked on a client project"
      >
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Work Description *
            </label>
            <input
              type="text"
              required
              value={manualDesc}
              onChange={(e) => setManualDesc(e.target.value)}
              placeholder="e.g. Configured API routes and database schemas"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Hours Logged
            </label>
            <input
              type="number"
              step="0.25"
              value={manualHours}
              onChange={(e) => setManualHours(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Save Time Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
