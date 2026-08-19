import mongoose, { Schema } from 'mongoose';

export interface INews {
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  category: 'latest_news' | 'videos' | 'press_notes' | 'debates';
  source?: string;
  isLive: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  language?: string;
}

const newsSchema = new Schema<INews>({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  category: { type: String, enum: ['latest_news', 'videos', 'press_notes', 'debates'], default: 'latest_news' },
  source: { type: String, default: '' },
  isLive: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  language: { type: String, default: 'en' },
}, { timestamps: true });

export default mongoose.model<INews>('News', newsSchema);
