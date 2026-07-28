import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Modal } from '../../common/Modal';
import { InvoiceLineItem, PaymentMethod } from '../../../types';
import { Plus, Trash2, DollarSign, Calculator } from 'lucide-react';

interface InvoiceBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: any) => void;
}

export const InvoiceBuilderModal: React.FC<InvoiceBuilderModalProps> = ({ isOpen, onClose, onInvoiceCreated }) => {
  const { clients, projects, addInvoice } = useApp();

  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-08-15');
  const [currency, setCurrency] = useState('USD');
  const [taxPercentage, setTaxPercentage] = useState(10);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Stripe');
  const [notes, setNotes] = useState('Payment due within 15 days of invoice date.');

  // Line items state
  const [items, setItems] = useState<InvoiceLineItem[]>([
    { id: 'ii-1', description: 'Web Application UI/UX Design Milestone 1', quantity: 1, unitPrice: 4500, amount: 4500 }
  ]);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { id: `ii-${Date.now()}`, description: 'Development Services', quantity: 1, unitPrice: 1500, amount: 1500 }
    ]);
  };

  const handleItemChange = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const taxAmount = (subtotal * taxPercentage) / 100;
  const totalAmount = subtotal + taxAmount - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find(c => c.id === clientId);
    const selectedProj = projects.find(p => p.id === projectId);

    const created = addInvoice({
      clientId: clientId || clients[0]?.id || 'c-101',
      clientName: selectedClient?.name || 'Client',
      clientEmail: selectedClient?.email,
      clientAddress: selectedClient?.address,
      projectId,
      projectName: selectedProj?.name,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      items,
      subtotal,
      taxPercentage: Number(taxPercentage),
      taxAmount,
      discountAmount: Number(discountAmount),
      totalAmount,
      amountPaid: 0,
      currency,
      status: 'Sent',
      paymentMethod,
      notes
    });

    onInvoiceCreated(created);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Professional Invoice"
      subtitle="Auto-calculated subtotal, tax rate, and payment terms"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Client & Project Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Select Client *
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none text-slate-900 dark:text-white"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.company || 'Client'})</option>
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
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none text-slate-900 dark:text-white"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        {/* Line Items Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">
              Services & Line Items
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-bold text-accent-500 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                  className="w-20 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-center font-mono"
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                  className="w-28 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-right font-mono"
                />
                <div className="w-28 text-right font-mono font-extrabold text-slate-900 dark:text-white pr-2">
                  ${item.amount.toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Summary Footer */}
        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Subtotal:</span>
            <span className="font-mono font-bold">{currency} {subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <span>Tax ({taxPercentage}%):</span>
            </span>
            <span className="font-mono font-bold">{currency} {taxAmount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <span>Discount Amount:</span>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className="w-24 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border text-right font-mono"
            />
          </div>

          <div className="pt-2 border-t border-slate-300 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white">
            <span>Total Payable:</span>
            <span className="font-mono text-emerald-500 text-base">{currency} {totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
          >
            Generate & Preview Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};
