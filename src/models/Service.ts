import mongoose, { Schema } from 'mongoose';

export interface IService {
  icon: string;        // Material Icons Outlined name, e.g. "medication"
  title: string;
  description: string;
  order: number;       // display order on the home page
}

const serviceSchema = new Schema<IService>({
  icon: { type: String, default: 'volunteer_activism' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

export default mongoose.model<IService>('Service', serviceSchema);
