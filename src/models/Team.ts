import mongoose, { Schema } from 'mongoose';

export interface ITeam {
  name: string;
  role: string;
  imageUrl?: string;
  bio?: string;
}

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  bio: { type: String, default: '' }
});

export default mongoose.model<ITeam>('Team', teamSchema);
