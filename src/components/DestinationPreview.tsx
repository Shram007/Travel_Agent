import { motion } from 'motion/react';
import { X, Star, MapPin, TrendingUp, Plane } from 'lucide-react';
import type { Destination, Flight } from '../types/travel';

interface DestinationPreviewProps {
  destination: Destination;
  cheapestFlight?: Flight;
  onClose: () => void;
  onChat: (text: string) => void;
}

export function DestinationPreview({ destination, cheapestFlight, onClose, onChat }: DestinationPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-35 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-border rounded-xl shadow-sm overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={destination.imageUrl}
          alt={destination.city}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
        {destination.trendingScore && destination.trendingScore > 80 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-accent/90 text-white text-xs font-semibold flex items-center gap-1">
            <TrendingUp size={10} />
            Trending
          </div>
        )}
        <div className="absolute bottom-2 left-3 text-white">
          <h3 className="font-display font-bold text-lg leading-tight">{destination.city}</h3>
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <MapPin size={10} />
            <span>{destination.country}</span>
            <span className="mx-1">·</span>
            <Star size={10} className="fill-badge text-badge" />
            <span>{destination.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{destination.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {destination.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-surface-alt text-text-secondary text-xs capitalize">
              {tag}
            </span>
          ))}
        </div>

        {/* Flight deal */}
        {cheapestFlight && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <Plane size={14} className="text-primary" />
            <div className="flex-1">
              <span className="text-xs text-text-secondary">From {cheapestFlight.origin.code}</span>
              <span className="text-xs text-text-secondary"> · {cheapestFlight.airline}</span>
            </div>
            <span className="font-display font-bold text-primary">${cheapestFlight.price}</span>
          </div>
        )}

        {/* Action */}
        <button
          onClick={() => onChat(`Plan a ${destination.city} trip`)}
          className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          Plan a Trip Here
        </button>
      </div>
    </motion.div>
  );
}
