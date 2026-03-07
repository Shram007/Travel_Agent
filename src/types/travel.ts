export type DestinationTag =
  | 'beach' | 'city' | 'mountain' | 'cultural' | 'adventure'
  | 'food' | 'nightlife' | 'budget' | 'luxury' | 'nature'
  | 'romantic' | 'family' | 'solo';

export interface Destination {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  region: string;
  imageUrl: string;
  description: string;
  highlights: string[];
  tags: DestinationTag[];
  averageDailyCost: number;
  bestMonths: number[];
  rating: number;
  trendingScore?: number;
}

export interface AirportRef {
  code: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Flight {
  id: string;
  origin: AirportRef;
  destination: AirportRef;
  airline: string;
  price: number;
  currency: string;
  departureDate: string;
  returnDate?: string;
  durationMinutes: number;
  stops: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  dealTag?: 'cheapest' | 'best_value' | 'fastest' | 'trending';
}

export interface StayInfo {
  hotelName: string;
  nightlyRate: number;
  nights: number;
  rating: number;
}

export interface ActivityInfo {
  name: string;
  description: string;
  duration: string;
  cost: number;
}

export interface TripSegment {
  id: string;
  type: 'flight' | 'stay' | 'activity';
  destination: Destination;
  flight?: Flight;
  stay?: StayInfo;
  activity?: ActivityInfo;
  startDate: string;
  endDate: string;
  estimatedCost: number;
}

export interface TripSummary {
  destination: string;
  dates: string;
  duration: string;
  budget: string;
  preferences: string[];
  travelStyle: string;
}

export interface TripPlan {
  id: string;
  title: string;
  status: 'draft' | 'proposed' | 'accepted' | 'booked';
  origin: AirportRef;
  segments: TripSegment[];
  totalEstimatedCost: number;
  createdAt: string;
  summary?: TripSummary;
}

export type ChatAction =
  | { type: 'highlight_destinations'; destinationIds: string[] }
  | { type: 'show_flights'; originCode: string; destinationIds: string[] }
  | { type: 'zoom_to'; latitude: number; longitude: number; zoomLevel: number }
  | { type: 'update_trip_plan'; plan: TripPlan }
  | { type: 'open_trip_panel' }
  | { type: 'ask_clarification'; options: string[] }
  | { type: 'open_questionnaire' };

// --- Questionnaire types ---

export type QuestionInputType = 'options' | 'slider' | 'multi-select';

export interface QuestionOption {
  id: string;
  label: string;
  sublabel?: string;
}

export interface QuestionDef {
  id: string;
  title: string;
  inputType: QuestionInputType;
  options: QuestionOption[];
  allowCustom: boolean;
  allowSkip: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderPrefix?: string;
}

export interface QuestionnaireAnswers {
  duration?: string;
  budget?: string;
  priorities?: string[];
  mustHaves?: string[];
  [key: string]: string | string[] | undefined;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
}

export interface UserPreferences {
  name: string;
  homeAirport: AirportRef;
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  travelStyle: DestinationTag[];
  pastDestinations: string[];
  savedDestinations: string[];
}

export interface FlightRoute {
  id: string;
  from: { latitude: number; longitude: number; label: string };
  to: { latitude: number; longitude: number; label: string };
  price: number;
  dealTag?: Flight['dealTag'];
}

export interface MapDisplayState {
  highlightedDestinations: string[];
  activeFlightRoutes: FlightRoute[];
  originMarker: AirportRef | null;
  zoomTarget: { lat: number; lng: number; zoom: number } | null;
}
