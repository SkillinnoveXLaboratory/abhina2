import mongoose, { Schema } from 'mongoose';

export interface IAccountDeletionRequest {
  userId: string;
  email: string;
  displayName: string;
  status: string;
  createdAt: Date;
}

const accountDeletionRequestSchema = new Schema<IAccountDeletionRequest>({
  userId: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true },
  displayName: { type: String, default: '', trim: true },
  status: { type: String, default: 'pending', trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAccountDeletionRequest>(
  'AccountDeletionRequest',
  accountDeletionRequestSchema,
);
