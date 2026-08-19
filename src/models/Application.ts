import mongoose, { Schema } from 'mongoose';

export interface IApplication {
  title: string;
  description?: string;
  link: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

const applicationSchema = new Schema<IApplication>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  link: { type: String, required: true },
  icon: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', applicationSchema);
