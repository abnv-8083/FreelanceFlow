import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  clientId: string;
  clientName: string;
  category?: string;
  budget: number;
  currency: string;
  startDate: string;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Planning' | 'In Progress' | 'Review' | 'Testing' | 'Completed' | 'Cancelled' | 'On Hold';
  health: 'On Track' | 'At Risk' | 'Delayed';
  progressPercentage: number;
  milestones: any[];
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String },
  clientId: { type: String, required: true },
  clientName: { type: String, required: true },
  category: { type: String, default: 'Web Development' },
  budget: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  startDate: { type: String },
  deadline: { type: String, required: true },
  priority: { type: String, default: 'Medium' },
  status: { type: String, default: 'In Progress' },
  health: { type: String, default: 'On Track' },
  progressPercentage: { type: Number, default: 0 },
  milestones: [{ type: Schema.Types.Mixed, default: [] }]
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
