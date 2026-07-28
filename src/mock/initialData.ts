import { 
  UserProfile, Client, Lead, Project, Task, TimeLog, Invoice, Expense, Contract, FileItem, CommunicationLog, CalendarEvent, RichNote, ClientTimelineItem 
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'u-1',
  name: 'Freelancer',
  email: 'user@freelanceflow.dev',
  role: 'Freelancer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  businessName: 'My Studio & Dev',
  taxNumber: '',
  address: '',
  defaultCurrency: 'INR',
  hourlyRate: 95,
  theme: 'dark',
  accent: 'blue',
  timezone: 'America/Los_Angeles (PST)',
  twoFactorEnabled: false,
  integrations: {
    stripe: false,
    razorpay: false,
    paypal: false,
    googleCalendar: false,
    zoom: false,
    slack: false,
    github: false,
    googleDrive: false
  },
  mongoUri: '',
  isMongoConnected: false
};

// Clean empty arrays (all mock data removed)
export const INITIAL_CLIENTS: Client[] = [];
export const INITIAL_CLIENT_TIMELINE: ClientTimelineItem[] = [];
export const INITIAL_LEADS: Lead[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_TIME_LOGS: TimeLog[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_CONTRACTS: Contract[] = [];
export const INITIAL_FILES: FileItem[] = [];
export const INITIAL_COMMUNICATIONS: CommunicationLog[] = [];
export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [];
export const INITIAL_NOTES: RichNote[] = [];
