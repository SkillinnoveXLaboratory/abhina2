import { Request, Response, NextFunction } from 'express';
import Config from '../models/Config';
import { clearSocialFeedCache } from './socialFeedController';

export const getConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
      await config.save();
    }
    // Strip the API key — never expose it to the client
    const safeConfig = config.toObject();
    (safeConfig as any).metaTokenConfigured = !!(safeConfig as any).metaPageAccessToken;
    delete (safeConfig as any).youtubeApiKey;
    delete (safeConfig as any).metaPageAccessToken;
    res.json({ success: true, data: safeConfig, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const updateConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if (payload.metaPageAccessToken === '') {
      delete payload.metaPageAccessToken;
    }
    const updated = await Config.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: false }
    );
    clearSocialFeedCache();
    res.json({ success: true, data: updated, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};
