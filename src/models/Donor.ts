import mongoose, { Schema } from 'mongoose';

export interface IDonor {
  name: string;
  logoUrl?: string;
  tier: 'platinum' | 'gold' | 'silver';
  website?: string;
}

const donorSchema = new Schema<IDonor>({
  name: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  tier: { type: String, enum: ['platinum', 'gold', 'silver'], default: 'silver' },
  website: { type: String, default: '' }
});

export default mongoose.model<IDonor>('Donor', donorSchema);
