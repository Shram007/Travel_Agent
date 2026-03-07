import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Map } from './components/Map';
import { TopBar } from './components/TopBar';
import { ChatPanel } from './components/ChatPanel';
import { TripPlanPanel } from './components/TripPlanPanel';
import { DestinationPreview } from './components/DestinationPreview';
import { useChatEngine } from './hooks/useChatEngine';
import { destinations } from './data/destinations';
import { mockUser } from './data/userPreferences';
import { getCheapestFlight } from './data/flights';
import type { Destination } from './types/travel';

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isTripPanelOpen, setIsTripPanelOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const {
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
  } = useChatEngine(mockUser);

  // Open trip panel when a plan is proposed
  useEffect(() => {
    if (tripPlan && tripPlan.status === 'proposed') {
      setIsTripPanelOpen(true);
    }
  }, [tripPlan]);

  // Auto-expand chat when questionnaire opens
  useEffect(() => {
    if (isQuestionnaireOpen) {
      setIsChatExpanded(true);
    }
  }, [isQuestionnaireOpen]);

  const handleAcceptPlan = () => {
    if (tripPlan) {
      setTripPlan({ ...tripPlan, status: 'accepted' });
    }
  };

  const handleDestinationSelect = (dest: Destination) => {
    setSelectedDestination(dest);
  };

  const handleChatFromPreview = (text: string) => {
    setSelectedDestination(null);
    setIsChatExpanded(true);
    setTimeout(() => sendMessage(text), 300);
  };

  const cheapestForSelected = selectedDestination
    ? getCheapestFlight(mockUser.homeAirport.code, selectedDestination.city)
    : undefined;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-surface">
      {/* Top Bar */}
      <TopBar user={mockUser} />

      {/* Full-screen Map */}
      <div className="absolute inset-0 pt-14">
        <Map
          destinations={destinations}
          mapDisplayState={mapDisplayState}
          onSelectDestination={handleDestinationSelect}
          onCountryClick={setSelectedCountry}
          selectedCountry={selectedCountry}
          userOrigin={mockUser.homeAirport}
        />
      </div>

      {/* Destination Preview Popup */}
      <AnimatePresence>
        {selectedDestination && (
          <DestinationPreview
            destination={selectedDestination}
            cheapestFlight={cheapestForSelected}
            onClose={() => setSelectedDestination(null)}
            onChat={handleChatFromPreview}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel (includes inline questionnaire) */}
      <ChatPanel
        messages={messages}
        onSendMessage={(text) => {
          setSelectedDestination(null);
          sendMessage(text);
        }}
        isExpanded={isChatExpanded}
        onToggleExpand={() => setIsChatExpanded(!isChatExpanded)}
        quickReplies={quickReplies}
        isTyping={isTyping}
        isQuestionnaireOpen={isQuestionnaireOpen}
        onQuestionnaireClose={closeQuestionnaire}
        onQuestionnaireComplete={completeQuestionnaire}
      />

      {/* Trip Plan Panel */}
      <TripPlanPanel
        plan={tripPlan}
        isOpen={isTripPanelOpen}
        onClose={() => setIsTripPanelOpen(false)}
        onAcceptPlan={handleAcceptPlan}
      />
    </div>
  );
}
