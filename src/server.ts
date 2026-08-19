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
