import mongoose, { Schema } from 'mongoose';

export interface IImpactStory {
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  author: string;
  date: string;
}

const impactStorySchema = new Schema<IImpactStory>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  author: { type: String, default: 'ABHINA' },
  date: { type: String, required: true }
});

export default mongoose.model<IImpactStory>('ImpactStory', impactStorySchema);
