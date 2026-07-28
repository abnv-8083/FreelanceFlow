import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileItem } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { 
  FolderArchive, Plus, Folder, FileCode, Download, 
  Search, HardDrive, FileText, Image 
} from 'lucide-react';

export const FilesView: React.FC = () => {
  const { files, addFile } = useApp();
  const [activeFolder, setActiveFolder] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form
  const [fileName, setFileName] = useState('');
  const [folder, setFolder] = useState<'Invoices' | 'Contracts' | 'Designs' | 'Specifications' | 'General'>('Designs');

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = activeFolder === 'ALL' || f.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    addFile({
      name: fileName.trim().endsWith('.pdf') ? fileName.trim() : `${fileName.trim()}.pdf`,
      sizeBytes: 3200000,
      formattedSize: '3.2 MB',
      fileType: 'pdf',
      folder,
      downloadUrl: '#',
      version: '1.0'
    });

    setFileName('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FolderArchive className="w-7 h-7 text-accent-500" />
            File Vault & Storage
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Encrypted client assets, design specs, invoice PDFs, and version history.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Storage Quota & Folders Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {['Invoices', 'Contracts', 'Designs', 'Specifications'].map(fld => {
          const count = files.filter(f => f.folder === fld).length;
          return (
            <div
              key={fld}
              onClick={() => setActiveFolder(activeFolder === fld ? 'ALL' : fld)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeFolder === fld 
                  ? 'bg-accent-500 text-white border-accent-500 shadow-lg' 
                  : 'glass-panel border-slate-200/80 dark:border-slate-800 hover:border-accent-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Folder className="w-5 h-5" />
                <span className="text-xs font-mono font-bold">{count} files</span>
              </div>
              <div className="mt-2 text-sm font-bold truncate">{fld}</div>
            </div>
          );
        })}
      </div>

      {/* File Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search filenames..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Filter: {activeFolder}
        </span>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredFiles.map(file => (
          <div
            key={file.id}
            className="glass-panel rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-500 border border-accent-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <Badge variant="blue">{file.folder}</Badge>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {file.name}
              </h4>
              <div className="text-xs text-slate-400 mt-0.5">
                {file.formattedSize} • v{file.version}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{file.uploadDate}</span>
              <a
                href={file.downloadUrl}
                onClick={(e) => { e.preventDefault(); alert(`Simulated Download for ${file.name}`); }}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-accent-500 hover:text-white transition-colors"
                title="Download File"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Upload File Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Asset to File Vault"
        subtitle="Simulate storing documents, PDF invoices, and design wireframes"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              File Name *
            </label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Nexus_Cloud_Dashboard_Spec.pdf"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Target Folder
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            >
              <option value="Designs">Designs</option>
              <option value="Invoices">Invoices</option>
              <option value="Contracts">Contracts</option>
              <option value="Specifications">Specifications</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Upload File
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
