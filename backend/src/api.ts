/**
 * backend/src/api.ts
 * Express router connecting the frontend to GMI Cloud (LLM), Exa (Search), and Gemini (AI).
 */

import { Router } from 'express';
import { getTravelSuggestions } from './gmiService.js';
import { searchFullDestinationBrief } from './exa/exaService.js';
import { generateLandmarkContent } from './geminiService.js';

export const apiRouter = Router();

/**
 * 1. Chat Endpoint (GMI Cloud)
 * 
 * POST /api/chat
 * Body: { prompt: "I want to go to nice beaches..." }
 * Returns: { recommendations: [...], followUpQuestion: "..." }
 */
apiRouter.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`[GMI] Generating suggestions for: "${prompt}"`);
    const result = await getTravelSuggestions(prompt);
    
    res.json(result);
  } catch (err: any) {
    console.error('[GMI Error]', err.message);
    res.status(500).json({ error: 'Failed to generate travel suggestions from AI' });
  }
});

/**
 * 2. Destination Details Endpoint (Exa)
 * 
 * POST /api/destination
 * Body: { city: "Kyoto", country: "Japan", origin: "San Francisco" }
 * Returns: { activities: [...], hotels: [...], flights: [...] }
 */
apiRouter.post('/destination', async (req, res) => {
  try {
    const { city, country, origin = 'San Francisco' } = req.body;
    
    if (!city || !country) {
      return res.status(400).json({ error: 'City and country are required' });
    }

    console.log(`[Exa] Fetching live data for ${city}, ${country} (from ${origin})`);
    
    const brief = await searchFullDestinationBrief(city, country, origin, {
      numResults: 3,
      maxHighlightChars: 512
    });
    
    res.json(brief);
  } catch (err: any) {
    console.error('[Exa Error]', err.message);
    res.status(500).json({ error: 'Failed to fetch destination deep-dive data' });
  }
});

/**
 * 3. Landmark Content Endpoint (Gemini)
 *
 * POST /api/landmark
 * Body: { name: "Colosseum", region: "Rome, Italy", constructionYear: "70" }
 * Returns: { imageBase64: "...", mimeType: "image/png", metadata: { ... } }
 */
apiRouter.post('/landmark', async (req, res) => {
  try {
    const { name, region, constructionYear } = req.body;
    if (!name || !region) {
      return res.status(400).json({ error: 'name and region are required' });
    }

    console.log(`[Gemini] Generating content for: "${name}" in ${region}`);
    const result = await generateLandmarkContent(name, region, constructionYear || '');
    res.json(result);
  } catch (err: any) {
    console.error('[Gemini Error]', err.message);
    if (err.message === 'GEMINI_API_KEY is not configured') {
      return res.status(503).json({ error: 'Gemini API key is not configured on the server.' });
    }
    res.status(500).json({ error: err.message || 'Failed to generate landmark content' });
  }
});
