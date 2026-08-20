import mongoose, { Schema } from 'mongoose';

export interface IVolunteer {
  name: string;
  email: string;
  phone: string;
  region: string;
  availability: string;
  status: string;
  skills: string[];
  interest: string[];
  reason?: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
}

const volunteerSchema = new Schema<IVolunteer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  region: { type: String, required: true },
  availability: { type: String, required: true },
  status: { type: String, default: 'pending' },
  skills: [{ type: String }],
  interest: [{ type: String }],
  reason: { type: String, default: '' },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IVolunteer>('Volunteer', volunteerSchema);
