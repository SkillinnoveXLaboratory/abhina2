import mongoose, { Schema } from 'mongoose';

export interface ITestimonial {
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
}

const testimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  quote: { type: String, required: true },
  avatarUrl: { type: String, default: '' }
});

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
