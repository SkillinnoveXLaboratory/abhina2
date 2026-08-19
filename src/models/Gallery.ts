import mongoose, { Schema } from 'mongoose';

export interface IGallery {
  title: string;
  imageUrl: string;
  category?: string;
  date?: string;
  order: number;
}

const gallerySchema = new Schema<IGallery>({
  title: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  category: { type: String, default: 'general' },
  date: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IGallery>('Gallery', gallerySchema);
