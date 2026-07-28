import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestResetModal } from './RequestResetModal';
import { UserRole } from '../../types';
import { Zap, ShieldCheck, User, Lock, ArrowRight, KeyRound, Check } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, showToast } = useApp();
  const [roleTab, setRoleTab] = useState<UserRole>('Freelancer');
  const [email, setEmail] = useState('freelancer@freelanceflow.dev');
  const [password, setPassword] = useState('Freelancer@123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setRoleTab(role);
    if (role === 'Admin') {
      setEmail('admin@freelanceflow.dev');
      setPassword('Admin@123');
    } else {
      setEmail('freelancer@freelanceflow.dev');
      setPassword('Freelancer@123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    const success = await login(email.trim(), password.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden font-sans">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-600 to-accent-400 flex items-center justify-center text-white font-black shadow-lg shadow-accent-500/30 mx-auto">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Freelance<span className="text-accent-500">Flow</span>
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your Freelancer CRM & Work Management dashboard
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleRoleChange('Freelancer')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'Freelancer' ? 'bg-accent-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Freelancer Login</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('Admin')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'Admin' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@freelanceflow.dev"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-base text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-slate-200">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-xs sm:text-sm font-semibold text-accent-500 hover:underline"
              >
                Reset Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-base text-white focus:outline-none focus:ring-2 focus:ring-accent-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-accent-500 text-white font-extrabold text-sm shadow-lg shadow-accent-500/30 hover:bg-accent-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign In to Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

 
      </div>

      {/* Password Reset Request Modal */}
      <RequestResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
