import mongoose, { Schema } from 'mongoose';

export interface IContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);
