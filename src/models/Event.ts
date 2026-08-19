import mongoose, { Schema } from 'mongoose';

export interface IEvent {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  category: string;
  imageUrl?: string;
  gallery?: string[];
  status: 'upcoming' | 'completed';
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  gallery: { type: [String], default: [] },
  status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' }
});

export default mongoose.model<IEvent>('Event', eventSchema);
