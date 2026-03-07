import type { ChatMessage, ChatAction, TripPlan } from '../types/travel';
import { airports } from './flights';
import { destinations } from './destinations';

export interface ChatScriptEntry {
  triggers: RegExp[];
  responses: Array<{
    content: string;
    actions?: ChatAction[];
    delay?: number;
  }>;
}

const budgetDests = ['dest-lisbon', 'dest-mexico-city', 'dest-bangkok', 'dest-cancun', 'dest-havana', 'dest-buenos-aires'];
const beachDests = ['dest-bali', 'dest-cancun', 'dest-santorini', 'dest-maldives', 'dest-costa-rica'];
const cityDests = ['dest-tokyo', 'dest-paris', 'dest-london', 'dest-new-york', 'dest-barcelona', 'dest-seoul'];
const culturalDests = ['dest-rome', 'dest-kyoto', 'dest-marrakech', 'dest-petra', 'dest-havana'];
const adventureDests = ['dest-reykjavik', 'dest-costa-rica', 'dest-cape-town', 'dest-petra', 'dest-marrakech'];
const europeDests = ['dest-paris', 'dest-lisbon', 'dest-rome', 'dest-barcelona', 'dest-london', 'dest-amsterdam', 'dest-santorini', 'dest-reykjavik'];
const asiaDests = ['dest-tokyo', 'dest-kyoto', 'dest-bali', 'dest-bangkok', 'dest-seoul', 'dest-maldives'];

function findDest(id: string) {
  return destinations.find(d => d.id === id);
}

const cancunDest = findDest('dest-cancun')!;
const cancunTripPlan: TripPlan = {
  id: 'plan-cancun-beach',
  title: '7 Days in Cancún',
  status: 'proposed',
  origin: airports.SFO,
  segments: [
    {
      id: 'seg-1',
      type: 'flight',
      destination: cancunDest,
      flight: {
        id: 'flt-sfo-cun-1',
        origin: airports.SFO,
        destination: { code: 'CUN', city: 'Cancún', country: 'MX', latitude: 21.0366, longitude: -86.877 },
        airline: 'Volaris',
        price: 245,
        currency: 'USD',
        departureDate: '2026-07-10',
        durationMinutes: 330,
        stops: 0,
        cabinClass: 'economy',
        dealTag: 'cheapest',
      },
      startDate: '2026-07-10',
      endDate: '2026-07-10',
      estimatedCost: 245,
    },
    {
      id: 'seg-2',
      type: 'stay',
      destination: cancunDest,
      stay: { hotelName: 'Hyatt Ziva Cancún', nightlyRate: 85, nights: 6, rating: 4.5 },
      startDate: '2026-07-10',
      endDate: '2026-07-16',
      estimatedCost: 510,
    },
    {
      id: 'seg-3',
      type: 'activity',
      destination: cancunDest,
      activity: { name: 'Chichén Itzá Day Trip', description: 'Guided tour to one of the New Seven Wonders of the World, including cenote swim and lunch.', duration: 'Full day', cost: 89 },
      startDate: '2026-07-12',
      endDate: '2026-07-12',
      estimatedCost: 89,
    },
    {
      id: 'seg-4',
      type: 'activity',
      destination: cancunDest,
      activity: { name: 'Isla Mujeres Snorkeling', description: 'Catamaran ride to Isla Mujeres with snorkeling in the underwater museum (MUSA).', duration: '6 hours', cost: 65 },
      startDate: '2026-07-14',
      endDate: '2026-07-14',
      estimatedCost: 65,
    },
    {
      id: 'seg-5',
      type: 'flight',
      destination: cancunDest,
      flight: {
        id: 'flt-cun-sfo-return',
        origin: { code: 'CUN', city: 'Cancún', country: 'MX', latitude: 21.0366, longitude: -86.877 },
        destination: airports.SFO,
        airline: 'Volaris',
        price: 245,
        currency: 'USD',
        departureDate: '2026-07-17',
        durationMinutes: 360,
        stops: 0,
        cabinClass: 'economy',
      },
      startDate: '2026-07-17',
      endDate: '2026-07-17',
      estimatedCost: 245,
    },
  ],
  totalEstimatedCost: 1154,
  createdAt: new Date().toISOString(),
};

const tokyoKyotoDest = findDest('dest-tokyo')!;
const tokyoTripPlan: TripPlan = {
  id: 'plan-summer-japan',
  title: 'Summer in Tokyo & Kyoto',
  status: 'proposed',
  origin: airports.SFO,
  segments: [
    {
      id: 'seg-j1',
      type: 'flight',
      destination: tokyoKyotoDest,
      flight: {
        id: 'flt-sfo-nrt-1',
        origin: airports.SFO,
        destination: { code: 'NRT', city: 'Tokyo', country: 'JP', latitude: 35.772, longitude: 140.3929 },
        airline: 'United',
        price: 487,
        currency: 'USD',
        departureDate: '2026-07-15',
        returnDate: '2026-07-29',
        durationMinutes: 660,
        stops: 0,
        cabinClass: 'economy',
        dealTag: 'cheapest',
      },
      startDate: '2026-07-15',
      endDate: '2026-07-15',
      estimatedCost: 487,
    },
    {
      id: 'seg-j2',
      type: 'stay',
      destination: tokyoKyotoDest,
      stay: { hotelName: 'Shinjuku Granbell Hotel', nightlyRate: 95, nights: 5, rating: 4.3 },
      startDate: '2026-07-15',
      endDate: '2026-07-20',
      estimatedCost: 475,
    },
    {
      id: 'seg-j3',
      type: 'activity',
      destination: tokyoKyotoDest,
      activity: { name: 'Tsukiji Outer Market Food Tour', description: 'Guided walking tour sampling fresh sushi, tamagoyaki, matcha sweets, and street food.', duration: '3 hours', cost: 75 },
      startDate: '2026-07-16',
      endDate: '2026-07-16',
      estimatedCost: 75,
    },
    {
      id: 'seg-j4',
      type: 'stay',
      destination: findDest('dest-kyoto')!,
      stay: { hotelName: 'Kyoto Granvia Hotel', nightlyRate: 110, nights: 4, rating: 4.5 },
      startDate: '2026-07-20',
      endDate: '2026-07-24',
      estimatedCost: 440,
    },
    {
      id: 'seg-j5',
      type: 'activity',
      destination: findDest('dest-kyoto')!,
      activity: { name: 'Fushimi Inari & Bamboo Grove', description: 'Full-day guided tour of Kyoto\'s most iconic sites including traditional tea ceremony.', duration: 'Full day', cost: 90 },
      startDate: '2026-07-21',
      endDate: '2026-07-21',
      estimatedCost: 90,
    },
    {
      id: 'seg-j6',
      type: 'flight',
      destination: tokyoKyotoDest,
      flight: {
        id: 'flt-nrt-sfo-return',
        origin: { code: 'KIX', city: 'Osaka', country: 'JP', latitude: 34.4347, longitude: 135.244 },
        destination: airports.SFO,
        airline: 'United',
        price: 487,
        currency: 'USD',
        departureDate: '2026-07-24',
        durationMinutes: 600,
        stops: 0,
        cabinClass: 'economy',
      },
      startDate: '2026-07-24',
      endDate: '2026-07-24',
      estimatedCost: 487,
    },
  ],
  totalEstimatedCost: 2054,
  createdAt: new Date().toISOString(),
};

export const chatScripts: ChatScriptEntry[] = [
  // Budget / cheap
  {
    triggers: [/cheap|budget|affordable|under.*\$?500/i],
    responses: [
      {
        content: "I found some great budget-friendly destinations! Let me help you find the perfect match... ✈️",
        actions: [
          { type: 'highlight_destinations', destinationIds: budgetDests },
          { type: 'show_flights', originCode: 'SFO', destinationIds: budgetDests },
          { type: 'open_questionnaire' },
        ],
        delay: 1200,
      },
    ],
  },
  // Beach
  {
    triggers: [/beach|ocean|coast|tropical|island|surf/i],
    responses: [
      {
        content: "Great choice! Let me help you plan the perfect beach getaway! I just have a few quick questions... 🏖️",
        actions: [
          { type: 'highlight_destinations', destinationIds: beachDests },
          { type: 'show_flights', originCode: 'SFO', destinationIds: beachDests },
          { type: 'open_questionnaire' },
        ],
        delay: 1000,
      },
    ],
  },
  // City exploration
  {
    triggers: [/city|urban|metro|nightlife|downtown/i],
    responses: [
      {
        content: "Love it! Here are the most exciting cities to explore right now 🌃",
        actions: [
          { type: 'highlight_destinations', destinationIds: cityDests },
          { type: 'show_flights', originCode: 'SFO', destinationIds: cityDests },
        ],
        delay: 1000,
      },
      {
        content: "Tokyo ($487) and Seoul ($498) are trending hard right now, and Barcelona has a steal at $420 direct! Which city catches your eye?",
        actions: [
          { type: 'ask_clarification', options: ['Tokyo', 'Seoul', 'Barcelona', 'Show all cities'] },
        ],
        delay: 800,
      },
    ],
  },
  // Cultural
  {
    triggers: [/cultur|histor|temple|ancient|museum|heritage/i],
    responses: [
      {
        content: "Here are destinations rich in history and culture 🏛️",
        actions: [
          { type: 'highlight_destinations', destinationIds: culturalDests },
          { type: 'show_flights', originCode: 'SFO', destinationIds: culturalDests },
        ],
        delay: 1000,
      },
    ],
  },
  // Adventure
  {
    triggers: [/adventur|hik|trek|nature|wild|outdoor/i],
    responses: [
      {
        content: "Adventure awaits! These destinations will get your adrenaline pumping 🏔️",
        actions: [
          { type: 'highlight_destinations', destinationIds: adventureDests },
          { type: 'show_flights', originCode: 'SFO', destinationIds: adventureDests },
        ],
        delay: 1000,
      },
    ],
  },
  // Europe
  {
    triggers: [/europe|eu\b|mediterranean/i],
    responses: [
      {
        content: "Europe has amazing options this summer! Here's what I found from SFO 🇪🇺",
        actions: [
          { type: 'highlight_destinations', destinationIds: europeDests },
          { type: 'show_flights', originCode: 'SFO', destinationIds: europeDests },
          { type: 'zoom_to', latitude: 48, longitude: 10, zoomLevel: 3 },
        ],
        delay: 1200,
      },
      {
        content: "Lisbon at $389 is the cheapest, and Barcelona at $420 is a total steal. Want a detailed trip plan?",
        actions: [
          { type: 'ask_clarification', options: ['Plan a Lisbon trip', 'Plan a Barcelona trip', 'Show all Europe options'] },
        ],
        delay: 700,
      },
    ],
  },
  // Asia
  {
    triggers: [/asia|japan|thai|bali|korea|tokyo|kyoto/i],
    responses: [
      {
        content: "Asia is incredible! Here are the best options from SFO 🌏",
        actions: [
          { type: 'highlight_destinations', destinationIds: asiaDests },
          { type: 'show_flights', originCode: 'SFO', destinationIds: asiaDests },
          { type: 'zoom_to', latitude: 25, longitude: 110, zoomLevel: 2.5 },
        ],
        delay: 1200,
      },
      {
        content: "Bangkok is the budget king at $445, and Tokyo has a killer deal at $487 direct! Interested in a Japan trip?",
        actions: [
          { type: 'ask_clarification', options: ['Plan a Japan trip', 'Plan a Bangkok trip', 'Show all Asia options'] },
        ],
        delay: 800,
      },
    ],
  },
  // Cancún trip plan
  {
    triggers: [/canc[uú]n|plan.*canc|build.*canc/i],
    responses: [
      {
        content: "I've put together a perfect 7-day Cancún beach trip for you! 🌴 Check out the plan — flights, hotel, and activities all included for just $1,154.",
        actions: [
          { type: 'update_trip_plan', plan: cancunTripPlan },
          { type: 'open_trip_panel' },
          { type: 'highlight_destinations', destinationIds: ['dest-cancun'] },
          { type: 'show_flights', originCode: 'SFO', destinationIds: ['dest-cancun'] },
          { type: 'zoom_to', latitude: 21.16, longitude: -86.85, zoomLevel: 5 },
        ],
        delay: 1500,
      },
    ],
  },
  // Japan trip plan
  {
    triggers: [/plan.*japan|japan.*trip|plan.*tokyo|build.*japan/i],
    responses: [
      {
        content: "Here's an amazing 10-day Japan adventure — Tokyo + Kyoto! 🇯🇵 The total comes to $2,054 including flights, hotels, and guided tours.",
        actions: [
          { type: 'update_trip_plan', plan: tokyoTripPlan },
          { type: 'open_trip_panel' },
          { type: 'highlight_destinations', destinationIds: ['dest-tokyo', 'dest-kyoto'] },
          { type: 'show_flights', originCode: 'SFO', destinationIds: ['dest-tokyo'] },
          { type: 'zoom_to', latitude: 35.5, longitude: 137, zoomLevel: 5 },
        ],
        delay: 1500,
      },
    ],
  },
  // Summer general
  {
    triggers: [/summer|june|july|august/i],
    responses: [
      {
        content: "Summer is the best time to travel! Here are top picks from SFO for this summer ☀️",
        actions: [
          { type: 'highlight_destinations', destinationIds: ['dest-lisbon', 'dest-barcelona', 'dest-cancun', 'dest-bali', 'dest-tokyo', 'dest-reykjavik'] },
          { type: 'show_flights', originCode: 'SFO', destinationIds: ['dest-lisbon', 'dest-barcelona', 'dest-cancun', 'dest-bali', 'dest-tokyo', 'dest-reykjavik'] },
        ],
        delay: 1200,
      },
      {
        content: "What kind of vibe are you looking for?",
        actions: [
          { type: 'ask_clarification', options: ['Beach & relaxation', 'City & culture', 'Nature & adventure', 'Budget-friendly'] },
        ],
        delay: 600,
      },
    ],
  },
  // Anywhere / surprise me
  {
    triggers: [/anywhere|surprise|random|don.t know|not sure|suggest/i],
    responses: [
      {
        content: "I love a good surprise! Based on your past trips and what's trending, here are my top picks for you, Alex 🎯",
        actions: [
          { type: 'highlight_destinations', destinationIds: ['dest-lisbon', 'dest-kyoto', 'dest-cancun', 'dest-marrakech', 'dest-costa-rica'] },
          { type: 'show_flights', originCode: 'SFO', destinationIds: ['dest-lisbon', 'dest-kyoto', 'dest-cancun', 'dest-marrakech', 'dest-costa-rica'] },
        ],
        delay: 1200,
      },
      {
        content: "These are all great value and match your love for food and culture. Where does your heart lean?",
        actions: [
          { type: 'ask_clarification', options: ['Lisbon 🇵🇹 $389', 'Kyoto 🇯🇵 $530', 'Cancún 🇲🇽 $245', 'Marrakech 🇲🇦 $520'] },
        ],
        delay: 800,
      },
    ],
  },
  // Default / fallback
  {
    triggers: [/.*/],
    responses: [
      {
        content: "That sounds exciting! Let me help you plan the perfect trip. I just need a few details... ✨",
        actions: [
          { type: 'open_questionnaire' },
        ],
        delay: 800,
      },
    ],
  },
];

export const welcomeMessages: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: "Hey Alex! 👋 I'm your travel assistant. Tell me where you're dreaming of going, or I can find deals and build a trip plan for you. Try something like \"cheap beach vacation\" or \"I want to explore Asia this summer\"!",
    timestamp: new Date().toISOString(),
  },
];
