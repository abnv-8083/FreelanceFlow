import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  accentColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        "glass-panel rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-3 rounded-2xl bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {change && (
          <div className={clsx(
            "flex items-center text-xs font-extrabold px-2.5 py-1 rounded-full border",
            isPositive 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
          )}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            {change}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
