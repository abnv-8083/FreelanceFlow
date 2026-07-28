import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, X, Send, Copy, Check, FileText, Mail, 
  Clock, DollarSign, MessageSquare, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FlowAIAssistant: React.FC = () => {
  const { isAIDrawerOpen, setIsAIDrawerOpen, clients, projects, showToast } = useApp();
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isAIDrawerOpen) return null;

  const quickPrompts = [
    {
      title: 'Generate Client Proposal',
      icon: FileText,
      query: 'Draft a professional 3-phase proposal for Next.js web application redesign ($15,000 budget).'
    },
    {
      title: 'Draft Overdue Payment Email',
      icon: Mail,
      query: 'Write a polite but firm payment reminder email for invoice #INV-2026-005 due 5 days ago.'
    },
    {
      title: 'Estimate Project Timeline',
      icon: Clock,
      query: 'Estimate timeline and milestone breakdown for building a Figma to Tailwind design system.'
    },
    {
      title: 'Suggest Hourly Rate & Pricing',
      icon: DollarSign,
      query: 'What is the competitive hourly rate for a Senior Full Stack React & Node.js developer in 2026?'
    },
    {
      title: 'Summarize Meeting Notes',
      icon: MessageSquare,
      query: 'Summarize sprint alignment call into 4 clear actionable bullet points for the client.'
    }
  ];

  const handleGenerate = async (customQuery?: string) => {
    const targetQuery = customQuery || prompt;
    if (!targetQuery.trim()) return;

    setIsGenerating(true);
    setOutput(null);

    try {
      let res;
      try {
        res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: targetQuery })
        });
      } catch {
        res = await fetch('http://localhost:5000/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: targetQuery })
        });
      }

      const data = await res.json();
      if (data.output) {
        setOutput(data.output);
      } else {
        setOutput(`Note: ${data.message || 'Could not process request'}`);
      }
    } catch (err: any) {
      setOutput(`Error calling Gemini AI: ${err.message || 'Server error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    showToast('Copied FlowAI response to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAIDrawerOpen(false)}
          className="fixed inset-0 glass-overlay"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg h-full glass-panel border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col z-10"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-500 border border-purple-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  FlowAI Copilot
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    Gemini 1.5 Flash
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Powered by Google Gemini AI
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAIDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts List */}
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Instant AI Prompts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((qp, idx) => {
                const Icon = qp.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(qp.query);
                      handleGenerate(qp.query);
                    }}
                    className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 hover:bg-purple-500/10 hover:border-purple-500/30 border border-slate-200/80 dark:border-slate-700/80 text-left transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-500">
                      <Icon className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>{qp.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Output Display Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 animate-spin">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Calling Gemini 1.5 Flash AI model...
                </div>
              </div>
            ) : output ? (
              <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 space-y-4 relative group">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold text-purple-500 uppercase">
                    Gemini AI Output
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500 text-white font-semibold text-xs shadow hover:bg-purple-600 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Output'}</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {output}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 text-slate-400">
                <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                <div className="text-sm font-medium">
                  Ask FlowAI Copilot (Gemini 1.5 Flash) to generate proposals, emails, or project estimates.
                </div>
              </div>
            )}
          </div>

          {/* Prompt Input Box */}
          <div className="p-4 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Ask Gemini AI anything..."
                className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="p-2.5 rounded-xl bg-purple-500 text-white font-bold disabled:opacity-50 hover:bg-purple-600 transition-colors shadow-md shadow-purple-500/25 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
