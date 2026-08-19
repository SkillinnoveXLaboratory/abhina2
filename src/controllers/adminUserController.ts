import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await Admin.find({}, { password: 0 }).sort({ createdAt: 1 });
    res.json({ success: true, data: admins, meta: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to fetch admins' } });
  }
};

export const createAdminUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, data: null, error: { code: 'MISSING_FIELDS', message: 'Username and password are required' } });
  }
  try {
    const exists = await Admin.findOne({ username: username.trim() });
    if (exists) {
      return res.status(400).json({ success: false, data: null, error: { code: 'DUPLICATE', message: 'Username already exists' } });
    }
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username: username.trim(), password: hashed, role: role || 'administrator' });
    res.status(201).json({ success: true, data: { _id: admin._id, username: admin.username, role: admin.role, createdAt: admin.createdAt }, meta: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to create admin' } });
  }
};

export const updateAdminUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Admin not found' } });
    }
    if (username) admin.username = username.trim();
    if (role) admin.role = role;
    if (password) admin.password = await bcrypt.hash(password, 10);
    await admin.save();
    res.json({ success: true, data: { _id: admin._id, username: admin.username, role: admin.role, createdAt: admin.createdAt }, meta: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to update admin' } });
  }
};

export const deleteAdminUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const count = await Admin.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ success: false, data: null, error: { code: 'LAST_ADMIN', message: 'Cannot delete the last admin account' } });
    }
    await Admin.findByIdAndDelete(id);
    res.json({ success: true, data: null, meta: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to delete admin' } });
  }
};
