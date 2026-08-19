import mongoose, { Schema } from 'mongoose';

export interface IProject {
  title: string;
  category: string;
  description: string;
  goal: number;
  raised: number;
  imageUrl?: string;
  gallery?: string[];
  featured: boolean;
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  raised: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  gallery: { type: [String], default: [] },
  featured: { type: Boolean, default: false }
});

export default mongoose.model<IProject>('Project', projectSchema);
