/**
 * gmiService.ts
 * Integrates with GMI Cloud's OpenAI-compatible Inference Engine.
 */

import 'dotenv/config';

const GMI_API_KEY = process.env.GMI_API_KEY || '';
const GMI_BASE_URL = 'https://api.gmicloud.ai/v1';
const DEFAULT_MODEL = 'llama-3-70b-instruct'; // Can be configured later

export interface ChatSuggestionResult {
  recommendations: Array<{
    city: string;
    country: string;
    description: string;
  }>;
  followUpQuestion: string;
  rawResponse: string;
}

export async function getTravelSuggestions(userPrompt: string): Promise<ChatSuggestionResult> {
  if (!GMI_API_KEY) {
    throw new Error('GMI_API_KEY is not configured');
  }

  const systemMessage = `You are a world-class travel agent. The user will ask for travel recommendations.
You must respond with EXACTLY 5 recommendations and EXACTLY 1 follow-up question.
Format your response exactly like this:

RECOMMENDATIONS:
1. City, Country - Brief description of why they should go here.
2. City, Country - Brief description...
3. City, Country - Brief description...
4. City, Country - Brief description...
5. City, Country - Brief description...

FOLLOW-UP:
[Your single follow-up question to refine their preferences]`;

  const response = await fetch(`${GMI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GMI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`GMI Cloud API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';

  // Parse the response
  const recommendations: ChatSuggestionResult['recommendations'] = [];
  let followUpQuestion = '';

  try {
    const recSection = content.split('RECOMMENDATIONS:')[1]?.split('FOLLOW-UP:')[0] || '';
    const followUpSection = content.split('FOLLOW-UP:')[1] || '';

    // Extract recommendations
    const lines = recSection.split('\n').filter(l => l.trim().match(/^\d+\./));
    for (const line of lines) {
      // Expecting format: "1. City, Country - Description"
      const match = line.match(/^\d+\.\s*([^,-]+),\s*([^-]+)\s*-\s*(.+)$/);
      if (match) {
        recommendations.push({
          city: match[1].trim(),
          country: match[2].trim(),
          description: match[3].trim()
        });
      }
    }

    followUpQuestion = followUpSection.trim();
  } catch (e) {
    console.warn("Failed to parse GMI response perfectly", e);
  }

  return {
    recommendations,
    followUpQuestion,
    rawResponse: content
  };
}
