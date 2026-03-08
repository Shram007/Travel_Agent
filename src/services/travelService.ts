/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { destinations, Destination } from '../data/destinations';

const BACKEND_URL = 'http://localhost:3001/api';

export interface TripParams {
  origin: string;
  budget: number;
  duration: number;
  season: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TourStop {
  destinationId: string;
  narration: string;
}

export interface AIResponse {
  assistantResponse: string;
  suggestedDestinationIds: string[];
  updatedParams: Partial<TripParams>;
  tourScript: TourStop[];
}

/**
 * Finds a destination ID in our local database that matches the city/country from the backend.
 * Uses a simple exact match or case-insensitive search.
 */
function findDestinationId(city: string, country: string): string | null {
  const cityLower = city.toLowerCase();
  const countryLower = country.toLowerCase();

  // Try exact match on name
  const match = destinations.find(
    (d) => d.name.toLowerCase() === cityLower || d.name.toLowerCase().includes(cityLower)
  );

  if (match) return match.id;

  // Try country match if city fails (optional fallback, maybe risky)
  return null;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  currentParams: TripParams
): Promise<AIResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: message }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    // The backend returns: { recommendations: [{city, country, description}], followUpQuestion: "..." }
    const recommendations = data.recommendations || [];
    const followUp = data.followUpQuestion || '';

    const suggestedIds: string[] = [];
    const tourScript: TourStop[] = [];

    recommendations.forEach((rec: any) => {
      const id = findDestinationId(rec.city, rec.country);
      if (id) {
        suggestedIds.push(id);
        tourScript.push({
          destinationId: id,
          narration: rec.description,
        });
      }
    });

    // We build the assistant response by combining the logic and the follow up
    const assistantResponse = `I found some interesting places for you: ${recommendations
      .map((r: any) => `**${r.city}**`)
      .join(', ')}. ${followUp}`;

    return {
      assistantResponse,
      suggestedDestinationIds: suggestedIds,
      updatedParams: {}, // The backend doesn't currently return extracted params
      tourScript: tourScript,
    };
  } catch (error) {
    console.error('Atlas AI error:', error);
    return {
      assistantResponse:
        "I'm having trouble connecting to the Atlas servers. Make sure the backend is running at http://localhost:3001.",
      suggestedDestinationIds: [],
      updatedParams: {},
      tourScript: [],
    };
  }
}

/**
 * Interface for the Exa search results returned by the backend
 */
export interface DestinationBrief {
  city: string;
  country: string;
  summary: string;
  highlights: string[];
  activities: string[];
  hotels: Array<{ name: string; price: string; description: string }>;
  flights?: { price: string; duration: string };
}

/**
 * Calls the backend to get deep-dive live data for a specific destination
 */
export async function fetchLiveDestinationData(
  city: string,
  country: string,
  origin: string = 'San Francisco'
): Promise<DestinationBrief | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/destination`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city, country, origin }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Exa fetch error:', error);
    return null;
  }
}

export function getQuickSuggestions(): string[] {
  return [
    'Beach destinations in Europe',
    'Plan a 7-day trip to Japan',
    'Best destinations for adventure travel',
    'Romantic cities for a honeymoon',
    'Budget travel in Southeast Asia',
    'Where should I go for 10 days in fall?',
  ];
}
