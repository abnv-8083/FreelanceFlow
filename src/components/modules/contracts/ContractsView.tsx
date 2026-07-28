import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { Contract, ContractStatus } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { 
  FileText, Plus, CheckCircle2, PenTool, 
  Eye, ShieldCheck, DollarSign, Calendar 
} from 'lucide-react';

export const ContractsView: React.FC = () => {
  const { contracts, clients, addContract, signContract } = useApp();

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // E-signature canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedName, setTypedName] = useState('');

  // Create form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Proposal' | 'Contract' | 'Agreement' | 'NDA'>('Contract');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [value, setValue] = useState(15000);
  const [content, setContent] = useState('Master Services Agreement scope and terms...');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedClient = clients.find(c => c.id === clientId);

    addContract({
      title: title.trim(),
      type,
      clientId: clientId || clients[0]?.id || 'c-101',
      clientName: selectedClient?.name || 'Client',
      status: 'Sent',
      value: Number(value),
      currency: selectedClient?.preferredCurrency || 'USD',
      content,
      validUntil: '2026-12-31'
    });

    setTitle('');
    setIsCreateModalOpen(false);
  };

  // E-Signature Drawing Logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2563eb';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleApplySignature = () => {
    if (!selectedContract) return;

    let signatureDataUrl = '';
    const canvas = canvasRef.current;
    if (canvas) {
      signatureDataUrl = canvas.toDataURL('image/png');
    }

    if (!signatureDataUrl && typedName) {
      signatureDataUrl = typedName;
    }

    signContract(selectedContract.id, signatureDataUrl);
    setIsSignModalOpen(false);
    setSelectedContract(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-accent-500" />
            Contracts, Proposals & E-Signatures
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store Master Services Agreements, NDAs, and execute legally binding digital signatures.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Contract / Proposal</span>
        </button>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map(cnt => (
          <div
            key={cnt.id}
            className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:shadow-xl transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <Badge variant="purple">{cnt.type}</Badge>
              <Badge variant={cnt.status === 'Signed' ? 'emerald' : 'amber'}>
                {cnt.status === 'Signed' ? <CheckCircle2 className="w-3 h-3" /> : <PenTool className="w-3 h-3" />}
                <span>{cnt.status}</span>
              </Badge>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {cnt.title}
              </h3>
              <div className="text-xs font-semibold text-accent-500 mt-0.5">
                Client: {cnt.clientName}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Contract Value</div>
                <div className="font-mono font-extrabold text-slate-900 dark:text-white">
                  {cnt.currency} {cnt.value.toLocaleString()}
                </div>
              </div>

              {cnt.signatureDataUrl && (
                <div className="text-right">
                  <div className="text-[10px] font-mono text-emerald-500 uppercase font-bold">E-Signed</div>
                  <div className="text-[11px] font-mono text-slate-400">{cnt.signedAt}</div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedContract(cnt)}
                className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-accent-500 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Document</span>
              </button>

              {cnt.status !== 'Signed' && (
                <button
                  onClick={() => { setSelectedContract(cnt); setIsSignModalOpen(true); }}
                  className="px-3 py-1.5 rounded-xl bg-accent-500 text-white font-bold text-xs shadow hover:bg-accent-600 transition-colors flex items-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Digital E-Sign</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View Contract Modal */}
      <Modal
        isOpen={!!selectedContract && !isSignModalOpen}
        onClose={() => setSelectedContract(null)}
        title={selectedContract?.title || 'Contract Document'}
        subtitle={`Client: ${selectedContract?.clientName} • Status: ${selectedContract?.status}`}
        maxWidth="3xl"
      >
        {selectedContract && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {selectedContract.content}
            </div>

            {selectedContract.signatureDataUrl && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ✅ Legally Signed E-Signature Attached
                  </div>
                  <div className="text-xs text-slate-500">Signed on {selectedContract.signedAt}</div>
                </div>
                {selectedContract.signatureDataUrl.startsWith('data:') && (
                  <img src={selectedContract.signatureDataUrl} alt="Signature" className="h-10 bg-white p-1 rounded border" />
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* E-Signature Canvas Modal */}
      <Modal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        title="Execute Digital E-Signature"
        subtitle="Draw your signature on canvas or type full name below"
      >
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold uppercase text-slate-400">
            Draw Signature on Canvas
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 p-2 text-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-36 cursor-crosshair touch-none"
            />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Use mouse or touch screen to draw</span>
            <button
              onClick={clearCanvas}
              className="text-rose-500 font-bold hover:underline"
            >
              Clear Canvas
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSignModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleApplySignature}
              className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Apply Signature & Sign
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Contract Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Contract Document"
        subtitle="Draft proposals, Master Services Agreements, or NDAs"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Services Agreement & NDA"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Document Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="Contract">Master Contract</option>
                <option value="Proposal">Project Proposal</option>
                <option value="Agreement">Agreement</option>
                <option value="NDA">NDA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Assign Client
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              >
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Terms & Scope Content
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Save Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
