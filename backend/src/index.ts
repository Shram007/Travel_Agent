/**
 * backend/src/index.ts
 * Entry point for the Wandr backend server.
 * Serves as the integration hub for Exa search and future backend capabilities.
 */

import 'dotenv/config';
import express from 'express';

import cors from 'cors';
import { apiRouter } from './api.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allow the Vite frontend (usually port 5173 or 3000) to call the backend
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'wandr-backend',
    exa: !!process.env.EXA_API_KEY && process.env.EXA_API_KEY !== 'MY_EXA_API_KEY',
    gmi: !!process.env.GMI_API_KEY && process.env.GMI_API_KEY !== 'MY_GMI_API_KEY',
  });
});

// Mount AI and Search routes
app.use('/api', apiRouter);



// Only run the server locally. Vercel handles this in production.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Wandr backend running on http://localhost:${PORT}`);
    console.log(`   Exa API key: ${process.env.EXA_API_KEY ? '✅ loaded' : '❌ missing (add to backend/.env)'}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Wandr backend running on http://localhost:${PORT}`);
    console.log(`   Exa API key: ${process.env.EXA_API_KEY ? '✅ loaded' : '❌ missing'}`);
    console.log(`   GMI API key: ${process.env.GMI_API_KEY ? '✅ loaded' : '❌ missing'}`);
  });
}

export default app;
