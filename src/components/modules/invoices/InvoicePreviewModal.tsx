import React from 'react';
import { Modal } from '../../common/Modal';
import { Invoice } from '../../../types';
import { useApp } from '../../../context/AppContext';
import { Printer, Download, CheckCircle2, Zap } from 'lucide-react';

interface InvoicePreviewModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({ invoice, isOpen, onClose }) => {
  const { user } = useApp();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice ${invoice.invoiceNumber}`}
      subtitle={`Issue Date: ${invoice.issueDate} • Status: ${invoice.status}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Print Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-accent-500/10 border border-accent-500/30">
          <div className="text-xs font-semibold text-accent-600 dark:text-accent-400">
            Invoice document ready for export
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-accent-500 text-white font-bold text-xs shadow hover:bg-accent-600 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div id="printable-invoice" className="p-8 rounded-3xl bg-white text-slate-900 shadow-xl border border-slate-200 space-y-6">
          {/* Top Header Logo */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xl font-black text-slate-900 tracking-tight">
                <Zap className="w-6 h-6 text-blue-600 fill-current" />
                <span>{user.businessName || 'Morgan Studio & Dev'}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{user.address}</div>
              <div className="text-xs text-slate-500">Tax ID: {user.taxNumber}</div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-blue-600">INVOICE</div>
              <div className="text-sm font-mono font-bold text-slate-800">{invoice.invoiceNumber}</div>
              <div className="text-xs text-slate-500 mt-1">Date: {invoice.issueDate}</div>
              <div className="text-xs text-slate-500">Due Date: {invoice.dueDate}</div>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-6 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-mono font-bold uppercase text-slate-400 mb-1">Billed To:</div>
              <div className="font-bold text-sm text-slate-900">{invoice.clientName}</div>
              <div className="text-slate-600">{invoice.clientEmail || 'No email specified'}</div>
              <div className="text-slate-600">{invoice.clientAddress || 'Client Address'}</div>
            </div>
            <div>
              <div className="font-mono font-bold uppercase text-slate-400 mb-1">Payment Method:</div>
              <div className="font-bold text-slate-900">{invoice.paymentMethod || 'Stripe / Bank Transfer'}</div>
              <div className="text-slate-600 mt-1">Status: <span className="font-bold text-emerald-600">{invoice.status}</span></div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 font-mono uppercase text-slate-500">
                <th className="py-2">Description</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-800">{item.description}</td>
                  <td className="py-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">${item.unitPrice.toLocaleString()}</td>
                  <td className="py-3 text-right font-mono font-bold">${item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">${invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({invoice.taxPercentage}%):</span>
                <span className="font-mono font-bold">${invoice.taxAmount.toLocaleString()}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Discount:</span>
                  <span className="font-mono font-bold">-${invoice.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-300 flex justify-between text-base font-black text-slate-900">
                <span>Total Due:</span>
                <span className="font-mono text-blue-600">${invoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms Footer */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500">
            <div className="font-bold text-slate-700 mb-1">Notes & Terms:</div>
            <div>{invoice.notes || 'Thank you for your business! Please remit payment prior to due date.'}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
