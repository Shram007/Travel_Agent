/**
 * explore_single.mjs — Exa API exploration for a single destination query.
 * Run: node backend/explore_single.mjs
 */

import Exa from 'exa-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../.env');
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.replace(/\r/, '').split('=');
    if (k && !k.startsWith('#') && v.length) process.env[k.trim()] = v.join('=').trim();
  });
} catch { /* ignore */ }

const EXA_API_KEY = process.env.EXA_API_KEY;
if (!EXA_API_KEY || EXA_API_KEY === 'MY_EXA_API_KEY') process.exit(1);

const exa = new Exa(EXA_API_KEY);

async function main() {
  const origin = "San Francisco";
  const destination = "Kyoto";

  console.log(`🌍 Query: Single destination "${destination}" from "${origin}"\n`);

  // Query 1: Things to do (just the place name)
  const activities = await exa.search(destination, {
    type: 'auto',
    numResults: 2,
    contents: {
      highlights: { numSentences: 3, highlightsPerResult: 2 },
    },
  });

  // Query 2: Flights (origin to destination)
  const flights = await exa.search(`Flights from ${origin} to ${destination}`, {
    type: 'auto',
    numResults: 2,
    contents: {
      highlights: { numSentences: 3, highlightsPerResult: 2 },
    },
  });

  const response = {
    activities: activities.results.map(r => ({
      title: r.title,
      url: r.url,
      highlights: r.highlights
    })),
    flights: flights.results.map(r => ({
      title: r.title,
      url: r.url,
      highlights: r.highlights
    }))
  };

  console.log(JSON.stringify(response, null, 2));
}

main();
