import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Maximize } from 'lucide-react';
import { DestinationMarker } from './DestinationMarker';
import { FlightArc } from './FlightArc';
import { getCheapestFlight } from '../data/flights';
import type { Destination, MapDisplayState, AirportRef } from '../types/travel';

interface MapProps {
  destinations: Destination[];
  mapDisplayState: MapDisplayState;
  onSelectDestination: (dest: Destination) => void;
  onCountryClick: (country: string | null) => void;
  selectedCountry: string | null;
  userOrigin: AirportRef | null;
}

const CountryPath = React.memo(({
  feature,
  pathGenerator,
  isSelected,
  k,
  onClick,
}: {
  feature: any;
  pathGenerator: any;
  isSelected: boolean;
  k: number;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const countryName = feature?.properties?.name;
  if (!countryName) return null;

  return (
    <path
      d={pathGenerator(feature) || ''}
      className="country transition-colors duration-200"
      fill={isSelected ? '#BFDBFE' : '#F1F5F9'}
      stroke={isSelected ? '#3B82F6' : '#CBD5E1'}
      strokeWidth={isSelected ? 1 / k : 0.4 / k}
      style={{ vectorEffect: 'non-scaling-stroke', cursor: 'pointer' }}
      onMouseEnter={(e) => {
        (e.target as SVGPathElement).style.fill = isSelected ? '#BFDBFE' : '#E2E8F0';
      }}
      onMouseLeave={(e) => {
        (e.target as SVGPathElement).style.fill = isSelected ? '#BFDBFE' : '#F1F5F9';
      }}
      onClick={onClick}
    />
  );
});

export const Map = React.memo(({
  destinations,
  mapDisplayState,
  onSelectDestination,
  onCountryClick,
  selectedCountry,
  userOrigin,
}: MapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [currentTransform, setCurrentTransform] = React.useState(d3.zoomIdentity);
  const [isValidated, setIsValidated] = React.useState(false);
  const [countryFeatures, setCountryFeatures] = React.useState<any[]>([]);

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Stable Projection
  const projection = useMemo(() => {
    return d3.geoMercator()
      .scale(1000 / (2 * Math.PI))
      .translate([0, 0])
      .precision(0.1);
  }, []);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Initialize SVG and Zoom
  useEffect(() => {
    if (!svgRef.current || !projection || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 40])
      .on('zoom', (event) => {
        setCurrentTransform(event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom as any);

    // Center on the user's origin if available, otherwise on the world
    const focusCoords: [number, number] = userOrigin
      ? [userOrigin.longitude, userOrigin.latitude]
      : [0, 20];
    const [fx, fy] = projection(focusCoords) || [0, 0];

    const initialScale = dimensions.width / 800;
    const tx = dimensions.width / 2 - fx * initialScale;
    const ty = dimensions.height / 2 - fy * initialScale;

    const initialTransform = d3.zoomIdentity
      .translate(tx, ty)
      .scale(initialScale);

    svg.call(zoom.transform, initialTransform);
    setCurrentTransform(initialTransform);
    setIsValidated(true);
  }, [projection, dimensions.width, dimensions.height, userOrigin]);

  // Load map data
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json', { signal: controller.signal })
      .then(res => res.json())
      .then((data: any) => {
        const countries = topojson.feature(data, data.objects.countries) as any;
        setCountryFeatures(countries.features);
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error('Failed to load map data:', err);
      });
    return () => controller.abort();
  }, []);

  // Handle zoom to target from chat actions
  useEffect(() => {
    if (!mapDisplayState.zoomTarget || !svgRef.current || !zoomRef.current || !projection || !containerRef.current) return;

    const { lat, lng, zoom: zoomLevel } = mapDisplayState.zoomTarget;
    const [x, y] = projection([lng, lat]) || [0, 0];
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    d3.select(svgRef.current)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .call(
        zoomRef.current!.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(zoomLevel)
          .translate(-x, -y)
      );
  }, [mapDisplayState.zoomTarget, projection]);

  // Handle country focus zoom
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current || !projection || !containerRef.current || countryFeatures.length === 0) return;

    if (selectedCountry) {
      const country = countryFeatures.find((f: any) => f?.properties?.name === selectedCountry);
      if (country) {
        const path = d3.geoPath().projection(projection);
        const bounds = path.bounds(country);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = (bounds[0][0] + bounds[1][0]) / 2;
        const y = (bounds[0][1] + bounds[1][1]) / 2;
        const width = containerRef.current!.clientWidth;
        const height = containerRef.current!.clientHeight;
        const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));

        d3.select(svgRef.current)
          .transition()
          .duration(1000)
          .call(
            zoomRef.current!.transform,
            d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(scale)
              .translate(-x, -y)
          );
      }
    }
  }, [selectedCountry, projection, countryFeatures]);

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    if (direction === 'reset') {
      const focusCoords: [number, number] = userOrigin
        ? [userOrigin.longitude, userOrigin.latitude]
        : [0, 20];
      const [fx, fy] = projection(focusCoords) || [0, 0];
      const initialScale = dimensions.width / 800;
      const tx = dimensions.width / 2 - fx * initialScale;
      const ty = dimensions.height / 2 - fy * initialScale;
      svg.transition().duration(750).call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(tx, ty).scale(initialScale)
      );
    } else {
      const factor = direction === 'in' ? 1.5 : 0.66;
      svg.transition().duration(300).call(zoomRef.current.scaleBy, factor);
    }
  };

  // Compute screen positions for the origin marker
  const originScreenPos = useMemo(() => {
    if (!userOrigin || !projection) return null;
    const coords = projection([userOrigin.longitude, userOrigin.latitude]);
    if (!coords) return null;
    return {
      x: coords[0] * currentTransform.k + currentTransform.x,
      y: coords[1] * currentTransform.k + currentTransform.y,
    };
  }, [userOrigin, projection, currentTransform]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-ocean overflow-hidden">
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing">
        <g transform={currentTransform.toString()}>
          {/* Ocean */}
          <rect width={10000} height={10000} x={-5000} y={-5000} fill="#E0F2FE" onClick={() => onCountryClick(null)} />

          {/* Countries */}
          <g className="countries-group">
            {countryFeatures.map((feature, i) => (
              <CountryPath
                key={feature.id ? `country-${feature.id}-${i}` : `country-${i}`}
                feature={feature}
                pathGenerator={pathGenerator}
                isSelected={feature?.properties?.name === selectedCountry}
                k={currentTransform.k}
                onClick={(e) => {
                  e.stopPropagation();
                  const name = feature?.properties?.name;
                  if (name) onCountryClick(name === selectedCountry ? null : name);
                }}
              />
            ))}
          </g>
        </g>
      </svg>

      {/* Flight Arcs Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <svg className="w-full h-full">
          <AnimatePresence>
            {mapDisplayState.activeFlightRoutes.map((route) => (
              <FlightArc
                key={route.id}
                route={route}
                projection={projection}
                transform={{ x: currentTransform.x, y: currentTransform.y, k: currentTransform.k }}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>

      {/* Origin Marker */}
      {originScreenPos && userOrigin && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: originScreenPos.x,
            top: originScreenPos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
            <div className="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping" />
            <span
              className="absolute top-5 whitespace-nowrap text-xs font-semibold text-primary-dark bg-white/80 px-1.5 py-0.5 rounded shadow-sm"
            >
              {userOrigin.code}
            </span>
          </div>
        </div>
      )}

      {/* Destination Markers */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence>
          {projection && isValidated && destinations.map((dest) => {
            const coords = projection([dest.longitude, dest.latitude]);
            if (!coords) return null;
            const x = coords[0] * currentTransform.k + currentTransform.x;
            const y = coords[1] * currentTransform.k + currentTransform.y;

            // Only render if within viewport (with margin)
            if (x < -50 || x > dimensions.width + 50 || y < -50 || y > dimensions.height + 50) return null;

            const isHighlighted = mapDisplayState.highlightedDestinations.includes(dest.id);
            const cheapest = userOrigin ? getCheapestFlight(userOrigin.code, dest.city) : undefined;

            return (
              <DestinationMarker
                key={dest.id}
                destination={dest}
                x={x}
                y={y}
                isHighlighted={isHighlighted}
                isSelected={false}
                cheapestPrice={isHighlighted ? cheapest?.price : undefined}
                onSelect={onSelectDestination}
                scale={currentTransform.k}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-32 right-6 flex flex-col gap-2 z-40">
        <button
          onClick={() => handleZoom('in')}
          className="w-9 h-9 bg-white border border-border rounded-lg shadow-sm flex items-center justify-center text-text-secondary hover:bg-surface-alt transition-colors"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="w-9 h-9 bg-white border border-border rounded-lg shadow-sm flex items-center justify-center text-text-secondary hover:bg-surface-alt transition-colors"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => handleZoom('reset')}
          className="w-9 h-9 bg-white border border-border rounded-lg shadow-sm flex items-center justify-center text-text-secondary hover:bg-surface-alt transition-colors mt-1"
          title="Reset View"
        >
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
});
