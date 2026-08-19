import { Request, Response, NextFunction } from 'express';
import https from 'https';
import Config from '../models/Config';

type SocialPlatform = 'facebook' | 'instagram';

interface SocialItem {
  id: string;
  platform: SocialPlatform;
  text: string;
  mediaUrl: string;
  thumbnailUrl: string;
  permalinkUrl: string;
  mediaType: string;
  createdTime: string;
}

interface CacheEntry {
  items: SocialItem[];
  ts: number;
}

const CACHE_TTL = 15 * 60 * 1000;
let mergedCache: CacheEntry | null = null;

function httpsGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function trimText(value: string, max = 220): string {
  const clean = value.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function toTime(value: string): number {
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? 0 : ts;
}

async function fetchFacebookFeed(pageId: string, accessToken: string): Promise<SocialItem[]> {
  const url =
    `https://graph.facebook.com/v23.0/${encodeURIComponent(pageId)}/posts` +
    `?fields=id,message,created_time,full_picture,permalink_url` +
    `&limit=6&access_token=${encodeURIComponent(accessToken)}`;

  const payload = await httpsGet(url);
  const items = Array.isArray(payload?.data) ? payload.data : [];
  return items
    .map((item: any) => ({
      id: item.id?.toString() || '',
      platform: 'facebook' as const,
      text: trimText(item.message?.toString() || ''),
      mediaUrl: item.full_picture?.toString() || '',
      thumbnailUrl: item.full_picture?.toString() || '',
      permalinkUrl: item.permalink_url?.toString() || '',
      mediaType: item.full_picture ? 'IMAGE' : 'TEXT',
      createdTime: item.created_time?.toString() || '',
    }))
    .filter((item: SocialItem) => item.id && (item.text || item.mediaUrl || item.permalinkUrl));
}

async function fetchInstagramFeed(igUserId: string, accessToken: string): Promise<SocialItem[]> {
  const url =
    `https://graph.facebook.com/v23.0/${encodeURIComponent(igUserId)}/media` +
    `?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` +
    `&limit=6&access_token=${encodeURIComponent(accessToken)}`;

  const payload = await httpsGet(url);
  const items = Array.isArray(payload?.data) ? payload.data : [];
  return items
    .map((item: any) => ({
      id: item.id?.toString() || '',
      platform: 'instagram' as const,
      text: trimText(item.caption?.toString() || ''),
      mediaUrl: item.media_url?.toString() || '',
      thumbnailUrl: item.thumbnail_url?.toString() || item.media_url?.toString() || '',
      permalinkUrl: item.permalink?.toString() || '',
      mediaType: item.media_type?.toString() || 'IMAGE',
      createdTime: item.timestamp?.toString() || '',
    }))
    .filter((item: SocialItem) => item.id && (item.text || item.mediaUrl || item.permalinkUrl));
}

function buildResponseItems(items: SocialItem[]) {
  return items.sort((a, b) => toTime(b.createdTime) - toTime(a.createdTime));
}

export const getSocialFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await Config.findOne();
    if (!config?.socialFeedEnabled) {
      return res.json({ success: true, data: [], meta: { enabled: false }, error: null });
    }

    const accessToken = config.metaPageAccessToken?.trim() || '';
    const facebookPageId = config.facebookPageId?.trim() || '';
    const instagramBusinessAccountId = config.instagramBusinessAccountId?.trim() || '';
    if (!accessToken || (!facebookPageId && !instagramBusinessAccountId)) {
      return res.json({ success: true, data: [], meta: { enabled: true, configured: false }, error: null });
    }

    if (mergedCache && Date.now() - mergedCache.ts < CACHE_TTL) {
      return res.json({ success: true, data: mergedCache.items, meta: { enabled: true, cached: true }, error: null });
    }

    const [facebookItems, instagramItems] = await Promise.all([
      facebookPageId ? fetchFacebookFeed(facebookPageId, accessToken).catch(() => []) : Promise.resolve([]),
      instagramBusinessAccountId ? fetchInstagramFeed(instagramBusinessAccountId, accessToken).catch(() => []) : Promise.resolve([]),
    ]);

    const items = buildResponseItems([...instagramItems, ...facebookItems]);
    mergedCache = { items, ts: Date.now() };

    return res.json({
      success: true,
      data: items,
      meta: {
        enabled: true,
        configured: true,
        facebookCount: facebookItems.length,
        instagramCount: instagramItems.length,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const clearSocialFeedCache = () => {
  mergedCache = null;
};
