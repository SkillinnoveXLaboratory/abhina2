import mongoose, { Schema } from 'mongoose';

export interface ISubscription {
  email: string;
  createdAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);
