// FreelanceFlow TypeScript Interface Definitions

export type AccentTheme = 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'cyan';
export type AppTheme = 'dark' | 'light';
export type UserRole = 'Admin' | 'Freelancer' | 'Team Member';

// Client Status
export type ClientStatus = 'Active' | 'Inactive' | 'Blacklisted' | 'Lead' | 'Prospect';

// Lead Sales Stage
export type LeadStage = 'New Lead' | 'Contacted' | 'Discussion' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

// Project Status & Priority
export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Testing' | 'Completed' | 'Cancelled' | 'On Hold';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ProjectHealth = 'On Track' | 'At Risk' | 'Delayed';

// Task Status & View
export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed';
export type TaskViewMode = 'list' | 'board' | 'calendar' | 'gantt';

// Invoice Status & Payment Method
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentMethod = 'Stripe' | 'PayPal' | 'Razorpay' | 'Bank Transfer' | 'UPI' | 'Cash';

// Contract Status
export type ContractStatus = 'Draft' | 'Sent' | 'Signed' | 'Expired';

// Expense Category
export type ExpenseCategory = 'Software' | 'Hosting' | 'Internet' | 'Travel' | 'Equipment' | 'Marketing' | 'Salary' | 'Others';

// User & Authentication Interfaces
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatarUrl?: string;
  hourlyRate?: number;
  businessName?: string;
  status: 'Active' | 'Inactive';
  emailSentStatus?: string; // Log of email credentials dispatch
  createdAt: string;
}

export interface PasswordResetRequest {
  id: string;
  userEmail: string;
  userName: string;
  requestedPassword: string;
  note: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  reviewedAt?: string;
}

// Client Interface (Mandatory: name, phone, status. Optional: rest)
export interface Client {
  id: string;
  name: string;             // Mandatory
  phone: string;            // Mandatory
  status: ClientStatus;     // Mandatory
  company?: string;
  email?: string;
  website?: string;
  address?: string;
  country?: string;
  timezone?: string;
  industry?: string;
  taxNumber?: string;       // GST/VAT
  preferredCurrency?: string; // USD, EUR, INR, GBP, CAD, etc.
  paymentMethod?: PaymentMethod;
  notes?: string;
  avatarUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    portfolio?: string;
  };
  totalBilled?: number;
  totalPaid?: number;
  createdAt: string;
  updatedAt?: string;
}

// Client Timeline History Entry
export interface ClientTimelineItem {
  id: string;
  clientId: string;
  type: 'Client Created' | 'Meeting Scheduled' | 'Proposal Sent' | 'Contract Signed' | 'Invoice Sent' | 'Payment Received' | 'Task Assigned' | 'File Uploaded' | 'Note Added' | 'Call Logged';
  title: string;
  description: string;
  timestamp: string;
  authorName?: string;
}

// Lead Sales Pipeline Deal
export interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone: string;
  stage: LeadStage;
  estimatedValue: number;
  currency: string;
  confidenceProbability: number; // 0 to 100%
  source?: string;
  notes?: string;
  createdAt: string;
}

// Project Interface
export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  amount?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  category: string;
  budget: number;
  spentBudget?: number;
  currency: string;
  startDate: string;
  deadline: string;
  priority: PriorityLevel;
  status: ProjectStatus;
  health: ProjectHealth;
  progressPercentage: number;
  teamMembers?: string[];
  milestones: ProjectMilestone[];
  tags?: string[];
  createdAt: string;
}

// Task Interface
export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  dueDate: string;
  priority: PriorityLevel;
  status: TaskStatus;
  assignedTo?: string;
  estimatedHours: number;
  actualHours: number;
  labels: string[];
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
  isRecurring?: boolean;
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

// Time Log Entry
export interface TimeLog {
  id: string;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  description: string;
  startTime: string; // ISO date
  endTime: string;   // ISO date
  durationSeconds: number;
  isBillable: boolean;
  hourlyRate: number;
  totalEarnings: number;
  date: string; // YYYY-MM-DD
}

// Invoice Line Item
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// Invoice Interface
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  projectId?: string;
  projectName?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  currency: string;
  status: InvoiceStatus;
  notes?: string;
  terms?: string;
  recurringFrequency?: 'None' | 'Monthly' | 'Quarterly' | 'Yearly';
  paymentMethod?: PaymentMethod;
  pdfUrl?: string;
  createdAt: string;
}

// Expense Entry
export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
  vendor?: string;
  notes?: string;
  receiptUrl?: string;
  isRecurring?: boolean;
}

// Contract Document
export interface Contract {
  id: string;
  title: string;
  type: 'Proposal' | 'Contract' | 'Agreement' | 'NDA';
  clientId: string;
  clientName: string;
  projectId?: string;
  status: ContractStatus;
  value: number;
  currency: string;
  content: string;
  validUntil: string;
  signatureDataUrl?: string;
  signedAt?: string;
  createdAt: string;
}

// File Item
export interface FileItem {
  id: string;
  name: string;
  sizeBytes: number;
  formattedSize: string;
  fileType: 'pdf' | 'image' | 'video' | 'zip' | 'document';
  folder: 'Invoices' | 'Contracts' | 'Designs' | 'Specifications' | 'General';
  clientId?: string;
  clientName?: string;
  projectId?: string;
  uploadDate: string;
  downloadUrl: string;
  version: string;
}

// Communication Log
export interface CommunicationLog {
  id: string;
  clientId: string;
  clientName: string;
  channel: 'Email' | 'WhatsApp' | 'Phone Call' | 'Meeting' | 'Message';
  subject: string;
  summary: string;
  timestamp: string;
  direction: 'Inbound' | 'Outbound';
}

// Integrated Calendar Event
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'Meeting' | 'Deadline' | 'Invoice Due' | 'Task' | 'Payment Due';
  description?: string;
  meetingLink?: string;
  clientId?: string;
  projectId?: string;
  status?: 'Scheduled' | 'Completed' | 'Cancelled';
}

// Rich Note
export interface RichNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  clientId?: string;
  projectId?: string;
  updatedAt: string;
}

// System User Profile & Settings
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  businessName: string;
  businessLogoUrl?: string;
  taxNumber?: string;
  address?: string;
  defaultCurrency: string;
  hourlyRate: number;
  theme: AppTheme;
  accent: AccentTheme;
  timezone: string;
  twoFactorEnabled: boolean;
  integrations: {
    stripe: boolean;
    razorpay: boolean;
    paypal: boolean;
    googleCalendar: boolean;
    zoom: boolean;
    slack: boolean;
    github: boolean;
    googleDrive: boolean;
  };
  mongoUri?: string;
  isMongoConnected?: boolean;
}
