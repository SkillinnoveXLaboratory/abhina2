import { Request, Response, NextFunction } from 'express';
import { Volunteer, ContactMessage, Subscription, Member, AccountDeletionRequest } from '../models';

const normalizeEmail = (value: unknown) => value?.toString().trim().toLowerCase() ?? '';
const normalizePhone = (value: unknown) => value?.toString().replace(/\D/g, '') ?? '';

const buildDuplicateMessage = (emailExists: boolean, phoneExists: boolean, label: string) => {
  if (emailExists && phoneExists) {
    return `${label} already exists with this email and phone number.`;
  }
  if (emailExists) {
    return `${label} already exists with this email.`;
  }
  return `${label} already exists with this phone number.`;
};

// ==========================================
// Volunteers
// ==========================================
export const submitVolunteer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);

    const duplicates = await Volunteer.find({
      $or: [{ email }, { phone }]
    }).select('email phone').lean();

    const emailExists = email ? duplicates.some((item) => normalizeEmail(item.email) == email) : false;
    const phoneExists = phone ? duplicates.some((item) => normalizePhone(item.phone) == phone) : false;

    if (emailExists || phoneExists) {
      return res.status(409).json({
        success: false,
        data: null,
        error: {
          code: 'DUPLICATE_VOLUNTEER',
          message: buildDuplicateMessage(emailExists, phoneExists, 'Volunteer submission'),
          field: emailExists && phoneExists ? 'email,phone' : emailExists ? 'email' : 'phone'
        }
      });
    }

    const volunteer = new Volunteer({
      ...req.body,
      email,
      phone,
      status: 'pending'
    });
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

export const updateVolunteerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.body?.status?.toString();
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_STATUS', message: 'Invalid volunteer status', field: 'status' }
      });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: volunteer, meta: null, error: null });
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
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);

    const duplicates = await Member.find({
      $or: [{ email }, { phone }]
    }).select('email phone').lean();

    const emailExists = email ? duplicates.some((item) => normalizeEmail(item.email) == email) : false;
    const phoneExists = phone ? duplicates.some((item) => normalizePhone(item.phone) == phone) : false;

    if (emailExists || phoneExists) {
      return res.status(409).json({
        success: false,
        data: null,
        error: {
          code: 'DUPLICATE_MEMBER',
          message: buildDuplicateMessage(emailExists, phoneExists, 'Member submission'),
          field: emailExists && phoneExists ? 'email,phone' : emailExists ? 'email' : 'phone'
        }
      });
    }

    const member = new Member({
      ...req.body,
      email,
      phone,
      status: 'pending'
    });
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
    const status = req.body?.status?.toString();
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_STATUS', message: 'Invalid member status', field: 'status' }
      });
    }
    const member = await Member.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, data: member, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const getMySubmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = normalizeEmail(req.query.email);
    const phone = normalizePhone(req.query.phone);

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'MISSING_FILTER', message: 'Email or phone is required', field: 'email' }
      });
    }

    const filter: any[] = [];
    if (email) filter.push({ email });
    if (phone) filter.push({ phone });

    const [members, volunteers] = await Promise.all([
      Member.find({ $or: filter }).sort({ createdAt: -1 }).lean(),
      Volunteer.find({ $or: filter }).sort({ createdAt: -1 }).lean()
    ]);

    res.json({
      success: true,
      data: { members, volunteers },
      meta: {
        total: members.length + volunteers.length
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// Account Deletion Requests
// ==========================================
export const submitAccountDeletionRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = new AccountDeletionRequest(req.body);
    await request.save();
    res.status(201).json({ success: true, data: request, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const getAccountDeletionRequests = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await AccountDeletionRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list, meta: { total: list.length }, error: null });
  } catch (err) {
    next(err);
  }
};

export const deleteAccountDeletionRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AccountDeletionRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Account deletion request deleted' }, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};
