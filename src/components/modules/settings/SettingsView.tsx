import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { AccentTheme } from '../../../types';
import { 
  Settings, Palette, Moon, Sun, Download 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    setTheme, 
    setAccent, 
    showToast,
    clients
  } = useApp();

  // Business info state
  const [businessName, setBusinessName] = useState(user.businessName);
  const [taxNumber, setTaxNumber] = useState(user.taxNumber || '');
  const [currency, setCurrency] = useState(user.defaultCurrency);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      businessName,
      taxNumber,
      defaultCurrency: currency
    });
  };

  const handleExportCSV = () => {
    // Generate CSV string of Clients
    let csv = 'Name,Phone,Status,Company,Email,TotalBilled,TotalPaid\n';
    clients.forEach(c => {
      csv += `"${c.name}","${c.phone}","${c.status}","${c.company || ''}","${c.email || ''}",${c.totalBilled || 0},${c.totalPaid || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freelanceflow_clients_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Exported Clients CRM to CSV file!', 'success');
  };

  const accentOptions: { id: AccentTheme; name: string; colorClass: string }[] = [
    { id: 'blue', name: 'Sapphire Blue', colorClass: 'bg-blue-500' },
    { id: 'emerald', name: 'Emerald Green', colorClass: 'bg-emerald-500' },
    { id: 'purple', name: 'Violet Purple', colorClass: 'bg-purple-500' },
    { id: 'amber', name: 'Sunset Amber', colorClass: 'bg-amber-500' },
    { id: 'rose', name: 'Rose Red', colorClass: 'bg-rose-500' },
    { id: 'cyan', name: 'Cyan Wave', colorClass: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-accent-500" />
          Settings & Customization
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure theme accents, business branding, and CSV data exports.
        </p>
      </div>

      {/* SECTION 1: ACCENT THEME & APPEARANCE */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-accent-500/10 text-accent-500 border border-accent-500/20">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Accent Color Customization & Theme Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize application highlights, cards, badges, and background theme
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-2">Select Accent Theme</div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {accentOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAccent(opt.id)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    user.accent === opt.id 
                      ? 'bg-accent-500/10 border-accent-500 text-slate-900 dark:text-white shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${opt.colorClass} shadow`} />
                  <span className="text-[11px] font-bold">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Dark / Light Mode</span>
            <button
              onClick={() => setTheme(user.theme === 'dark' ? 'light' : 'dark')}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2"
            >
              {user.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>Currently: {user.theme.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: BUSINESS PROFILE */}
      <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          Business Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Studio / Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Tax ID / GST Number
            </label>
            <input
              type="text"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Default Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-accent-500 text-white font-extrabold text-xs shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
          >
            Save Profile Settings
          </button>
        </div>
      </form>

      {/* SECTION 3: DATA EXPORT */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Export Clients CRM Data
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Download full client directory records in CSV spreadsheet format.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold text-xs shadow hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-accent-500" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};
