import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Modal } from '../../common/Modal';
import { ClientStatus, PaymentMethod } from '../../../types';
import { AlertCircle } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient } = useApp();

  // Mandatory fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<ClientStatus>('Active');

  // Optional fields
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('India');
  const [timezone, setTimezone] = useState('IST (UTC+5:30)');
  const [industry, setIndustry] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('INR');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');

  // Validation Error State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Mandatory Field Checks
    if (!name.trim()) {
      setErrorMessage('Client Name is mandatory.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Phone Number is mandatory.');
      return;
    }

    const result = addClient({
      name: name.trim(),
      phone: phone.trim(),
      status,
      company: company.trim() || undefined,
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      address: address.trim() || undefined,
      country: country.trim() || undefined,
      timezone: timezone.trim() || undefined,
      industry: industry.trim() || undefined,
      taxNumber: taxNumber.trim() || undefined,
      preferredCurrency,
      paymentMethod,
      notes: notes.trim() || undefined,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`
    });

    if (result.success) {
      // Reset Form
      setName('');
      setPhone('');
      setStatus('Active');
      setCompany('');
      setEmail('');
      setWebsite('');
      setNotes('');
      onClose();
    } else {
      setErrorMessage(result.message || 'Validation error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client"
      subtitle="Name, Phone, and Status are MANDATORY. All other fields are optional."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SECTION 1: MANDATORY FIELDS */}
        <div className="p-5 rounded-2xl bg-accent-500/5 border border-accent-500/20 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
              Mandatory Fields (Required)
            </h4>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent-500 text-white">
              REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Client Name (Mandatory) */}
            <div>
              <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
                Client Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
              />
            </div>

            {/* Phone Number (Mandatory) */}
            <div>
              <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none font-mono"
              />
            </div>

            {/* Status (Mandatory) */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold sm:text-base text-slate-800 dark:text-slate-100 mb-1.5">
                Client Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
              >
                <option value="Active">Active Client</option>
                <option value="Prospect">Prospect</option>
                <option value="Lead">Lead</option>
                <option value="Inactive">Inactive</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: OPTIONAL DETAILS */}
        <div className="space-y-5">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Optional Business & Contact Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Company Name (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Nexus Tech Solutions"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah@nexustech.io"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Website URL (Optional)
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://nexustech.io"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                GST / VAT Tax Number (Optional)
              </label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="e.g. 27AAAAA0000A1Z5"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Preferred Currency
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Industry (Optional)
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Software, E-Commerce, Fintech"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Notes & Client Preferences (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add rich text notes, project guidelines, or billing preferences..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-base font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-7 py-3 rounded-2xl text-base font-extrabold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
          >
            Create Client Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
