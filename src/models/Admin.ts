import mongoose, { Schema } from 'mongoose';

export interface IAdmin {
  username: string;
  password: string;
  role: string;
  createdAt: Date;
}

const adminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'administrator' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAdmin>('Admin', adminSchema);
