import mongoose, { Schema } from 'mongoose';

export interface ITranslation {
  lang: string;
  key: string;
  value: string;
}

const translationSchema = new Schema<ITranslation>({
  lang: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: String, required: true }
});
translationSchema.index({ lang: 1, key: 1 }, { unique: true });

export default mongoose.model<ITranslation>('Translation', translationSchema);
