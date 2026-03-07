import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, MapDisplayState, TripPlan, UserPreferences, FlightRoute, ChatAction, QuestionnaireAnswers } from '../types/travel';
import { chatScripts, welcomeMessages } from '../data/chatScripts';
import { flights } from '../data/flights';
import { destinations } from '../data/destinations';
import { buildTripPlanFromAnswers } from '../data/questionnaireData';

const initialMapState: MapDisplayState = {
  highlightedDestinations: [],
  activeFlightRoutes: [],
  originMarker: null,
  zoomTarget: null,
};

export function useChatEngine(userPreferences: UserPreferences) {
  const [messages, setMessages] = useState<ChatMessage[]>(welcomeMessages);
  const [mapDisplayState, setMapDisplayState] = useState<MapDisplayState>(initialMapState);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const msgCounter = useRef(0);
  const triggerTextRef = useRef('');

  const processActions = useCallback((actions: ChatAction[]) => {
    for (const action of actions) {
      switch (action.type) {
        case 'highlight_destinations':
          setMapDisplayState(prev => ({
            ...prev,
            highlightedDestinations: action.destinationIds,
          }));
          break;

        case 'show_flights': {
          const origin = userPreferences.homeAirport;
          const routes: FlightRoute[] = [];
          for (const destId of action.destinationIds) {
            const dest = destinations.find(d => d.id === destId);
            if (!dest) continue;
            const matchingFlight = flights.find(
              f => f.origin.code === origin.code && f.destination.city === dest.city
            );
            if (matchingFlight) {
              routes.push({
                id: `route-${matchingFlight.id}`,
                from: { latitude: origin.latitude, longitude: origin.longitude, label: origin.code },
                to: { latitude: dest.latitude, longitude: dest.longitude, label: dest.city },
                price: matchingFlight.price,
                dealTag: matchingFlight.dealTag,
              });
            }
          }
          setMapDisplayState(prev => ({
            ...prev,
            activeFlightRoutes: routes,
          }));
          break;
        }

        case 'zoom_to':
          setMapDisplayState(prev => ({
            ...prev,
            zoomTarget: { lat: action.latitude, lng: action.longitude, zoom: action.zoomLevel },
          }));
          break;

        case 'update_trip_plan':
          setTripPlan(action.plan);
          break;

        case 'open_trip_panel':
          // Handled in App.tsx by watching tripPlan changes
          break;

        case 'ask_clarification':
          setQuickReplies(action.options);
          break;

        case 'open_questionnaire':
          setIsQuestionnaireOpen(true);
          break;
      }
    }
  }, [userPreferences.homeAirport]);

  const sendMessage = useCallback((text: string) => {
    // Clear quick replies
    setQuickReplies([]);

    // Store trigger text for questionnaire
    triggerTextRef.current = text;

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${++msgCounter.current}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Find matching script
    const script = chatScripts.find(s =>
      s.triggers.some(t => t.test(text))
    );
    if (!script) return;

    setIsTyping(true);

    // Process responses sequentially with delays
    let totalDelay = 0;
    script.responses.forEach((response, index) => {
      const delay = response.delay || 800;
      totalDelay += delay;

      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `msg-${++msgCounter.current}`,
          role: 'assistant',
          content: response.content,
          timestamp: new Date().toISOString(),
          actions: response.actions,
        };
        setMessages(prev => [...prev, assistantMsg]);

        // Process actions (highlights, flights, zoom, questionnaire, etc.)
        if (response.actions) {
          processActions(response.actions);
        }

        // Clear typing after last response
        if (index === script.responses.length - 1) {
          setIsTyping(false);
        }
      }, totalDelay);
    });
  }, [processActions]);

  const closeQuestionnaire = useCallback(() => {
    setIsQuestionnaireOpen(false);
  }, []);

  const completeQuestionnaire = useCallback((answers: QuestionnaireAnswers) => {
    setIsQuestionnaireOpen(false);

    // Build trip plan from answers
    const plan = buildTripPlanFromAnswers(answers, triggerTextRef.current);
    setTripPlan(plan);

    // Add assistant message
    const msg: ChatMessage = {
      id: `msg-${++msgCounter.current}`,
      role: 'assistant',
      content: `Great choices! I've put together a personalized ${plan.title} trip plan for you based on your preferences. Check out the details! 🎉`,
      timestamp: new Date().toISOString(),
      actions: [
        { type: 'open_trip_panel' },
        { type: 'highlight_destinations', destinationIds: plan.segments.map(s => s.destination.id) },
        { type: 'show_flights', originCode: 'SFO', destinationIds: plan.segments.filter(s => s.type === 'flight').map(s => s.destination.id) },
      ],
    };
    setMessages(prev => [...prev, msg]);

    // Process the visual actions
    if (msg.actions) {
      processActions(msg.actions);
    }
  }, [processActions]);

  return {
    messages,
    sendMessage,
    mapDisplayState,
    tripPlan,
    setTripPlan,
    quickReplies,
    isTyping,
    isQuestionnaireOpen,
    closeQuestionnaire,
    completeQuestionnaire,
  };
}
