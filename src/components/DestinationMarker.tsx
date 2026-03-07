import { memo } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import type { Destination } from '../types/travel';

interface DestinationMarkerProps {
  destination: Destination;
  x: number;
  y: number;
  isHighlighted: boolean;
  isSelected: boolean;
  cheapestPrice?: number;
  onSelect: (dest: Destination) => void;
  scale: number;
}

export const DestinationMarker = memo(function DestinationMarker({
  destination,
  x,
  y,
  isHighlighted,
  isSelected,
  cheapestPrice,
  onSelect,
  scale,
}: DestinationMarkerProps) {
  const markerSize = Math.max(12, 20 / scale);
  const fontSize = Math.max(8, 11 / scale);
  const showLabel = scale > 0.8 || isHighlighted || isSelected;
  const showPrice = isHighlighted && cheapestPrice !== undefined;

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        zIndex: isSelected ? 30 : isHighlighted ? 20 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(destination);
      }}
      whileHover={{ scale: 1.15 }}
    >
      <div className="flex flex-col items-center gap-0.5">
        {showPrice && (
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-1.5 py-0.5 rounded-full text-white font-semibold whitespace-nowrap"
            style={{
              fontSize: fontSize,
              backgroundColor: destination.trendingScore && destination.trendingScore > 85 ? '#F97316' : '#3B82F6',
            }}
          >
            ${cheapestPrice}
          </motion.div>
        )}
        <div className="relative">
          <MapPin
            size={markerSize}
            className={`transition-colors duration-200 ${
              isSelected
                ? 'text-primary-dark fill-primary'
                : isHighlighted
                ? 'text-accent fill-accent/80 drop-shadow-md'
                : 'text-text-secondary fill-text-secondary/30'
            }`}
          />
          {isHighlighted && (
            <div
              className="absolute rounded-full bg-primary/30"
              style={{
                width: markerSize * 2,
                height: markerSize * 2,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'ping-ring 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
          )}
        </div>
        {showLabel && (
          <span
            className={`whitespace-nowrap font-medium leading-none ${
              isSelected ? 'text-primary-dark' : isHighlighted ? 'text-text' : 'text-text-secondary'
            }`}
            style={{ fontSize: fontSize }}
          >
            {destination.city}
          </span>
        )}
      </div>
    </motion.div>
  );
});
