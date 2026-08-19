import { Request, Response } from 'express';
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getMessaging, Notification, AndroidConfig } from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';

function getFirebaseApp(): App {
  if (getApps().length > 0) return getApp();

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    || path.join(process.cwd(), 'src/config/service-key.json');

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error('Firebase service account key not found. Place it at server/firebase-service-account.json');
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  return initializeApp({ credential: cert(serviceAccount) });
}

export const sendNotification = async (req: Request, res: Response) => {
  const { title, body, imageUrl, link, topic, tokens } = req.body;

  if (!title || !body) {
    return res.status(400).json({
      success: false, data: null,
      error: { code: 'VALIDATION', message: 'title and body are required', field: null }
    });
  }

  try {
    const app = getFirebaseApp();
    const messaging = getMessaging(app);

    const notification: Notification = { title, body };
    if (imageUrl) notification.imageUrl = imageUrl;

    const data: Record<string, string> = {};
    if (link) data.link = link;

    let result: any;

    const androidConfig: AndroidConfig = {
      priority: 'high',
      notification: {
        imageUrl: imageUrl || undefined,
        sound: 'default',
        channelId: 'abhina_trust_v2',
        visibility: 'public',
        defaultVibrateTimings: true,
        defaultLightSettings: true,
      },
    };

    if (tokens && Array.isArray(tokens) && tokens.length > 0) {
      result = await messaging.sendEachForMulticast({
        notification,
        data,
        tokens,
        android: androidConfig,
      });
    } else {
      result = await messaging.send({
        notification,
        data,
        topic: topic || 'all',
        android: androidConfig,
      });
    }

    return res.json({ success: true, data: result, meta: null, error: null });
  } catch (err: any) {
    return res.status(500).json({
      success: false, data: null,
      error: { code: 'FCM_ERROR', message: err.message, field: null }
    });
  }
};
