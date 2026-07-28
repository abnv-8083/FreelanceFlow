import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetRequest extends Document {
  userEmail: string;
  userName: string;
  requestedPassword: string;
  note: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetRequestSchema = new Schema<IPasswordResetRequest>({
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  requestedPassword: { type: String, required: true },
  note: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.PasswordResetRequest || mongoose.model<IPasswordResetRequest>('PasswordResetRequest', PasswordResetRequestSchema);
