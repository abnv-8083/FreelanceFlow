import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CommunicationLog } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { MessageSquare, Plus, Mail, Phone, Video, Send } from 'lucide-react';

export const CommunicationView: React.FC = () => {
  const { communications, clients, addCommunication } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New log state
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [channel, setChannel] = useState<'Email' | 'WhatsApp' | 'Phone Call' | 'Meeting' | 'Message'>('Email');
  const [subject, setSubject] = useState('');
  const [summary, setSummary] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const selectedClient = clients.find(c => c.id === clientId);

    addCommunication({
      clientId: clientId || clients[0]?.id || 'c-101',
      clientName: selectedClient?.name || 'Client',
      channel,
      subject: subject.trim(),
      summary: summary.trim() || 'Log entry added',
      timestamp: new Date().toLocaleString(),
      direction: 'Outbound'
    });

    setSubject('');
    setSummary('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-accent-500" />
            Client Communication Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain complete records of client emails, WhatsApp messages, phone calls, and meeting summaries.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Communication</span>
        </button>
      </div>

      {/* Communication Timeline Feed */}
      <div className="space-y-4">
        {communications.map(comm => (
          <div
            key={comm.id}
            className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-2 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={comm.channel === 'Email' ? 'blue' : comm.channel === 'Phone Call' ? 'amber' : 'purple'}>
                  {comm.channel}
                </Badge>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{comm.clientName}</span>
              </div>
              <span className="text-xs font-mono text-slate-400">{comm.timestamp}</span>
            </div>

            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white pt-1">
              {comm.subject}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {comm.summary}
            </p>
          </div>
        ))}
      </div>

      {/* Log Communication Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Client Interaction"
        subtitle="Record summary of call, email thread, or WhatsApp message"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Select Client *
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            >
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Message">Message</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Subject Line *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Feedback on dark mode component library"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Interaction Summary
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Key decisions, client approvals, or follow-up items..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Save Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
