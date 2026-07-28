import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { AddClientModal } from './AddClientModal';
import { ClientDetailModal } from './ClientDetailModal';
import { Client, ClientStatus } from '../../../types';
import { 
  Users, Search, Plus, LayoutGrid, List, Phone, 
  Mail, Globe, Building, Trash2, ExternalLink 
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, deleteClient } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-accent-500" />
            Client CRM Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Name, Phone Number & Status are MANDATORY. All other business details are optional.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter & View Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, or company..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'Active', 'Prospect', 'Lead', 'Inactive', 'Blacklisted'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st 
                  ? 'bg-accent-500 text-white shadow' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow text-accent-500' : 'text-slate-400'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow text-accent-500' : 'text-slate-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map(client => (
              <div
                key={client.id}
                className="glass-panel rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={client.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                        alt={client.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <h3 
                          onClick={() => setSelectedClient(client)}
                          className="text-base font-bold text-slate-900 dark:text-white hover:text-accent-500 transition-colors cursor-pointer"
                        >
                          {client.name}
                        </h3>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {client.company || 'Individual Client'}
                        </div>
                      </div>
                    </div>

                    <Badge variant={client.status === 'Active' ? 'emerald' : client.status === 'Prospect' ? 'purple' : 'slate'}>
                      {client.status}
                    </Badge>
                  </div>

                  {/* Details list */}
                  <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-mono font-semibold bg-accent-500/5 p-2 rounded-xl border border-accent-500/15">
                      <Phone className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>{client.phone}</span>
                      <span className="ml-auto text-[9px] font-bold text-accent-500">MANDATORY</span>
                    </div>

                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}

                    {client.country && (
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{client.country} ({client.preferredCurrency || 'USD'})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Billing & Actions */}
                <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Total Billed</div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {client.preferredCurrency || 'USD'} {(client.totalBilled || 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-accent-500 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      title="Delete Client"
                      className="p-1.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Clients Available</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first client record. Remember: Name, Phone Number, and Status are mandatory fields.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-xs shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Client</span>
            </button>
          </div>
        )
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase">
                <tr>
                  <th className="p-4 font-bold">Client Name</th>
                  <th className="p-4 font-bold">Phone (Mandatory)</th>
                  <th className="p-4 font-bold">Company / Email</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Total Billed</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {filteredClients.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <img src={c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span onClick={() => setSelectedClient(c)} className="cursor-pointer hover:text-accent-500">{c.name}</span>
                    </td>
                    <td className="p-4 font-mono font-semibold text-accent-500">{c.phone}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{c.company || 'N/A'} • {c.email || 'No email'}</td>
                    <td className="p-4">
                      <Badge variant={c.status === 'Active' ? 'emerald' : 'slate'}>{c.status}</Badge>
                    </td>
                    <td className="p-4 font-extrabold">{c.preferredCurrency || 'USD'} {(c.totalBilled || 0).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelectedClient(c)} className="px-2.5 py-1 rounded-lg bg-accent-500/10 text-accent-500 font-bold hover:bg-accent-500 hover:text-white transition-colors">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Client Wizard Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Client Detail Profile Modal */}
      <ClientDetailModal
        client={selectedClient}
        isOpen={!!selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </div>
  );
};
