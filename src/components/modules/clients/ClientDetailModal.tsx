import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Modal } from '../../common/Modal';
import { Badge } from '../../common/Badge';
import { Client } from '../../../types';
import { 
  Phone, Mail, Globe, MapPin, Building, FileText, 
  DollarSign, Calendar, Clock, Plus, Send, CheckCircle2 
} from 'lucide-react';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, isOpen, onClose }) => {
  const { clientTimeline, addClientTimelineEntry, updateClient } = useApp();
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogDesc, setNewLogDesc] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  if (!client) return null;

  const clientHistory = clientTimeline.filter(h => h.clientId === client.id);

  const handleAddTimelineLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;

    addClientTimelineEntry(
      client.id,
      'Note Added',
      newLogTitle.trim(),
      newLogDesc.trim() || 'Log entry created from detail panel'
    );

    setNewLogTitle('');
    setNewLogDesc('');
  };

  const handleSaveNotes = () => {
    updateClient(client.id, { notes: editedNotes });
    setIsEditingNotes(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client.name}
      subtitle={`Client CRM ID: ${client.id} • Registered ${client.createdAt}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Header Profile Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-4">
            <img
              src={client.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={client.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-300 dark:border-slate-600"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {client.name}
                </h3>
                <Badge variant={client.status === 'Active' ? 'emerald' : client.status === 'Prospect' ? 'purple' : 'slate'}>
                  {client.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-3">
                <span>{client.company || 'Individual Client'}</span>
                <span>•</span>
                <span className="font-mono text-accent-500 font-bold">{client.phone}</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Total Billed</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {client.preferredCurrency || 'USD'} {(client.totalBilled || 0).toLocaleString()}
              </div>
            </div>
            <div className="border-l border-slate-300 dark:border-slate-700 pl-4">
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Total Paid</div>
              <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {client.preferredCurrency || 'USD'} {(client.totalPaid || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Contact & Tax Information */}
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Contact & Business Telemetry
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <Phone className="w-4 h-4 text-accent-500 shrink-0" />
                <span className="font-bold">Phone (Mandatory):</span>
                <span className="font-mono text-slate-900 dark:text-white">{client.phone}</span>
              </div>

              {client.email && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <Mail className="w-4 h-4 text-accent-500 shrink-0" />
                  <span className="font-bold">Email:</span>
                  <a href={`mailto:${client.email}`} className="text-accent-500 hover:underline">{client.email}</a>
                </div>
              )}

              {client.website && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <Globe className="w-4 h-4 text-accent-500 shrink-0" />
                  <span className="font-bold">Website:</span>
                  <a href={client.website} target="_blank" rel="noreferrer" className="text-accent-500 hover:underline truncate">{client.website}</a>
                </div>
              )}

              {client.taxNumber && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <FileText className="w-4 h-4 text-accent-500 shrink-0" />
                  <span className="font-bold">GST/VAT Tax ID:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{client.taxNumber}</span>
                </div>
              )}

              {client.country && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                  <span className="font-bold">Country & Timezone:</span>
                  <span>{client.country} ({client.timezone || 'PST'})</span>
                </div>
              )}
            </div>

            {/* Notes Box */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Client Notes
                </span>
                {!isEditingNotes ? (
                  <button
                    onClick={() => { setEditedNotes(client.notes || ''); setIsEditingNotes(true); }}
                    className="text-xs font-semibold text-accent-500 hover:underline"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="text-xs font-bold text-emerald-500 hover:underline"
                  >
                    Save Notes
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  rows={3}
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-accent-500 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 italic">
                  {client.notes || 'No rich text notes added yet.'}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Client Timeline & Activity History */}
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Interactive History Log
            </div>

            {/* Add New History Log Form */}
            <form onSubmit={handleAddTimelineLog} className="p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <input
                type="text"
                placeholder="Log activity title (e.g. Call completed, Proposal sent)"
                value={newLogTitle}
                onChange={(e) => setNewLogTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Details (optional)"
                  value={newLogDesc}
                  onChange={(e) => setNewLogDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newLogTitle.trim()}
                  className="px-3 py-1.5 rounded-lg bg-accent-500 text-white font-bold text-xs shrink-0 disabled:opacity-50 hover:bg-accent-600 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* History Feed List */}
            <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
              {clientHistory.length > 0 ? (
                clientHistory.map(entry => (
                  <div key={entry.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{entry.title}</span>
                      <span className="text-[10px] text-slate-400">{entry.timestamp}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{entry.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  No timeline history recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
