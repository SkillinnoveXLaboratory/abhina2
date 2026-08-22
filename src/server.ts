import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import connectDB from './config/db';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();
const androidPackageName =
  process.env.ANDROID_APP_PACKAGE || 'com.abhina.charitabletrust';
const assetLinkFingerprints = (
  process.env.ANDROID_SHA256_FINGERPRINTS ||
  [
    '59:79:02:CA:B9:12:55:2F:5C:E0:48:3E:D1:AD:05:20:8C:31:0D:7D:C7:AB:F8:96:0D:64:5F:18:7A:27:AE:64',
    '98:93:23:4A:4A:05:D8:B9:B6:31:E6:BB:9D:76:E2:1D:D7:D8:E7:C1:A7:E8:6A:F0:06:FB:3D:BA:1C:3D:CD:F8',
  ].join(',')
)
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

// Connect to MongoDB
connectDB();

// CORS — restrict to known frontends. Override/extend via CORS_ORIGINS
// (comma-separated) in .env. Requests with no Origin (curl, server-to-server,
// same-origin) are always allowed.
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  'https://abhina.net,https://www.abhina.net,http://localhost:3073'
)
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('[:method] :url :status :response-time ms'));

// HTTP cache headers — lets the browser HTTP cache AND any CDN/edge (Cloudflare,
// Vercel, nginx) cache read-only public content. Admin/auth and any mutation are
// never cached. `s-maxage` is the edge TTL; `stale-while-revalidate` serves a
// slightly stale copy at the edge while it refreshes in the background.
app.use('/api/v1', (req: Request, res: Response, next) => {
  const isPublicRead =
    req.method === 'GET' &&
    !req.path.startsWith('/admin') &&
    !req.path.startsWith('/auth');
  res.set(
    'Cache-Control',
    isPublicRead
      ? 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
      : 'no-store'
  );
  next();
});

// API routes
app.use('/api/v1', apiRoutes);

app.get('/.well-known/assetlinks.json', (_req: Request, res: Response) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: androidPackageName,
        sha256_cert_fingerprints: assetLinkFingerprints,
      },
    },
  ]);
});

// Serve Static Assets in production (Vite build output)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.use((req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'ABHINA Charitable Trust API is running...' });
  });
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5073;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
