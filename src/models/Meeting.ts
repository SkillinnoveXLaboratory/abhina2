import mongoose, { Schema } from 'mongoose';

export interface IMeetingParticipant {
  participantId: string;
  userId?: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  isHost: boolean;
  joinedAt: Date;
  lastSeenAt: Date;
}

export interface IMeeting {
  roomId: string;
  title: string;
  createdByUserId?: string;
  createdByName: string;
  createdByEmail?: string;
  active: boolean;
  shareUrl: string;
  webShareUrl: string;
  participants: IMeetingParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<IMeetingParticipant>(
  {
    participantId: { type: String, required: true },
    userId: { type: String, default: '' },
    displayName: { type: String, default: '' },
    email: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    isHost: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const meetingSchema = new Schema<IMeeting>(
  {
    roomId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    createdByUserId: { type: String, default: '' },
    createdByName: { type: String, default: '' },
    createdByEmail: { type: String, default: '' },
    active: { type: Boolean, default: true },
    shareUrl: { type: String, required: true },
    webShareUrl: { type: String, required: true },
    participants: { type: [participantSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model<IMeeting>('Meeting', meetingSchema);
