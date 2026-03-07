/**
 * backend/src/index.ts
 * Entry point for the Wandr backend server.
 * Serves as the integration hub for Exa search and future backend capabilities.
 */

import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'wandr-backend',
    exa: !!process.env.EXA_API_KEY && process.env.EXA_API_KEY !== 'MY_EXA_API_KEY',
  });
});

// TODO: Mount Exa route handlers here as they are developed
// import { exaRouter } from './exa/routes.js';
// app.use('/api/exa', exaRouter);

app.listen(PORT, () => {
  console.log(`🚀 Wandr backend running on http://localhost:${PORT}`);
  console.log(`   Exa API key: ${process.env.EXA_API_KEY ? '✅ loaded' : '❌ missing (add to backend/.env)'}`);
});

export default app;
