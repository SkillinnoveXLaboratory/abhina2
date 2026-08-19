import mongoose, { Schema } from 'mongoose';

export interface IMember {
  name: string;
  email: string;
  phone: string;
  address?: string;
  region?: string;
  membershipType: string;
  status: string;
  submittedAt?: Date;
}

const memberSchema = new Schema<IMember>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  region: { type: String, default: '' },
  membershipType: { type: String, default: 'general' },
  status: { type: String, default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IMember>('Member', memberSchema);
