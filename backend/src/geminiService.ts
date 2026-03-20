/**
 * geminiService.ts
 * Server-side integration with the Google Gemini API.
 * Keeps the GEMINI_API_KEY out of the client bundle.
 */

import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export interface LandmarkContent {
  imageBase64: string;
  mimeType: string;
  metadata: {
    location: {
      country: string;
      cityRegion: string;
      geographicRegion: string;
    };
    period: {
      yearBuilt: string;
      era: string;
    };
    influences: {
      styles: string[];
      influences: string[];
      traditions: string[];
    };
    purpose: {
      function: string;
      patron: string;
      intent: string;
    };
    significance: {
      importance: string;
      innovations: string;
      influence: string;
    };
  };
}

export async function generateLandmarkContent(
  name: string,
  region: string,
  constructionYear: string
): Promise<LandmarkContent> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const withRetry = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 2000
  ): Promise<T> => {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        const errorMessage = err.message || '';
        const isTransient =
          errorMessage.includes('503') ||
          errorMessage.includes('UNAVAILABLE') ||
          errorMessage.includes('high demand') ||
          err.status === 503;
        if (!isTransient || i === maxRetries - 1) {
          throw err;
        }
        const delay = initialDelay * Math.pow(2, i);
        console.warn(
          `Retrying Gemini call (${i + 1}/${maxRetries}) after ${delay}ms: ${errorMessage}`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  };

  const [imageResponse, textResponse] = await Promise.all([
    withRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            {
              text: `High-detail axonometric (isometric) architectural technical drawing of ${name} in ${region}. True isometric projection with no perspective distortion. Architectural massing, detailed facade systems, structural elements, and roof details. Precise, clean, soft blue-gray linework on an aged parchment drafting paper background with subtle grain. Very light washes for surfaces. Minimal technical annotations like section markers, grid hints, and scale references in drafting-style typography. Centered composition with comfortable margins. Archival museum-grade quality, technical precision, calm and timeless aesthetic. No photorealism, no heavy shadows, no perspective.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
            imageSize: '1K',
          },
        },
      })
    ),
    withRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a concise but authoritative architectural description for the landmark: ${name} (Region: ${region}, Year: ${constructionYear}). Use a scholarly, museum-grade tone.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              location: {
                type: Type.OBJECT,
                properties: {
                  country: { type: Type.STRING },
                  cityRegion: { type: Type.STRING },
                  geographicRegion: { type: Type.STRING },
                },
                required: ['country', 'cityRegion', 'geographicRegion'],
              },
              period: {
                type: Type.OBJECT,
                properties: {
                  yearBuilt: { type: Type.STRING },
                  era: { type: Type.STRING },
                },
                required: ['yearBuilt', 'era'],
              },
              influences: {
                type: Type.OBJECT,
                properties: {
                  styles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  influences: { type: Type.ARRAY, items: { type: Type.STRING } },
                  traditions: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['styles', 'influences', 'traditions'],
              },
              purpose: {
                type: Type.OBJECT,
                properties: {
                  function: { type: Type.STRING },
                  patron: { type: Type.STRING },
                  intent: { type: Type.STRING },
                },
                required: ['function', 'patron', 'intent'],
              },
              significance: {
                type: Type.OBJECT,
                properties: {
                  importance: { type: Type.STRING },
                  innovations: { type: Type.STRING },
                  influence: { type: Type.STRING },
                },
                required: ['importance', 'innovations', 'influence'],
              },
            },
            required: ['location', 'period', 'influences', 'purpose', 'significance'],
          },
        },
      })
    ),
  ]);

  // Extract image
  let imageBase64 = '';
  let mimeType = 'image/png';
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageBase64 = part.inlineData.data || '';
      mimeType = part.inlineData.mimeType || 'image/png';
      break;
    }
  }

  if (!imageBase64) {
    throw new Error('No blueprint image was generated. Please try again.');
  }

  // Extract metadata
  if (!textResponse.text) {
    throw new Error('No architectural metadata was generated. Please try again.');
  }
  const metadata = JSON.parse(textResponse.text);

  return { imageBase64, mimeType, metadata };
}
