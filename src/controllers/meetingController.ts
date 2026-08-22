import { Request, Response, NextFunction } from 'express';
import Meeting from '../models/Meeting';

const HEARTBEAT_TTL_MS = 45 * 1000;
const APP_DEEP_LINK_BASE =
  process.env.APP_DEEP_LINK_BASE || 'abhina://meeting/';
const APP_WEB_SHARE_BASE =
  process.env.APP_WEB_SHARE_BASE || 'https://abhina.net/live/';

const normalizeRoomId = (value: unknown) =>
  value
    ?.toString()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .toLowerCase() || '';

const now = () => new Date();

const cleanMeeting = <T extends { participants?: any[]; active?: boolean }>(
  meeting: T,
) => {
  const cutoff = Date.now() - HEARTBEAT_TTL_MS;
  meeting.participants = (meeting.participants || []).filter((participant) => {
    const ts = new Date(participant.lastSeenAt || participant.joinedAt || 0).getTime();
    return ts >= cutoff;
  });
  meeting.active = (meeting.participants?.length || 0) > 0;
  return meeting;
};

const serializeMeeting = (meeting: any) => {
  const cleaned = cleanMeeting(meeting.toObject ? meeting.toObject() : meeting);
  return {
    ...cleaned,
    participantCount: cleaned.participants.length,
  };
};

export const listMeetings = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const meetings = await Meeting.find().sort({ updatedAt: -1 });
    const normalized: any[] = [];

    for (const meeting of meetings) {
      cleanMeeting(meeting);
      await meeting.save();
      normalized.push(serializeMeeting(meeting));
    }

    res.json({
      success: true,
      data: normalized,
      meta: { total: normalized.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getMeetingByRoomId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roomId = normalizeRoomId(req.params.roomId);
    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'MEETING_NOT_FOUND', message: 'Meeting not found', field: 'roomId' },
      });
    }

    cleanMeeting(meeting);
    await meeting.save();

    res.json({ success: true, data: serializeMeeting(meeting), meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const createMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roomId = normalizeRoomId(req.body.roomId);
    const title = req.body.title?.toString().trim() || roomId;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_ROOM', message: 'Room ID is required', field: 'roomId' },
      });
    }

    const shareUrl = `${APP_DEEP_LINK_BASE}${roomId}`;
    const webShareUrl = `${APP_WEB_SHARE_BASE}${roomId}`;

    const meeting = await Meeting.findOneAndUpdate(
      { roomId },
      {
        $set: {
          roomId,
          title,
          createdByUserId: req.body.createdByUserId?.toString() || '',
          createdByName: req.body.createdByName?.toString() || '',
          createdByEmail: req.body.createdByEmail?.toString() || '',
          active: true,
          shareUrl,
          webShareUrl,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      data: serializeMeeting(meeting),
      meta: null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const syncMeetingParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roomId = normalizeRoomId(req.params.roomId);
    const participants = Array.isArray(req.body.participants) ? req.body.participants : [];

    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'MEETING_NOT_FOUND', message: 'Meeting not found', field: 'roomId' },
      });
    }

    cleanMeeting(meeting);

    const participantMap = new Map(
      (meeting.participants || []).map((participant) => [participant.participantId, participant])
    );

    for (const raw of participants) {
      const participantId = raw['participantId']?.toString();
      if (!participantId) continue;

      const previous = participantMap.get(participantId);
      participantMap.set(participantId, {
        participantId,
        userId: raw['userId']?.toString() || previous?.userId || '',
        displayName: raw['displayName']?.toString() || previous?.displayName || 'Participant',
        email: raw['email']?.toString() || previous?.email || '',
        avatarUrl: raw['avatarUrl']?.toString() || previous?.avatarUrl || '',
        isHost: raw['isHost'] === true || previous?.isHost === true,
        joinedAt: previous?.joinedAt || now(),
        lastSeenAt: now(),
      });
    }

    meeting.participants = Array.from(participantMap.values()) as any;
    cleanMeeting(meeting);
    await meeting.save();

    res.json({ success: true, data: serializeMeeting(meeting), meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const heartbeatMeetingParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roomId = normalizeRoomId(req.params.roomId);
    const participantId = req.body.participantId?.toString();
    const meeting = await Meeting.findOne({ roomId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'MEETING_NOT_FOUND', message: 'Meeting not found', field: 'roomId' },
      });
    }

    if (!participantId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_PARTICIPANT', message: 'Participant ID is required', field: 'participantId' },
      });
    }

    cleanMeeting(meeting);

    const participant = meeting.participants.find((item) => item.participantId === participantId);
    if (participant) {
      participant.lastSeenAt = now();
    }
    meeting.active = meeting.participants.length > 0;
    await meeting.save();

    res.json({ success: true, data: serializeMeeting(meeting), meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const leaveMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roomId = normalizeRoomId(req.params.roomId);
    const participantId = req.body.participantId?.toString();
    const meeting = await Meeting.findOne({ roomId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'MEETING_NOT_FOUND', message: 'Meeting not found', field: 'roomId' },
      });
    }

    meeting.participants = meeting.participants.filter(
      (participant) => participant.participantId !== participantId
    ) as any;
    cleanMeeting(meeting);
    await meeting.save();

    res.json({ success: true, data: serializeMeeting(meeting), meta: null, error: null });
  } catch (err) {
    next(err);
  }
};
