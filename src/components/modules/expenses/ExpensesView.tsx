import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Expense, ExpenseCategory } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { 
  Wallet, Plus, DollarSign, TrendingUp, TrendingDown, 
  Trash2, CreditCard, PieChart 
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, invoices } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Expense State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Software');
  const [amount, setAmount] = useState(49);
  const [vendor, setVendor] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addExpense({
      title: title.trim(),
      category,
      amount: Number(amount),
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      vendor: vendor.trim() || undefined,
      isRecurring: true
    });

    setTitle('');
    setVendor('');
    setIsAddModalOpen(false);
  };

  const totalPaidRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + i.totalAmount, 0);

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalPaidRevenue - totalExpenses;

  const categories: ExpenseCategory[] = [
    'Software', 'Hosting', 'Internet', 'Travel', 'Equipment', 'Marketing', 'Salary', 'Others'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-7 h-7 text-accent-500" />
            Expense Tracker & Profit Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor software subscriptions, infrastructure hosting, equipment, and net profit margin.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-mono font-bold uppercase text-slate-400">Total Revenue Collected</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            ${totalPaidRevenue.toLocaleString()} USD
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-rose-500/30">
          <div className="text-xs font-mono font-bold uppercase text-rose-500">Total Business Expenses</div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
            ${totalExpenses.toLocaleString()} USD
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5 border border-emerald-500/30 bg-emerald-500/5">
          <div className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">Calculated Net Profit</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            ${netProfit.toLocaleString()} USD
          </div>
        </div>
      </div>

      {/* Expense List Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
          Logged Expenses Breakdown
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase">
              <tr>
                <th className="p-4 font-bold">Expense Title</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Vendor</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold text-right">Amount</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{exp.title}</td>
                  <td className="p-4">
                    <Badge variant="purple">{exp.category}</Badge>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{exp.vendor || 'Direct Vendor'}</td>
                  <td className="p-4 font-mono text-slate-500">{exp.date}</td>
                  <td className="p-4 font-mono font-extrabold text-rose-500 text-right">
                    -${exp.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Business Expense"
        subtitle="Categorize software subscriptions, server hosting, and equipment"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Expense Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vercel Pro Hosting & Domain"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Vendor Name (Optional)
            </label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. Apple Store, Vercel, Figma"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
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
              Save Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
