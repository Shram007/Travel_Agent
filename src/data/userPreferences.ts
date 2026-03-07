import type { UserPreferences } from '../types/travel';
import { airports } from './flights';

export const mockUser: UserPreferences = {
  name: 'Alex',
  homeAirport: airports.SFO,
  budgetLevel: 'moderate',
  travelStyle: ['cultural', 'food', 'city'],
  pastDestinations: ['dest-paris', 'dest-tokyo'],
  savedDestinations: ['dest-rome', 'dest-bali'],
};
