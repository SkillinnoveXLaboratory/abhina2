import mongoose, { Schema } from 'mongoose';

export interface IAnnualReport {
  year: number;
  title: string;
  summary: string;
  fileUrl?: string;
  coverUrl?: string;
}

const annualReportSchema = new Schema<IAnnualReport>({
  year: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  fileUrl: { type: String, default: '' },
  coverUrl: { type: String, default: '' }
});

export default mongoose.model<IAnnualReport>('AnnualReport', annualReportSchema);
