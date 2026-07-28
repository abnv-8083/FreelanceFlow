import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, Client, Lead, Project, Task, TimeLog, Invoice, Expense, 
  Contract, FileItem, CommunicationLog, CalendarEvent, RichNote, ClientTimelineItem, 
  AccentTheme, AppTheme, ClientStatus, LeadStage, TaskStatus, InvoiceStatus, ContractStatus,
  UserAccount, PasswordResetRequest
} from '../types';
import { 
  INITIAL_USER, INITIAL_CLIENTS, INITIAL_LEADS, INITIAL_PROJECTS, INITIAL_TASKS, 
  INITIAL_TIME_LOGS, INITIAL_INVOICES, INITIAL_EXPENSES, INITIAL_CONTRACTS, 
  INITIAL_FILES, INITIAL_COMMUNICATIONS, INITIAL_CALENDAR_EVENTS, INITIAL_NOTES, INITIAL_CLIENT_TIMELINE 
} from '../mock/initialData';
import confetti from 'canvas-confetti';

interface ActiveTimer {
  isRunning: boolean;
  startTime: number | null;
  elapsedSeconds: number;
  description: string;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation & Active View
  activeModule: string;
  setActiveModule: (module: string) => void;

  // Authentication & Role Management
  currentUser: UserAccount | null;
  userAccounts: UserAccount[];
  resetRequests: PasswordResetRequest[];
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  createFreelancerAccount: (accountData: Omit<UserAccount, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  submitPasswordResetRequest: (email: string, userName: string, reqPass: string, note: string) => Promise<boolean>;
  approvePasswordResetRequest: (requestId: string, userEmail: string, reqPass: string, action: 'approve' | 'reject') => Promise<boolean>;

  // Command Palette & Drawers
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAIDrawerOpen: boolean;
  setIsAIDrawerOpen: (open: boolean) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast System
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Profile & Theme
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setTheme: (theme: AppTheme) => void;
  setAccent: (accent: AccentTheme) => void;
  testMongoConnection: (uri: string) => Promise<{ success: boolean; message: string }>;

  // Clients
  clients: Client[];
  addClient: (clientData: Omit<Client, 'id' | 'createdAt'>) => { success: boolean; message?: string; client?: Client };
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  clientTimeline: ClientTimelineItem[];
  addClientTimelineEntry: (clientId: string, type: ClientTimelineItem['type'], title: string, description: string) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  convertLeadToClient: (leadId: string) => void;
  deleteLead: (id: string) => void;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskChecklist: (taskId: string, itemId: string) => void;
  deleteTask: (id: string) => void;

  // Time Tracker
  timeLogs: TimeLog[];
  activeTimer: ActiveTimer;
  startTimer: (description: string, projectId?: string, clientId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  addManualTimeLog: (log: Omit<TimeLog, 'id'>) => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Invoice;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Contracts
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => void;
  signContract: (id: string, signatureDataUrl: string) => void;

  // Files
  files: FileItem[];
  addFile: (file: Omit<FileItem, 'id' | 'uploadDate'>) => void;

  // Communications & Calendar & Notes
  communications: CommunicationLog[];
  addCommunication: (comm: Omit<CommunicationLog, 'id'>) => void;
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  notes: RichNote[];
  addNote: (note: Omit<RichNote, 'id' | 'updatedAt'>) => void;
  togglePinNote: (id: string) => void;

  // Trigger celebration
  celebrate: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auto-purge legacy mock data from browser localStorage on initialization
  if (typeof window !== 'undefined') {
    const keys = ['user', 'clients', 'client_timeline', 'leads', 'projects', 'tasks', 'timelogs', 'invoices', 'expenses', 'contracts', 'files', 'communications', 'calendar', 'notes'];
    keys.forEach(k => {
      const item = localStorage.getItem(`freelanceflow_${k}`);
      if (item && (item.includes('Nexus') || item.includes('Sarah Jenkins') || item.includes('c-101') || item.includes('Alex Morgan') || item.includes('Aura Fintech'))) {
        localStorage.removeItem(`freelanceflow_${k}`);
      }
    });
  }

  // Local Storage Loaders (Filters out old mock IDs if present)
  const loadLocal = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`freelanceflow_${key}`);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Filter out legacy mock data IDs
        const mockIds = ['c-101', 'c-102', 'c-103', 'c-104', 'c-105', 'p-1', 'p-2', 'p-3', 'ld-1', 'ld-2', 'ld-3', 'ld-4', 'ld-5', 't-1', 't-2', 't-3', 't-4', 'inv-1', 'inv-2', 'inv-3', 'exp-1', 'exp-2', 'exp-3', 'exp-4', 'cnt-1', 'cnt-2', 'f-1', 'f-2', 'f-3', 'com-1', 'com-2', 'com-3', 'evt-1', 'evt-2', 'evt-3', 'n-1', 'n-2', 'ctl-1', 'ctl-2', 'ctl-3'];
        const clean = parsed.filter((item: any) => !mockIds.includes(item?.id));
        return clean as unknown as T;
      }
      return parsed;
    } catch {
      return fallback;
    }
  };

  const saveLocal = (key: string, data: any) => {
    try {
      localStorage.setItem(`freelanceflow_${key}`, JSON.stringify(data));
    } catch (err) {
      console.error('LocalStorage Save Error:', err);
    }
  };

  // State Declarations
  const [user, setUser] = useState<UserProfile>(() => loadLocal('user', INITIAL_USER));
  const [clients, setClients] = useState<Client[]>(() => loadLocal('clients', INITIAL_CLIENTS));
  const [clientTimeline, setClientTimeline] = useState<ClientTimelineItem[]>(() => loadLocal('client_timeline', INITIAL_CLIENT_TIMELINE));
  const [leads, setLeads] = useState<Lead[]>(() => loadLocal('leads', INITIAL_LEADS));
  const [projects, setProjects] = useState<Project[]>(() => loadLocal('projects', INITIAL_PROJECTS));
  const [tasks, setTasks] = useState<Task[]>(() => loadLocal('tasks', INITIAL_TASKS));
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(() => loadLocal('timelogs', INITIAL_TIME_LOGS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadLocal('invoices', INITIAL_INVOICES));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadLocal('expenses', INITIAL_EXPENSES));
  const [contracts, setContracts] = useState<Contract[]>(() => loadLocal('contracts', INITIAL_CONTRACTS));
  const [files, setFiles] = useState<FileItem[]>(() => loadLocal('files', INITIAL_FILES));
  const [communications, setCommunications] = useState<CommunicationLog[]>(() => loadLocal('communications', INITIAL_COMMUNICATIONS));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => loadLocal('calendar', INITIAL_CALENDAR_EVENTS));
  const [notes, setNotes] = useState<RichNote[]>(() => loadLocal('notes', INITIAL_NOTES));

  // Auth & User Accounts State
  const DEFAULT_USER_ACCOUNTS: UserAccount[] = [
    {
      id: 'admin-1',
      name: 'System Admin',
      email: 'admin@freelanceflow.dev',
      role: 'Admin',
      hourlyRate: 150,
      businessName: 'FreelanceFlow HQ',
      status: 'Active',
      emailSentStatus: 'System Owner Account',
      createdAt: new Date().toISOString()
    },
    {
      id: 'free-1',
      name: 'Alex Morgan',
      email: 'freelancer@freelanceflow.dev',
      role: 'Freelancer',
      hourlyRate: 95,
      businessName: 'Morgan Studio & Dev',
      status: 'Active',
      emailSentStatus: 'Credentials emailed to freelancer@freelanceflow.dev',
      createdAt: new Date().toISOString()
    }
  ];

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => loadLocal('current_user', DEFAULT_USER_ACCOUNTS[1]));
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => loadLocal('user_accounts', DEFAULT_USER_ACCOUNTS));
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>(() => loadLocal('reset_requests', []));

  useEffect(() => saveLocal('current_user', currentUser), [currentUser]);
  useEffect(() => saveLocal('user_accounts', userAccounts), [userAccounts]);
  useEffect(() => saveLocal('reset_requests', resetRequests), [resetRequests]);

  // Auth Functions
  const login = async (emailStr: string, passStr: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailStr, password: passStr })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setUser(prev => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          hourlyRate: data.user.hourlyRate || prev.hourlyRate
        }));
        showToast(`Welcome back, ${data.user.name}! Logged in as ${data.user.role}.`, 'success');
        return true;
      }
    } catch {
      const matched = userAccounts.find(u => u.email.toLowerCase() === emailStr.toLowerCase());
      if (matched) {
        setCurrentUser(matched);
        showToast(`Logged in as ${matched.name} (${matched.role})`, 'success');
        return true;
      }
    }
    showToast('Invalid login credentials', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  const createFreelancerAccount = async (accountData: Omit<UserAccount, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/create-freelancer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });
      const data = await res.json();
      if (data.success) {
        const newAcc: UserAccount = data.user || {
          ...accountData,
          id: `u-${Date.now()}`,
          status: 'Active',
          emailSentStatus: `✅ Email with login credentials dispatched to ${accountData.email}`,
          createdAt: new Date().toISOString()
        };
        setUserAccounts(prev => [newAcc, ...prev]);
        showToast(`Freelancer account created! ${data.message || 'Credentials emailed.'}`, 'success');
        return true;
      }
    } catch {
      const newAcc: UserAccount = {
        ...accountData,
        id: `u-${Date.now()}`,
        status: 'Active',
        emailSentStatus: `✅ Email with login credentials dispatched to ${accountData.email}`,
        createdAt: new Date().toISOString()
      };
      setUserAccounts(prev => [newAcc, ...prev]);
      showToast(`Created account for ${accountData.name}. Credentials emailed to ${accountData.email}`, 'success');
      return true;
    }
    return false;
  };

  const submitPasswordResetRequest = async (emailStr: string, userName: string, reqPass: string, note: string): Promise<boolean> => {
    try {
      await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: emailStr, userName, requestedPassword: reqPass, note })
      });
    } catch {
      // Local fallback
    }

    const newReq: PasswordResetRequest = {
      id: `req-${Date.now()}`,
      userEmail: emailStr,
      userName: userName || emailStr,
      requestedPassword: reqPass,
      note,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setResetRequests(prev => [newReq, ...prev]);
    showToast('Password reset request sent to Admin for approval!', 'success');
    return true;
  };

  const approvePasswordResetRequest = async (requestId: string, userEmail: string, reqPass: string, action: 'approve' | 'reject'): Promise<boolean> => {
    try {
      await fetch('/api/auth/approve-reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, userEmail, requestedPassword: reqPass, action })
      });
    } catch {
      // Local fallback
    }

    setResetRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r));
    if (action === 'approve') {
      setUserAccounts(prev => prev.map(u => u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, password: reqPass } : u));
      showToast(`Approved! Password updated for ${userEmail}.`, 'success');
    } else {
      showToast(`Rejected reset request for ${userEmail}.`, 'info');
    }
    return true;
  };

  // Active Timer State
  const [activeTimer, setActiveTimer] = useState<ActiveTimer>(() => loadLocal('active_timer', {
    isRunning: false,
    startTime: null,
    elapsedSeconds: 0,
    description: ''
  }));

  // Sync to LocalStorage on updates
  useEffect(() => saveLocal('user', user), [user]);
  useEffect(() => saveLocal('clients', clients), [clients]);
  useEffect(() => saveLocal('client_timeline', clientTimeline), [clientTimeline]);
  useEffect(() => saveLocal('leads', leads), [leads]);
  useEffect(() => saveLocal('projects', projects), [projects]);
  useEffect(() => saveLocal('tasks', tasks), [tasks]);
  useEffect(() => saveLocal('timelogs', timeLogs), [timeLogs]);
  useEffect(() => saveLocal('invoices', invoices), [invoices]);
  useEffect(() => saveLocal('expenses', expenses), [expenses]);
  useEffect(() => saveLocal('contracts', contracts), [contracts]);
  useEffect(() => saveLocal('files', files), [files]);
  useEffect(() => saveLocal('communications', communications), [communications]);
  useEffect(() => saveLocal('calendar', calendarEvents), [calendarEvents]);
  useEffect(() => saveLocal('notes', notes), [notes]);
  useEffect(() => saveLocal('active_timer', activeTimer), [activeTimer]);

  // Apply Theme & Accent to DOM HTML tag
  useEffect(() => {
    const root = document.documentElement;
    if (user.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme-accent', user.accent || 'blue');
  }, [user.theme, user.accent]);

  // Active Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer(prev => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer.isRunning]);

  // Toast System Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const celebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Theme & Profile Handlers
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    showToast('Settings saved successfully', 'success');
  };

  const setTheme = (theme: AppTheme) => {
    setUser(prev => ({ ...prev, theme }));
  };

  const setAccent = (accent: AccentTheme) => {
    setUser(prev => ({ ...prev, accent }));
    showToast(`Accent theme changed to ${accent.toUpperCase()}`, 'info');
  };

  // Test MongoDB Connection Handler
  const testMongoConnection = async (uri: string) => {
    try {
      let res;
      try {
        res = await fetch('/api/connect-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mongoUri: uri })
        });
      } catch {
        // Fallback to direct backend URL if proxy isn't active
        res = await fetch('http://localhost:5000/api/connect-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mongoUri: uri })
        });
      }

      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, mongoUri: uri, isMongoConnected: true }));
        showToast('Successfully connected to MongoDB Atlas!', 'success');
        return { success: true, message: data.message };
      } else {
        setUser(prev => ({ ...prev, isMongoConnected: false }));
        showToast(`MongoDB Atlas Note: ${data.message}`, 'error');
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      showToast('Could not reach backend API server on port 5000. Ensure npm run server is active.', 'error');
      return { success: false, message: err.message || 'Server error' };
    }
  };

  // CLIENT HANDLERS (Mandatory: name, phone, status validation!)
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    // Mandatory Validation
    if (!clientData.name || !clientData.name.trim()) {
      return { success: false, message: 'Client Name is mandatory.' };
    }
    if (!clientData.phone || !clientData.phone.trim()) {
      return { success: false, message: 'Phone Number is mandatory.' };
    }
    if (!clientData.status) {
      return { success: false, message: 'Status is mandatory.' };
    }

    const newClient: Client = {
      ...clientData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalBilled: 0,
      totalPaid: 0
    };

    setClients(prev => [newClient, ...prev]);

    // Add Timeline log
    addClientTimelineEntry(
      newClient.id,
      'Client Created',
      `Client record created for ${newClient.name}`,
      `Initial status set to ${newClient.status}. Phone: ${newClient.phone}`
    );

    // Also attempt MongoDB API POST in background
    fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    }).catch(() => {});

    showToast(`Client ${newClient.name} added successfully!`, 'success');
    return { success: true, client: newClient };
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    showToast('Client details updated', 'info');
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    showToast('Client deleted', 'info');
  };

  const addClientTimelineEntry = (clientId: string, type: ClientTimelineItem['type'], title: string, description: string) => {
    const entry: ClientTimelineItem = {
      id: `ctl-${Date.now()}`,
      clientId,
      type,
      title,
      description,
      timestamp: new Date().toLocaleString(),
      authorName: user.name
    };
    setClientTimeline(prev => [entry, ...prev]);
  };

  // LEADS HANDLERS
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `ld-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
    showToast(`Lead ${newLead.name} added to pipeline`, 'success');
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
    if (stage === 'Won') {
      celebrate();
      showToast('🎉 Deal Won! Converted to active opportunity', 'success');
    }
  };

  const convertLeadToClient = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    addClient({
      name: lead.name,
      phone: lead.phone,
      status: 'Active',
      company: lead.company,
      email: lead.email,
      notes: `Converted from pipeline lead. Estimated value: ${lead.currency} ${lead.estimatedValue}`
    });

    updateLeadStage(leadId, 'Won');
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  // PROJECTS HANDLERS
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProject, ...prev]);
    showToast(`Project "${newProject.name}" created`, 'success');
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Project updated', 'info');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('Project deleted', 'info');
  };

  // TASKS HANDLERS
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Task added', 'success');
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (status === 'Completed' && t.status !== 'Completed') {
          celebrate();
        }
        return { ...t, status };
      }
      return t;
    }));
  };

  const toggleTaskChecklist = (taskId: string, itemId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = t.checklist.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item);
        return { ...t, checklist: updated };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // TIME TRACKER HANDLERS
  const startTimer = (description: string, projectId?: string, clientId?: string) => {
    let projName = '';
    let clName = '';
    if (projectId) {
      const p = projects.find(proj => proj.id === projectId);
      if (p) projName = p.name;
    }
    if (clientId) {
      const c = clients.find(cl => cl.id === clientId);
      if (c) clName = c.name;
    }

    setActiveTimer({
      isRunning: true,
      startTime: Date.now(),
      elapsedSeconds: 0,
      description: description || 'Active task',
      projectId,
      projectName: projName,
      clientId,
      clientName: clName
    });
    showToast('⏱️ Timer started', 'info');
  };

  const pauseTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: true }));
  };

  const stopTimer = () => {
    if (activeTimer.elapsedSeconds > 0) {
      const hours = activeTimer.elapsedSeconds / 3600;
      const earnings = Math.round(hours * user.hourlyRate * 100) / 100;
      const today = new Date().toISOString().split('T')[0];

      const newLog: TimeLog = {
        id: `tl-${Date.now()}`,
        projectId: activeTimer.projectId,
        projectName: activeTimer.projectName,
        clientId: activeTimer.clientId,
        clientName: activeTimer.clientName,
        description: activeTimer.description || 'Logged session',
        startTime: activeTimer.startTime ? new Date(activeTimer.startTime).toISOString() : new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: activeTimer.elapsedSeconds,
        isBillable: true,
        hourlyRate: user.hourlyRate,
        totalEarnings: earnings,
        date: today
      };

      setTimeLogs(prev => [newLog, ...prev]);
      showToast(`Logged ${Math.ceil(activeTimer.elapsedSeconds / 60)} mins (${user.defaultCurrency} ${earnings})`, 'success');
    }

    setActiveTimer({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      description: ''
    });
  };

  const addManualTimeLog = (logData: Omit<TimeLog, 'id'>) => {
    const newLog: TimeLog = {
      ...logData,
      id: `tl-${Date.now()}`
    };
    setTimeLogs(prev => [newLog, ...prev]);
    showToast('Time log saved', 'success');
  };

  // INVOICE HANDLERS
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const num = invoices.length + 1;
    const invNum = `INV-2026-${num.toString().padStart(3, '0')}`;
    const newInv: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInvoices(prev => [newInv, ...prev]);

    // Update Client Billed Amount
    setClients(prev => prev.map(c => {
      if (c.id === newInv.clientId) {
        return { ...c, totalBilled: (c.totalBilled || 0) + newInv.totalAmount };
      }
      return c;
    }));

    addClientTimelineEntry(
      newInv.clientId,
      'Invoice Sent',
      `Invoice ${newInv.invoiceNumber} created (${newInv.currency} ${newInv.totalAmount.toLocaleString()})`,
      `Due date: ${newInv.dueDate}`
    );

    showToast(`Invoice ${newInv.invoiceNumber} generated!`, 'success');
    return newInv;
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    setInvoices(prev => prev.map(i => {
      if (i.id === id) {
        const isPaidNow = status === 'Paid' && i.status !== 'Paid';
        return {
          ...i,
          status,
          amountPaid: isPaidNow ? i.totalAmount : i.amountPaid
        };
      }
      return i;
    }));

    if (status === 'Paid') {
      celebrate();
      showToast(`🎉 Payment of ${inv.currency} ${inv.totalAmount} confirmed!`, 'success');
      setClients(prev => prev.map(c => {
        if (c.id === inv.clientId) {
          return { ...c, totalPaid: (c.totalPaid || 0) + inv.totalAmount };
        }
        return c;
      }));

      addClientTimelineEntry(
        inv.clientId,
        'Payment Received',
        `Received ${inv.currency} ${inv.totalAmount.toLocaleString()} for Invoice ${inv.invoiceNumber}`,
        `Payment method: ${inv.paymentMethod || 'Stripe'}`
      );
    }
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  // EXPENSE HANDLERS
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast('Expense recorded', 'success');
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // CONTRACT HANDLERS
  const addContract = (contractData: Omit<Contract, 'id' | 'createdAt'>) => {
    const newContract: Contract = {
      ...contractData,
      id: `cnt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setContracts(prev => [newContract, ...prev]);

    addClientTimelineEntry(
      newContract.clientId,
      'Proposal Sent',
      `${newContract.type}: ${newContract.title}`,
      `Value: ${newContract.currency} ${newContract.value.toLocaleString()}`
    );

    showToast(`${newContract.type} document created`, 'success');
  };

  const signContract = (id: string, signatureDataUrl: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Signed',
          signatureDataUrl,
          signedAt: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));

    celebrate();
    showToast('🎉 Digital Signature attached! Contract marked as SIGNED.', 'success');
  };

  // FILE HANDLERS
  const addFile = (fileData: Omit<FileItem, 'id' | 'uploadDate'>) => {
    const newFile: FileItem = {
      ...fileData,
      id: `f-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setFiles(prev => [newFile, ...prev]);
    showToast(`File "${newFile.name}" uploaded to vault`, 'success');
  };

  // COMMUNICATIONS & CALENDAR & NOTES HANDLERS
  const addCommunication = (comm: Omit<CommunicationLog, 'id'>) => {
    const newComm: CommunicationLog = { ...comm, id: `com-${Date.now()}` };
    setCommunications(prev => [newComm, ...prev]);
    showToast('Communication logged', 'info');
  };

  const addCalendarEvent = (evt: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = { ...evt, id: `evt-${Date.now()}` };
    setCalendarEvents(prev => [newEvt, ...prev]);
    showToast('Meeting / Event added to calendar', 'success');
  };

  const addNote = (note: Omit<RichNote, 'id' | 'updatedAt'>) => {
    const newNote: RichNote = {
      ...note,
      id: `n-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setNotes(prev => [newNote, ...prev]);
    showToast('Note created', 'success');
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  return (
    <AppContext.Provider
      value={{
        activeModule,
        setActiveModule,
        currentUser,
        userAccounts,
        resetRequests,
        login,
        logout,
        createFreelancerAccount,
        submitPasswordResetRequest,
        approvePasswordResetRequest,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAIDrawerOpen,
        setIsAIDrawerOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        user,
        updateUserProfile,
        setTheme,
        setAccent,
        testMongoConnection,
        clients,
        addClient,
        updateClient,
        deleteClient,
        clientTimeline,
        addClientTimelineEntry,
        leads,
        addLead,
        updateLeadStage,
        convertLeadToClient,
        deleteLead,
        projects,
        addProject,
        updateProject,
        deleteProject,
        tasks,
        addTask,
        updateTaskStatus,
        toggleTaskChecklist,
        deleteTask,
        timeLogs,
        activeTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        addManualTimeLog,
        invoices,
        addInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        expenses,
        addExpense,
        deleteExpense,
        contracts,
        addContract,
        signContract,
        files,
        addFile,
        communications,
        addCommunication,
        calendarEvents,
        addCalendarEvent,
        notes,
        addNote,
        togglePinNote,
        celebrate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
