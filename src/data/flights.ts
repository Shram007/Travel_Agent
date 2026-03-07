import type { AirportRef, Flight } from '../types/travel';

export const airports: Record<string, AirportRef> = {
  SFO: { code: 'SFO', city: 'San Francisco', country: 'US', latitude: 37.6213, longitude: -122.379 },
  JFK: { code: 'JFK', city: 'New York', country: 'US', latitude: 40.6413, longitude: -73.7781 },
  LAX: { code: 'LAX', city: 'Los Angeles', country: 'US', latitude: 33.9425, longitude: -118.4081 },
};

export const flights: Flight[] = [
  // SFO → Asia
  { id: 'flt-sfo-nrt-1', origin: airports.SFO, destination: { code: 'NRT', city: 'Tokyo', country: 'JP', latitude: 35.772, longitude: 140.3929 }, airline: 'United', price: 487, currency: 'USD', departureDate: '2026-07-15', returnDate: '2026-07-29', durationMinutes: 660, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-sfo-nrt-2', origin: airports.SFO, destination: { code: 'NRT', city: 'Tokyo', country: 'JP', latitude: 35.772, longitude: 140.3929 }, airline: 'ANA', price: 612, currency: 'USD', departureDate: '2026-07-15', returnDate: '2026-07-29', durationMinutes: 640, stops: 0, cabinClass: 'economy', dealTag: 'fastest' },
  { id: 'flt-sfo-bkk-1', origin: airports.SFO, destination: { code: 'BKK', city: 'Bangkok', country: 'TH', latitude: 13.6900, longitude: 100.7501 }, airline: 'EVA Air', price: 445, currency: 'USD', departureDate: '2026-07-10', returnDate: '2026-07-24', durationMinutes: 1050, stops: 1, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-sfo-dps-1', origin: airports.SFO, destination: { code: 'DPS', city: 'Bali', country: 'ID', latitude: -8.7482, longitude: 115.1675 }, airline: 'Cathay Pacific', price: 520, currency: 'USD', departureDate: '2026-07-12', returnDate: '2026-07-26', durationMinutes: 1140, stops: 1, cabinClass: 'economy', dealTag: 'best_value' },
  { id: 'flt-sfo-icn-1', origin: airports.SFO, destination: { code: 'ICN', city: 'Seoul', country: 'KR', latitude: 37.4602, longitude: 126.4407 }, airline: 'Korean Air', price: 498, currency: 'USD', departureDate: '2026-07-20', returnDate: '2026-08-03', durationMinutes: 680, stops: 0, cabinClass: 'economy', dealTag: 'best_value' },
  { id: 'flt-sfo-kix-1', origin: airports.SFO, destination: { code: 'KIX', city: 'Kyoto', country: 'JP', latitude: 34.4347, longitude: 135.244 }, airline: 'Japan Airlines', price: 530, currency: 'USD', departureDate: '2026-07-15', returnDate: '2026-07-29', durationMinutes: 720, stops: 1, cabinClass: 'economy' },
  { id: 'flt-sfo-mle-1', origin: airports.SFO, destination: { code: 'MLE', city: 'Malé', country: 'MV', latitude: 4.1918, longitude: 73.5290 }, airline: 'Emirates', price: 890, currency: 'USD', departureDate: '2026-07-05', returnDate: '2026-07-15', durationMinutes: 1320, stops: 1, cabinClass: 'economy' },

  // SFO → Europe
  { id: 'flt-sfo-lis-1', origin: airports.SFO, destination: { code: 'LIS', city: 'Lisbon', country: 'PT', latitude: 38.7813, longitude: -9.1359 }, airline: 'TAP Air', price: 389, currency: 'USD', departureDate: '2026-07-08', returnDate: '2026-07-22', durationMinutes: 660, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-sfo-cdg-1', origin: airports.SFO, destination: { code: 'CDG', city: 'Paris', country: 'FR', latitude: 49.0097, longitude: 2.5479 }, airline: 'Air France', price: 542, currency: 'USD', departureDate: '2026-07-10', returnDate: '2026-07-24', durationMinutes: 660, stops: 0, cabinClass: 'economy', dealTag: 'best_value' },
  { id: 'flt-sfo-fco-1', origin: airports.SFO, destination: { code: 'FCO', city: 'Rome', country: 'IT', latitude: 41.8003, longitude: 12.2389 }, airline: 'Lufthansa', price: 498, currency: 'USD', departureDate: '2026-07-12', returnDate: '2026-07-26', durationMinutes: 780, stops: 1, cabinClass: 'economy' },
  { id: 'flt-sfo-bcn-1', origin: airports.SFO, destination: { code: 'BCN', city: 'Barcelona', country: 'ES', latitude: 41.2974, longitude: 2.0833 }, airline: 'Level', price: 420, currency: 'USD', departureDate: '2026-07-05', returnDate: '2026-07-19', durationMinutes: 700, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-sfo-lhr-1', origin: airports.SFO, destination: { code: 'LHR', city: 'London', country: 'GB', latitude: 51.4700, longitude: -0.4543 }, airline: 'British Airways', price: 560, currency: 'USD', departureDate: '2026-07-15', returnDate: '2026-07-29', durationMinutes: 620, stops: 0, cabinClass: 'economy' },
  { id: 'flt-sfo-ams-1', origin: airports.SFO, destination: { code: 'AMS', city: 'Amsterdam', country: 'NL', latitude: 52.3105, longitude: 4.7683 }, airline: 'KLM', price: 475, currency: 'USD', departureDate: '2026-07-10', returnDate: '2026-07-24', durationMinutes: 640, stops: 0, cabinClass: 'economy', dealTag: 'best_value' },
  { id: 'flt-sfo-jtr-1', origin: airports.SFO, destination: { code: 'JTR', city: 'Santorini', country: 'GR', latitude: 36.3992, longitude: 25.4793 }, airline: 'Aegean', price: 680, currency: 'USD', departureDate: '2026-07-08', returnDate: '2026-07-18', durationMinutes: 960, stops: 1, cabinClass: 'economy' },
  { id: 'flt-sfo-kef-1', origin: airports.SFO, destination: { code: 'KEF', city: 'Reykjavík', country: 'IS', latitude: 63.985, longitude: -22.6056 }, airline: 'Icelandair', price: 410, currency: 'USD', departureDate: '2026-07-01', returnDate: '2026-07-10', durationMinutes: 480, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },

  // SFO → Americas
  { id: 'flt-sfo-cun-1', origin: airports.SFO, destination: { code: 'CUN', city: 'Cancún', country: 'MX', latitude: 21.0366, longitude: -86.877 }, airline: 'Volaris', price: 245, currency: 'USD', departureDate: '2026-07-10', returnDate: '2026-07-17', durationMinutes: 330, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-sfo-mex-1', origin: airports.SFO, destination: { code: 'MEX', city: 'Mexico City', country: 'MX', latitude: 19.4361, longitude: -99.0719 }, airline: 'Aeromexico', price: 278, currency: 'USD', departureDate: '2026-07-15', returnDate: '2026-07-22', durationMinutes: 280, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-sfo-sjo-1', origin: airports.SFO, destination: { code: 'SJO', city: 'San José', country: 'CR', latitude: 9.9939, longitude: -84.2088 }, airline: 'Alaska Airlines', price: 340, currency: 'USD', departureDate: '2026-07-08', returnDate: '2026-07-18', durationMinutes: 380, stops: 0, cabinClass: 'economy', dealTag: 'best_value' },
  { id: 'flt-sfo-eze-1', origin: airports.SFO, destination: { code: 'EZE', city: 'Buenos Aires', country: 'AR', latitude: -34.8222, longitude: -58.5358 }, airline: 'LATAM', price: 620, currency: 'USD', departureDate: '2026-07-20', returnDate: '2026-08-03', durationMinutes: 900, stops: 1, cabinClass: 'economy' },
  { id: 'flt-sfo-hav-1', origin: airports.SFO, destination: { code: 'HAV', city: 'Havana', country: 'CU', latitude: 22.9892, longitude: -82.4091 }, airline: 'Southwest', price: 310, currency: 'USD', departureDate: '2026-07-12', returnDate: '2026-07-19', durationMinutes: 360, stops: 1, cabinClass: 'economy', dealTag: 'cheapest' },

  // SFO → Africa / Middle East
  { id: 'flt-sfo-rak-1', origin: airports.SFO, destination: { code: 'RAK', city: 'Marrakech', country: 'MA', latitude: 31.6069, longitude: -8.0363 }, airline: 'Royal Air Maroc', price: 520, currency: 'USD', departureDate: '2026-07-05', returnDate: '2026-07-15', durationMinutes: 900, stops: 1, cabinClass: 'economy', dealTag: 'best_value' },
  { id: 'flt-sfo-cpt-1', origin: airports.SFO, destination: { code: 'CPT', city: 'Cape Town', country: 'ZA', latitude: -33.9649, longitude: 18.6017 }, airline: 'Qatar Airways', price: 780, currency: 'USD', departureDate: '2026-07-15', returnDate: '2026-07-29', durationMinutes: 1260, stops: 1, cabinClass: 'economy' },
  { id: 'flt-sfo-dxb-1', origin: airports.SFO, destination: { code: 'DXB', city: 'Dubai', country: 'AE', latitude: 25.2532, longitude: 55.3657 }, airline: 'Emirates', price: 650, currency: 'USD', departureDate: '2026-07-10', returnDate: '2026-07-20', durationMinutes: 960, stops: 0, cabinClass: 'economy', dealTag: 'best_value' },
  { id: 'flt-sfo-amm-1', origin: airports.SFO, destination: { code: 'AMM', city: 'Amman', country: 'JO', latitude: 31.7225, longitude: 35.9933 }, airline: 'Royal Jordanian', price: 590, currency: 'USD', departureDate: '2026-07-08', returnDate: '2026-07-18', durationMinutes: 1020, stops: 1, cabinClass: 'economy' },

  // SFO → Oceania
  { id: 'flt-sfo-syd-1', origin: airports.SFO, destination: { code: 'SYD', city: 'Sydney', country: 'AU', latitude: -33.9461, longitude: 151.1772 }, airline: 'Qantas', price: 720, currency: 'USD', departureDate: '2026-07-20', returnDate: '2026-08-05', durationMinutes: 900, stops: 0, cabinClass: 'economy' },

  // JFK → Select destinations
  { id: 'flt-jfk-cdg-1', origin: airports.JFK, destination: { code: 'CDG', city: 'Paris', country: 'FR', latitude: 49.0097, longitude: 2.5479 }, airline: 'Delta', price: 420, currency: 'USD', departureDate: '2026-07-10', returnDate: '2026-07-24', durationMinutes: 450, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-jfk-lhr-1', origin: airports.JFK, destination: { code: 'LHR', city: 'London', country: 'GB', latitude: 51.4700, longitude: -0.4543 }, airline: 'JetBlue', price: 380, currency: 'USD', departureDate: '2026-07-15', returnDate: '2026-07-29', durationMinutes: 420, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-jfk-lis-1', origin: airports.JFK, destination: { code: 'LIS', city: 'Lisbon', country: 'PT', latitude: 38.7813, longitude: -9.1359 }, airline: 'TAP Air', price: 350, currency: 'USD', departureDate: '2026-07-08', returnDate: '2026-07-22', durationMinutes: 420, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
  { id: 'flt-jfk-cun-1', origin: airports.JFK, destination: { code: 'CUN', city: 'Cancún', country: 'MX', latitude: 21.0366, longitude: -86.877 }, airline: 'JetBlue', price: 210, currency: 'USD', departureDate: '2026-07-10', returnDate: '2026-07-17', durationMinutes: 240, stops: 0, cabinClass: 'economy', dealTag: 'cheapest' },
];

export function getFlightsFromOrigin(originCode: string): Flight[] {
  return flights.filter(f => f.origin.code === originCode);
}

export function getCheapestFlight(originCode: string, destinationCity: string): Flight | undefined {
  return flights
    .filter(f => f.origin.code === originCode && f.destination.city === destinationCity)
    .sort((a, b) => a.price - b.price)[0];
}
