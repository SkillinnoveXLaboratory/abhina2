import mongoose, { Schema } from 'mongoose';

export interface ITheme {
  lang: string;
  primaryColor: string;
  primaryDarkColor: string;
  primaryGradientStart: string;
  primaryGradientMiddle: string;
  primaryGradientEnd: string;
  orangeColor: string;
  orangeSoftColor: string;
  accentColor: string;
  accentGradientStart: string;
  accentGradientEnd: string;
}

const themeSchema = new Schema<ITheme>({
  lang: { type: String, required: true, unique: true },
  primaryColor: { type: String, default: '21 72 158' },
  primaryDarkColor: { type: String, default: '14 53 118' },
  primaryGradientStart: { type: String, default: '#2e6fc2' },
  primaryGradientMiddle: { type: String, default: '#15489e' },
  primaryGradientEnd: { type: String, default: '#0e3576' },
  orangeColor: { type: String, default: '232 115 28' },
  orangeSoftColor: { type: String, default: '251 217 190' },
  accentColor: { type: String, default: '108 19 196' },
  accentGradientStart: { type: String, default: '#6c13c4' },
  accentGradientEnd: { type: String, default: '#4e0e91' }
});

export default mongoose.model<ITheme>('Theme', themeSchema);
