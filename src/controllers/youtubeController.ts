import { Request, Response, NextFunction } from 'express';
import https from 'https';
import Config from '../models/Config';

const TRUST_CHANNEL_ID = 'UCHkz4dQ_7mbDT6wF_nN5x4g'; // @abhinacharitabletrust

interface VideoItem {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

// In-process oEmbed cache so we don't hit YouTube on every request
const oembedCache = new Map<string, { title: string; ts: number }>();
const OEMBED_TTL = 60 * 60 * 1000; // 1 hour

function extractVideoId(raw: string): string | null {
  const url = raw.split('::')[0].trim();
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function extractCustomTitle(raw: string): string {
  const idx = raw.indexOf('::');
  return idx !== -1 ? raw.slice(idx + 2).trim() : '';
}

function httpsGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function fetchOembedTitle(videoId: string): Promise<string> {
  const cached = oembedCache.get(videoId);
  if (cached && Date.now() - cached.ts < OEMBED_TTL) return cached.title;

  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const data = await httpsGet(url);
    const title = data.title || '';
    oembedCache.set(videoId, { title, ts: Date.now() });
    return title;
  } catch {
    return '';
  }
}

// RSS feed cache
let rssCache: { videos: VideoItem[]; ts: number } | null = null;
const RSS_TTL = 30 * 60 * 1000; // 30 minutes

async function fetchChannelRSS(channelId: string): Promise<VideoItem[]> {
  if (rssCache && Date.now() - rssCache.ts < RSS_TTL) return rssCache.videos;

  return new Promise((resolve) => {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    https.get(url, res => {
      let xml = '';
      res.on('data', c => { xml += c; });
      res.on('end', async () => {
        try {
          const entries: VideoItem[] = [];
          const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
          let m;
          while ((m = entryRegex.exec(xml)) !== null) {
            const block = m[1];
            const vidMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
            const titleMatch = block.match(/<title>([^<]+)<\/title>/);
            const dateMatch = block.match(/<published>([^<]+)<\/published>/);
            if (vidMatch && titleMatch) {
              const videoId = vidMatch[1];
              entries.push({
                videoId,
                title: titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                publishedAt: dateMatch ? dateMatch[1] : '',
              });
            }
          }
          rssCache = { videos: entries, ts: Date.now() };
          resolve(entries);
        } catch {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

// 1-hour YouTube Data API Cache (Server-side)
let apiCache: { videos: VideoItem[]; ts: number } | null = null;
const API_CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const getYoutubeVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await Config.findOne();
    const apiKey = config?.youtubeApiKey || process.env.YOUTUBE_API_KEY || 'AIzaSyAGa1sOBU7Qriv7NKEvenzPwd6kBg-MBwo';
    const channelId = config?.youtubeChannelId || process.env.YOUTUBE_CHANNEL_ID || TRUST_CHANNEL_ID;
    
    // Derived uploads playlist ID (UC -> UU)
    const uploadsPlaylistId = channelId.startsWith('UC') ? `UU${channelId.slice(2)}` : 'UUHkz4dQ_7mbDT6wF_nN5x4g';

    const videos: VideoItem[] = [];

    // Option A: Cached YouTube Data API (1-hour TTL cache)
    if (apiKey) {
      if (apiCache && Date.now() - apiCache.ts < API_CACHE_TTL) {
        videos.push(...apiCache.videos);
      } else {
        const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${uploadsPlaylistId}&key=${apiKey}`;
        try {
          const data = await httpsGet(apiUrl);
          const fetchedVideos: VideoItem[] = [];
          for (const item of (data.items || [])) {
            const snippet = item.snippet || {};
            const resourceId = snippet.resourceId || {};
            const videoId = resourceId.videoId;
            if (videoId) {
              fetchedVideos.push({
                videoId,
                title: snippet.title || 'ABHINA Trust',
                thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                publishedAt: snippet.publishedAt || '',
              });
            }
          }
          if (fetchedVideos.length > 0) {
            apiCache = { videos: fetchedVideos, ts: Date.now() };
            videos.push(...fetchedVideos);
          }
        } catch { /* fall through to RSS on API quota or network error */ }
      }
    }

    // Option B: Trust channel RSS (free fallback, 30-min cache)
    if (videos.length === 0) {
      const rssVideos = await fetchChannelRSS(channelId);
      videos.push(...rssVideos);
    }

    // Option C: manually entered URLs (fallback)
    if (videos.length === 0 && config?.youtubeVideoUrls?.length) {
      const titleFetches = config.youtubeVideoUrls.map(async (raw: string) => {
        const videoId = extractVideoId(raw);
        if (!videoId) return null;
        const customTitle = extractCustomTitle(raw);
        const title = customTitle || await fetchOembedTitle(videoId);
        return { videoId, title, thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, publishedAt: '' } as VideoItem;
      });
      const results = await Promise.all(titleFetches);
      results.forEach(v => { if (v) videos.push(v); });
    }

    res.json({ success: true, data: videos, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const updateYoutubeConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { youtubeApiKey, youtubeChannelId, youtubeVideoUrls } = req.body;
    const update: Record<string, any> = { youtubeChannelId, youtubeVideoUrls };
    if (youtubeApiKey !== undefined && youtubeApiKey !== '') {
      update.youtubeApiKey = youtubeApiKey;
    }
    // Clear caches so new config takes effect immediately
    oembedCache.clear();
    apiCache = null;
    rssCache = null;
    await Config.findOneAndUpdate({}, { $set: update }, { upsert: true });
    res.json({ success: true, data: { message: 'YouTube config saved' }, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

