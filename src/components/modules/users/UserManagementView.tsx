import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { 
  ShieldCheck, UserPlus, Mail, KeyRound, Check, 
  X, AlertCircle, Clock, Send, Lock 
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { 
    userAccounts, 
    resetRequests, 
    createFreelancerAccount, 
    approvePasswordResetRequest, 
    showToast 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Freelancer Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Freelancer@123');
  const [businessName, setBusinessName] = useState('Studio & Dev');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    await createFreelancerAccount({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: 'Freelancer',
      businessName: businessName.trim()
    });
    setIsSubmitting(false);

    setName('');
    setEmail('');
    setPassword('Freelancer@123');
    setIsAddModalOpen(false);
  };

  const pendingRequests = resetRequests.filter(r => r.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-purple-500" />
            Admin User & Freelancer Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create freelancer accounts, auto-send credentials email, and approve requested password resets.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:bg-purple-600 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Freelancer Account</span>
        </button>
      </div>

      {/* SECTION 1: PENDING PASSWORD RESET REQUESTS */}
      <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Freelancer Password Reset Requests
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-500">
            {pendingRequests.length} Pending
          </span>
        </div>

        <div className="space-y-3">
          {resetRequests.length > 0 ? (
            resetRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{req.userEmail}</span>
                    <Badge variant={req.status === 'Approved' ? 'emerald' : req.status === 'Pending' ? 'amber' : 'rose'}>
                      {req.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Requested New Password: <span className="font-mono font-bold text-accent-500">{req.requestedPassword}</span>
                  </div>
                  {req.note && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 italic mt-0.5">
                      "Note to Admin: {req.note}"
                    </div>
                  )}
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approvePasswordResetRequest(req.id, req.userEmail, req.requestedPassword, 'approve')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow hover:bg-emerald-600 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Reset</span>
                    </button>
                    <button
                      onClick={() => approvePasswordResetRequest(req.id, req.userEmail, req.requestedPassword, 'reject')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-rose-500 font-bold text-xs hover:bg-rose-500/10 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              No password reset requests from freelancers.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: REGISTERED FREELANCERS & CREDENTIALS DISPATCH LOG */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
          <span>Registered Freelancer Accounts & Credentials Logs</span>
          <span className="text-xs font-mono text-slate-400">{userAccounts.length} Total Users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase">
              <tr>
                <th className="p-4 font-bold">Freelancer Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Business Name</th>
                <th className="p-4 font-bold">Email Dispatch Log</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {userAccounts.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="p-4 font-mono text-accent-500">{u.email}</td>
                  <td className="p-4">
                    <Badge variant={u.role === 'Admin' ? 'purple' : 'blue'}>{u.role}</Badge>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{u.businessName || 'Studio'}</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                    {u.emailSentStatus || 'Credentials emailed'}
                  </td>
                  <td className="p-4">
                    <Badge variant="emerald">{u.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Freelancer Account Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Freelancer Account & Send Credentials"
        subtitle="Generates login account and dispatches welcome credentials email to freelancer."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
              Freelancer Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
                Email Address (Receives Credentials) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="freelancer@freelanceflow.dev"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
                Temporary Password *
              </label>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Freelancer@123"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base font-mono focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Morgan Studio"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
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
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl text-sm font-bold bg-purple-500 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Create Account & Send Email</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
