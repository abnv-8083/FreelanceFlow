import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { InvoiceBuilderModal } from './InvoiceBuilderModal';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { Invoice, InvoiceStatus } from '../../../types';
import { 
  DollarSign, Plus, Search, Eye, CheckCircle2, 
  Trash2, AlertCircle, FileText 
} from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = invoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + i.totalAmount, 0);

  const totalPending = invoices
    .filter(i => i.status === 'Sent' || i.status === 'Overdue')
    .reduce((acc, i) => acc + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-accent-500" />
            Invoices & Automated Billing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total Revenue Paid: <span className="font-mono font-bold text-emerald-500">${totalCollected.toLocaleString()} USD</span> • Outstanding Pending: <span className="font-mono font-bold text-amber-500">${totalPending.toLocaleString()} USD</span>
          </p>
        </div>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number or client name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st 
                  ? 'bg-accent-500 text-white shadow' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase">
              <tr>
                <th className="p-4 font-bold">Invoice Number</th>
                <th className="p-4 font-bold">Client Name</th>
                <th className="p-4 font-bold">Due Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Total Amount</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent-500" />
                    <span>{inv.invoiceNumber}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{inv.clientName}</td>
                  <td className="p-4 font-mono text-slate-500">{inv.dueDate}</td>
                  <td className="p-4">
                    <Badge variant={inv.status === 'Paid' ? 'emerald' : inv.status === 'Overdue' ? 'rose' : 'amber'}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                    {inv.currency} {inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {inv.status !== 'Paid' && (
                      <button
                        onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold hover:bg-emerald-500 hover:text-white transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => setPreviewInvoice(inv)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-accent-500 hover:text-white text-slate-500 transition-colors"
                      title="Preview / Print PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteInvoice(inv.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors"
                      title="Delete Invoice"
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

      {/* Invoice Builder Modal */}
      <InvoiceBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onInvoiceCreated={(created) => setPreviewInvoice(created)}
      />

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        invoice={previewInvoice}
        isOpen={!!previewInvoice}
        onClose={() => setPreviewInvoice(null)}
      />
    </div>
  );
};
