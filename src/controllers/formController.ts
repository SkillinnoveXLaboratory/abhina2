import { Request, Response, NextFunction } from 'express';
import { Volunteer, ContactMessage, Subscription, Member } from '../models';

// ==========================================
// Volunteers
// ==========================================
export const submitVolunteer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json({ success: true, data: volunteer, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const getVolunteers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list, meta: { total: list.length }, error: null });
  } catch (err) {
    next(err);
  }
};

export const deleteVolunteer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Volunteer application deleted' }, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Contact Messages
// ==========================================
export const submitContactMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const msg = new ContactMessage(req.body);
    await msg.save();
    res.status(201).json({ success: true, data: msg, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const getContactMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list, meta: { total: list.length }, error: null });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Newsletter Subscriptions
// ==========================================
export const submitSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = new Subscription(req.body);
    await sub.save();
    res.status(201).json({ success: true, data: sub, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await Subscription.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list, meta: { total: list.length }, error: null });
  } catch (err) {
    next(err);
  }
};

export const deleteContactMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Message deleted' }, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Subscription deleted' }, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Members
// ==========================================
export const submitMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({ success: true, data: member, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await Member.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list, meta: { total: list.length }, error: null });
  } catch (err) {
    next(err);
  }
};

export const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Member application deleted' }, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const updateMemberStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: member, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};
