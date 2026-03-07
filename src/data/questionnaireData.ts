import type { QuestionDef, QuestionnaireAnswers, TripPlan, TripSummary } from '../types/travel';
import { airports } from './flights';
import { destinations } from './destinations';

export const questions: QuestionDef[] = [
  {
    id: 'duration',
    title: 'When are you thinking of going, and how long?',
    inputType: 'options',
    options: [
      { id: 'lt-week', label: 'Less than a week' },
      { id: '1-week', label: '1 week' },
      { id: '2-weeks', label: '2 weeks' },
      { id: '3-plus', label: '3+ weeks' },
    ],
    allowCustom: true,
    allowSkip: true,
  },
  {
    id: 'budget',
    title: "What's your budget per person?",
    inputType: 'slider',
    options: [
      { id: 'budget', label: 'Budget', sublabel: '$500–1k' },
      { id: 'moderate', label: 'Moderate', sublabel: '$1k–3k' },
      { id: 'comfortable', label: 'Comfortable', sublabel: '$3k–5k' },
      { id: 'luxury', label: 'Luxury', sublabel: '$5k+' },
    ],
    sliderMin: 500,
    sliderMax: 10000,
    sliderStep: 100,
    sliderPrefix: '$',
    allowCustom: false,
    allowSkip: true,
  },
  {
    id: 'priorities',
    title: 'What matters most to you?',
    inputType: 'multi-select',
    options: [
      { id: 'relaxation', label: 'Relaxation & wellness' },
      { id: 'adventure', label: 'Adventure & outdoors' },
      { id: 'culture', label: 'Culture & food' },
      { id: 'nightlife', label: 'Nightlife & social' },
    ],
    allowCustom: true,
    allowSkip: true,
  },
  {
    id: 'mustHaves',
    title: 'Any must-haves for this trip?',
    inputType: 'multi-select',
    options: [
      { id: 'direct', label: 'Direct flights only' },
      { id: 'beach', label: 'Beach access' },
      { id: 'wifi', label: 'Good Wi-Fi' },
      { id: 'pet', label: 'Pet-friendly' },
    ],
    allowCustom: true,
    allowSkip: true,
  },
];

function findDest(id: string) {
  return destinations.find(d => d.id === id);
}

export function buildTripPlanFromAnswers(
  answers: QuestionnaireAnswers,
  triggerText: string,
): TripPlan {
  // Pick destination based on trigger keywords
  const text = triggerText.toLowerCase();
  const isBeach = /beach|ocean|coast|tropical|island|surf|relax/.test(text);
  const isAsia = /asia|japan|tokyo|thai|korea|kyoto/.test(text);

  // Determine duration label
  const durationLabel = answers.duration || '1 week';
  const budgetLabel = answers.budget || '$2,500';

  // Preference summary
  const prefs: string[] = [];
  if (answers.priorities) prefs.push(...(Array.isArray(answers.priorities) ? answers.priorities : [answers.priorities]));
  if (answers.mustHaves) prefs.push(...(Array.isArray(answers.mustHaves) ? answers.mustHaves : [answers.mustHaves]));

  const summary: TripSummary = {
    destination: isAsia ? 'Tokyo & Kyoto, Japan' : 'Cancún, Mexico',
    dates: 'Jul 10 – Jul 17, 2026',
    duration: durationLabel,
    budget: budgetLabel,
    preferences: prefs.length > 0 ? prefs : ['Relaxation & wellness', 'Beach access'],
    travelStyle: isBeach ? 'Beach & Relaxation' : isAsia ? 'Culture & Adventure' : 'Mixed Explorer',
  };

  const cancunDest = findDest('dest-cancun')!;
  const tokyoDest = findDest('dest-tokyo')!;
  const kyotoDest = findDest('dest-kyoto')!;

  if (isAsia) {
    return {
      id: 'plan-questionnaire-japan-' + Date.now(),
      title: 'Summer in Tokyo & Kyoto',
      status: 'proposed',
      origin: airports.SFO,
      summary,
      segments: [
        {
          id: 'sq-j1', type: 'flight', destination: tokyoDest,
          flight: {
            id: 'flt-sfo-nrt-q', origin: airports.SFO,
            destination: { code: 'NRT', city: 'Tokyo', country: 'JP', latitude: 35.772, longitude: 140.3929 },
            airline: 'United', price: 487, currency: 'USD', departureDate: '2026-07-15',
            durationMinutes: 660, stops: 0, cabinClass: 'economy', dealTag: 'cheapest',
          },
          startDate: '2026-07-15', endDate: '2026-07-15', estimatedCost: 487,
        },
        {
          id: 'sq-j2', type: 'stay', destination: tokyoDest,
          stay: { hotelName: 'Shinjuku Granbell Hotel', nightlyRate: 95, nights: 5, rating: 4.3 },
          startDate: '2026-07-15', endDate: '2026-07-20', estimatedCost: 475,
        },
        {
          id: 'sq-j3', type: 'activity', destination: tokyoDest,
          activity: { name: 'Tsukiji Outer Market Food Tour', description: 'Guided walking tour sampling fresh sushi, tamagoyaki, matcha sweets, and street food.', duration: '3 hours', cost: 75 },
          startDate: '2026-07-16', endDate: '2026-07-16', estimatedCost: 75,
        },
        {
          id: 'sq-j4', type: 'stay', destination: kyotoDest,
          stay: { hotelName: 'Kyoto Granvia Hotel', nightlyRate: 110, nights: 4, rating: 4.5 },
          startDate: '2026-07-20', endDate: '2026-07-24', estimatedCost: 440,
        },
        {
          id: 'sq-j5', type: 'activity', destination: kyotoDest,
          activity: { name: 'Fushimi Inari & Bamboo Grove', description: "Full-day guided tour of Kyoto's most iconic sites including traditional tea ceremony.", duration: 'Full day', cost: 90 },
          startDate: '2026-07-21', endDate: '2026-07-21', estimatedCost: 90,
        },
        {
          id: 'sq-j6', type: 'flight', destination: tokyoDest,
          flight: {
            id: 'flt-kix-sfo-q', origin: { code: 'KIX', city: 'Osaka', country: 'JP', latitude: 34.4347, longitude: 135.244 },
            destination: airports.SFO, airline: 'United', price: 487, currency: 'USD',
            departureDate: '2026-07-24', durationMinutes: 600, stops: 0, cabinClass: 'economy',
          },
          startDate: '2026-07-24', endDate: '2026-07-24', estimatedCost: 487,
        },
      ],
      totalEstimatedCost: 2054,
      createdAt: new Date().toISOString(),
    };
  }

  // Default: Cancún beach trip
  return {
    id: 'plan-questionnaire-cancun-' + Date.now(),
    title: '7 Days in Cancún',
    status: 'proposed',
    origin: airports.SFO,
    summary,
    segments: [
      {
        id: 'sq-c1', type: 'flight', destination: cancunDest,
        flight: {
          id: 'flt-sfo-cun-q', origin: airports.SFO,
          destination: { code: 'CUN', city: 'Cancún', country: 'MX', latitude: 21.0366, longitude: -86.877 },
          airline: 'Volaris', price: 245, currency: 'USD', departureDate: '2026-07-10',
          durationMinutes: 330, stops: 0, cabinClass: 'economy', dealTag: 'cheapest',
        },
        startDate: '2026-07-10', endDate: '2026-07-10', estimatedCost: 245,
      },
      {
        id: 'sq-c2', type: 'stay', destination: cancunDest,
        stay: { hotelName: 'Hyatt Ziva Cancún', nightlyRate: 85, nights: 6, rating: 4.5 },
        startDate: '2026-07-10', endDate: '2026-07-16', estimatedCost: 510,
      },
      {
        id: 'sq-c3', type: 'activity', destination: cancunDest,
        activity: { name: 'Chichén Itzá Day Trip', description: 'Guided tour to one of the New Seven Wonders of the World, including cenote swim and lunch.', duration: 'Full day', cost: 89 },
        startDate: '2026-07-12', endDate: '2026-07-12', estimatedCost: 89,
      },
      {
        id: 'sq-c4', type: 'activity', destination: cancunDest,
        activity: { name: 'Isla Mujeres Snorkeling', description: 'Catamaran ride to Isla Mujeres with snorkeling in the underwater museum (MUSA).', duration: '6 hours', cost: 65 },
        startDate: '2026-07-14', endDate: '2026-07-14', estimatedCost: 65,
      },
      {
        id: 'sq-c5', type: 'flight', destination: cancunDest,
        flight: {
          id: 'flt-cun-sfo-q', origin: { code: 'CUN', city: 'Cancún', country: 'MX', latitude: 21.0366, longitude: -86.877 },
          destination: airports.SFO, airline: 'Volaris', price: 245, currency: 'USD',
          departureDate: '2026-07-17', durationMinutes: 360, stops: 0, cabinClass: 'economy',
        },
        startDate: '2026-07-17', endDate: '2026-07-17', estimatedCost: 245,
      },
    ],
    totalEstimatedCost: 1154,
    createdAt: new Date().toISOString(),
  };
}
