import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'MISSING_FIELDS', message: 'Username and password are required', field: 'username' }
    });
  }
  try {
    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(400).json({
        success: false, data: null,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password', field: 'password' }
      });
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(400).json({
        success: false, data: null,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password', field: 'password' }
      });
    }
    return res.json({
      success: true,
      data: { token: 'abhina-admin-token-secret-2026', user: { username: admin.username, role: admin.role } },
      meta: null,
      error: null
    });
  } catch (err) {
    return res.status(500).json({
      success: false, data: null,
      error: { code: 'SERVER_ERROR', message: 'Internal server error' }
    });
  }
};
