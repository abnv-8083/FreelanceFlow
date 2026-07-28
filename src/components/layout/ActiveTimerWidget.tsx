import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, Square, Clock } from 'lucide-react';

export const ActiveTimerWidget: React.FC = () => {
  const { activeTimer, pauseTimer, resumeTimer, stopTimer } = useApp();

  const formatSeconds = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeTimer.isRunning && activeTimer.elapsedSeconds === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-slate-900 dark:text-white text-xs font-semibold shadow-sm">
      <div className="flex items-center gap-1.5 text-accent-600 dark:text-accent-400">
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        <span className="font-mono font-bold text-sm tracking-wider">
          {formatSeconds(activeTimer.elapsedSeconds)}
        </span>
      </div>

      <span className="hidden md:inline text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
        {activeTimer.description || 'Active Timer'}
      </span>

      <div className="flex items-center gap-1 ml-1 border-l border-slate-200 dark:border-slate-700 pl-1.5">
        {activeTimer.isRunning ? (
          <button
            onClick={pauseTimer}
            title="Pause Timer"
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500 transition-colors"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={resumeTimer}
            title="Resume Timer"
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-500 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={stopTimer}
          title="Save & Stop Timer"
          className="p-1 rounded-full hover:bg-rose-500/20 text-rose-500 transition-colors"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
};
