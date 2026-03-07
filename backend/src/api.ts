/**
 * backend/src/api.ts
 * Express router connecting the frontend to GMI Cloud (LLM) and Exa (Search).
 */

import { Router } from 'express';
import { getTravelSuggestions } from './gmiService.js';
import { searchFullDestinationBrief } from './exa/exaService.js';

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
