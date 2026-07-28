import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Blacklisted' | 'Lead' | 'Prospect';
  company?: string;
  email?: string;
  website?: string;
  address?: string;
  country?: string;
  timezone?: string;
  industry?: string;
  taxNumber?: string;
  preferredCurrency?: string;
  paymentMethod?: string;
  notes?: string;
  totalBilled?: number;
  totalPaid?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>({
  name: { type: String, required: [true, 'Client Name is required'] },
  phone: { type: String, required: [true, 'Phone number is required'] },
  status: { 
    type: String, 
    required: [true, 'Client Status is required'], 
    enum: ['Active', 'Inactive', 'Blacklisted', 'Lead', 'Prospect'],
    default: 'Active'
  },
  company: { type: String, required: false },
  email: { type: String, required: false },
  website: { type: String, required: false },
  address: { type: String, required: false },
  country: { type: String, required: false },
  timezone: { type: String, required: false },
  industry: { type: String, required: false },
  taxNumber: { type: String, required: false },
  preferredCurrency: { type: String, required: false, default: 'USD' },
  paymentMethod: { type: String, required: false },
  notes: { type: String, required: false },
  totalBilled: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
