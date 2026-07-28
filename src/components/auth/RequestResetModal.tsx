import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Send, KeyRound, AlertCircle } from 'lucide-react';

interface RequestResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestResetModal: React.FC<RequestResetModalProps> = ({ isOpen, onClose }) => {
  const { submitPasswordResetRequest } = useApp();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [requestedPassword, setRequestedPassword] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !requestedPassword.trim()) return;

    setIsSubmitting(true);
    await submitPasswordResetRequest(email.trim(), userName.trim(), requestedPassword.trim(), note.trim());
    setIsSubmitting(false);

    setEmail('');
    setUserName('');
    setRequestedPassword('');
    setNote('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Password Reset from Admin"
      subtitle="Freelancers can request a password reset by specifying a desired new password and a note for the Admin."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
            Your Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="freelancer@freelanceflow.dev"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
            Your Name (Optional)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Alex Morgan"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
            Requested New Password *
          </label>
          <input
            type="password"
            required
            value={requestedPassword}
            onChange={(e) => setRequestedPassword(e.target.value)}
            placeholder="Enter desired new password..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
            Note to Admin (Reason for reset)
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Lost access to my old email device, please update password."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 rounded-2xl text-base font-extrabold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>Send Request to Admin</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
