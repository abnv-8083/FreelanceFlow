import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Lead, LeadStage } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { 
  Briefcase, Plus, IndianRupee, ArrowRight, UserCheck, 
  Trash2, Phone, Mail, TrendingUp 
} from 'lucide-react';

export const PipelineView: React.FC = () => {
  const { leads, addLead, updateLeadStage, convertLeadToClient, deleteLead } = useApp();
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(25000);
  const [currency, setCurrency] = useState('INR');
  const [confidence, setConfidence] = useState(75);

  const stages: LeadStage[] = [
    'New Lead', 
    'Contacted', 
    'Discussion', 
    'Proposal', 
    'Negotiation', 
    'Won', 
    'Lost'
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addLead({
      name: name.trim(),
      phone: phone.trim(),
      company: company.trim() || undefined,
      email: email.trim() || undefined,
      stage: 'New Lead',
      estimatedValue: Number(estimatedValue),
      currency,
      confidenceProbability: Number(confidence)
    });

    setName('');
    setPhone('');
    setCompany('');
    setEmail('');
    setIsAddLeadModalOpen(false);
  };

  const totalPipelineValue = leads
    .filter(l => l.stage !== 'Lost')
    .reduce((acc, l) => acc + l.estimatedValue, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-accent-500" />
            Sales Pipeline & Lead Kanban
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total Active Pipeline Value: <span className="font-mono font-bold text-emerald-500">₹{totalPipelineValue.toLocaleString()} INR</span>
          </p>
        </div>

        <button
          onClick={() => setIsAddLeadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pipeline Lead</span>
        </button>
      </div>

      {/* Pipeline Kanban Columns horizontal scroll with top scrollbar */}
      <div className="overflow-x-auto scrollbar-top pt-3 pb-2">
        <div className="flex items-start gap-4 scrollbar-top-content">
          {stages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage);
          const stageTotal = stageLeads.reduce((sum, l) => sum + l.estimatedValue, 0);

          return (
            <div
              key={stage}
              className="w-72 shrink-0 glass-panel rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{stage}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {stageLeads.length}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  ₹{stageTotal.toLocaleString()}
                </span>
              </div>

              {/* Deals Cards List */}
              <div className="space-y-3 mt-3 overflow-y-auto pr-1">
                {stageLeads.map(lead => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {lead.name}
                        </h4>
                        {lead.company && (
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {lead.company}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <div className="font-mono font-bold text-accent-500 flex items-center gap-1">
                        <span>₹{lead.estimatedValue.toLocaleString()} INR</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span>Confidence: {lead.confidenceProbability}%</span>
                        <span>{lead.createdAt}</span>
                      </div>
                    </div>

                    {/* Stage Actions */}
                    <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => convertLeadToClient(lead.id)}
                        title="Convert to Active Client CRM"
                        className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] hover:bg-emerald-500 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Convert to CRM</span>
                      </button>

                      {/* Select stage move with explicit dark background option styling */}
                      <select
                        value={lead.stage}
                        onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none cursor-pointer"
                      >
                        {stages.map(s => (
                          <option 
                            key={s} 
                            value={s} 
                            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white font-semibold py-1"
                          >
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    No deals in {stage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        title="Add New Lead to Sales Pipeline"
        subtitle="Track potential deals, estimated revenue, and confidence score"
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marcus Vance"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Company (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Health Systems"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Estimated Deal Value (₹)
              </label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddLeadModalOpen(false)}
              className="px-5 py-2.5 rounded-2xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-2xl text-base font-extrabold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Create Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
