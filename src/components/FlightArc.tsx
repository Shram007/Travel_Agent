import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import type { FlightRoute } from '../types/travel';

interface FlightArcProps {
  route: FlightRoute;
  projection: (coords: [number, number]) => [number, number] | null;
  transform: { x: number; y: number; k: number };
}

export const FlightArc = memo(function FlightArc({ route, projection, transform }: FlightArcProps) {
  const pathData = useMemo(() => {
    const from = projection([route.from.longitude, route.from.latitude]);
    const to = projection([route.to.longitude, route.to.latitude]);
    if (!from || !to) return null;

    const [x1, y1] = [from[0] * transform.k + transform.x, from[1] * transform.k + transform.y];
    const [x2, y2] = [to[0] * transform.k + transform.x, to[1] * transform.k + transform.y];

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curvature = Math.min(dist * 0.3, 150);

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    const nx = -dy / dist;
    const ny = dx / dist;

    const cx = mx + nx * curvature;
    const cy = my + ny * curvature;

    return {
      path: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`,
      labelX: (x1 + 2 * cx + x2) / 4,
      labelY: (y1 + 2 * cy + y2) / 4,
      x1, y1, x2, y2,
    };
  }, [route, projection, transform]);

  if (!pathData) return null;

  const isDeal = route.dealTag === 'cheapest' || route.dealTag === 'best_value';
  const strokeColor = isDeal ? '#F97316' : '#3B82F6';

  return (
    <g>
      <motion.path
        d={pathData.path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="1000"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        opacity={0.8}
        className={isDeal ? 'flight-arc-glow' : ''}
      />
      <motion.path
        d={pathData.path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.1}
      />
      {/* Price label */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <rect
          x={pathData.labelX - 24}
          y={pathData.labelY - 10}
          width={48}
          height={20}
          rx={10}
          fill={strokeColor}
          opacity={0.95}
        />
        <text
          x={pathData.labelX}
          y={pathData.labelY + 4}
          textAnchor="middle"
          fill="white"
          fontSize={11}
          fontWeight={600}
          fontFamily="Inter, system-ui, sans-serif"
        >
          ${route.price}
        </text>
      </motion.g>
    </g>
  );
});
