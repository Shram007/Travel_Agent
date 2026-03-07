import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plane, Hotel, MapPin, ChevronRight, Check, Calendar, DollarSign, Clock, Wallet, Heart, Sparkles } from 'lucide-react';
import type { TripPlan, TripSegment, TripSummary } from '../types/travel';

interface TripPlanPanelProps {
  plan: TripPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptPlan: () => void;
}

function SummarySection({ summary }: { summary: TripSummary }) {
  return (
    <div className="px-5 py-4 border-b border-border">
      <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Sparkles size={12} />
        Trip Summary
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 rounded-md bg-surface-alt">
          <MapPin size={14} className="text-primary flex-shrink-0" />
          <span className="text-xs font-medium text-text truncate">{summary.destination}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-md bg-surface-alt">
          <Clock size={14} className="text-primary flex-shrink-0" />
          <span className="text-xs font-medium text-text truncate">{summary.duration}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-md bg-surface-alt">
          <Wallet size={14} className="text-success flex-shrink-0" />
          <span className="text-xs font-medium text-text truncate">{summary.budget}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-md bg-surface-alt">
          <Heart size={14} className="text-accent flex-shrink-0" />
          <span className="text-xs font-medium text-text truncate">{summary.travelStyle}</span>
        </div>
      </div>
      {summary.preferences.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {summary.preferences.map((pref, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-primary/8 text-primary text-[11px] font-medium">
              {pref}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface SegmentCardProps {
  segment: TripSegment;
  index: number;
}

function SegmentCard({ segment, index }: SegmentCardProps) {
  const iconMap = {
    flight: <Plane size={15} className="text-primary" />,
    stay: <Hotel size={15} className="text-success" />,
    activity: <MapPin size={15} className="text-accent" />,
  };

  const bgMap = {
    flight: 'bg-primary/5 border-border',
    stay: 'bg-success/5 border-border',
    activity: 'bg-accent/5 border-border',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-lg border p-3 ${bgMap[segment.type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center border border-border flex-shrink-0">
          {iconMap[segment.type]}
        </div>
        <div className="flex-1 min-w-0">
          {segment.type === 'flight' && segment.flight && (
            <>
              <div className="text-sm font-medium text-text">
                {segment.flight.origin.city} → {segment.flight.destination.city}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {segment.flight.airline} · {Math.floor(segment.flight.durationMinutes / 60)}h {segment.flight.durationMinutes % 60}m
                {segment.flight.stops === 0 ? ' · Direct' : ` · ${segment.flight.stops} stop`}
              </div>
            </>
          )}
          {segment.type === 'stay' && segment.stay && (
            <>
              <div className="text-sm font-medium text-text">{segment.stay.hotelName}</div>
              <div className="text-xs text-text-secondary mt-0.5">
                {segment.stay.nights} nights · ${segment.stay.nightlyRate}/night · {'★'.repeat(Math.round(segment.stay.rating))}
              </div>
            </>
          )}
          {segment.type === 'activity' && segment.activity && (
            <>
              <div className="text-sm font-medium text-text">{segment.activity.name}</div>
              <div className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                {segment.activity.description}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {segment.activity.duration}
              </div>
            </>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Calendar size={10} />
              <span>{new Date(segment.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="text-sm font-semibold text-text">${segment.estimatedCost}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SegmentGroup({ title, segments, startIndex }: { title: string; segments: TripSegment[]; startIndex: number }) {
  if (segments.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-1">{title}</h4>
      {segments.map((segment, i) => (
        <div key={segment.id}>
          <SegmentCard segment={segment} index={startIndex + i} />
        </div>
      ))}
    </div>
  );
}

export function TripPlanPanel({ plan, isOpen, onClose, onAcceptPlan }: TripPlanPanelProps) {
  const flightSegments = plan?.segments.filter(s => s.type === 'flight') ?? [];
  const staySegments = plan?.segments.filter(s => s.type === 'stay') ?? [];
  const activitySegments = plan?.segments.filter(s => s.type === 'activity') ?? [];

  return (
    <AnimatePresence>
      {isOpen && plan && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
          className="absolute top-14 right-0 bottom-0 w-[400px] max-w-[90vw] z-50 bg-white border-l border-border flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-text">{plan.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    plan.status === 'proposed' ? 'bg-primary/10 text-primary' :
                    plan.status === 'accepted' ? 'bg-success/10 text-success' :
                    'bg-surface-alt text-text-secondary'
                  }`}>
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {plan.segments.length} segments
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md flex items-center justify-center text-text-secondary hover:bg-surface-alt transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Total Cost */}
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-md bg-surface-alt">
              <DollarSign size={16} className="text-success" />
              <span className="text-sm text-text-secondary">Estimated Total</span>
              <span className="ml-auto font-display font-bold text-xl text-text">
                ${plan.totalEstimatedCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Trip Summary */}
          {plan.summary && <SummarySection summary={plan.summary} />}

          {/* Grouped Segments */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            <SegmentGroup title="Flights" segments={flightSegments} startIndex={0} />
            <SegmentGroup title="Stays" segments={staySegments} startIndex={flightSegments.length} />
            <SegmentGroup title="Activities & Services" segments={activitySegments} startIndex={flightSegments.length + staySegments.length} />
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border">
            {plan.status === 'accepted' ? (
              <button
                disabled
                className="w-full py-2.5 rounded-lg bg-success/10 text-success font-medium text-sm flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Plan Accepted — Booking Coming Soon
              </button>
            ) : (
              <button
                onClick={onAcceptPlan}
                className="w-full py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Accept Plan
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
