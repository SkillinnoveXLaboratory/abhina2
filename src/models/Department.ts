import mongoose, { Schema } from 'mongoose';

export interface IDepartment {
  _id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  summary: string;
  content: string;
  imageUrl?: string;
}

const departmentSchema = new Schema<IDepartment>({
  _id: { type: String, required: true },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  icon: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' }
}, { _id: false });

export default mongoose.model<IDepartment>('Department', departmentSchema);
