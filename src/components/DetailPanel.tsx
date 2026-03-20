/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, ChevronRight } from 'lucide-react';
import { Landmark } from '../data/landmarks';

interface ArchitecturalMetadata {
  location: {
    country: string;
    cityRegion: string;
    geographicRegion: string;
  };
  period: {
    yearBuilt: string;
    era: string;
  };
  influences: {
    styles: string[];
    influences: string[];
    traditions: string[];
  };
  purpose: {
    function: string;
    patron: string;
    intent: string;
  };
  significance: {
    importance: string;
    innovations: string;
    influence: string;
  };
}

interface DetailPanelProps {
  landmark: Landmark | null;
  onClose: () => void;
  onNext: () => void;
  currentIndex: number;
  totalInSequence: number;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ 
  landmark, 
  onClose,
  onNext,
  currentIndex,
  totalInSequence
}) => {
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ArchitecturalMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (landmark) {
      generateContent();
    } else {
      setBlueprintUrl(null);
      setMetadata(null);
      setError(null);
    }
  }, [landmark]);

  const generateContent = async () => {
    if (!landmark) return;

    setIsLoading(true);
    setError(null);
    setBlueprintUrl(null);
    setMetadata(null);

    try {
      const response = await fetch('/api/landmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: landmark.name,
          region: landmark.region,
          constructionYear: String(landmark.construction_year_start),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setBlueprintUrl(`data:${data.mimeType};base64,${data.imageBase64}`);
      setMetadata(data.metadata);
    } catch (err: any) {
      console.error("Content generation error:", err);
      setError(err.message || "Failed to generate archival records.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {landmark && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] bg-charcoal text-parchment z-50 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 flex justify-between items-start border-b border-parchment/10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] bg-parchment/10 px-2 py-0.5 rounded text-parchment/60">
                  {currentIndex} / {totalInSequence}
                </span>
                <h2 className="text-3xl font-serif italic">{landmark.name}</h2>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-parchment/50">
                {landmark.region} // Built: {landmark.construction_year_start} AD
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-parchment/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Blueprint Viewport */}
            <div className="relative aspect-video bg-[#f4e4bc] rounded-lg overflow-hidden border border-charcoal/20 blueprint-grid-dark flex items-center justify-center group shadow-inner">
              {/* Decorative Archival Stamps/Corners */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-charcoal/20 pointer-events-none" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-charcoal/20 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-charcoal/20 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-charcoal/20 pointer-events-none" />
              
              {/* Circular Seal (Decorative) */}
              <div className="absolute top-6 left-6 w-8 h-8 rounded-full border border-charcoal/10 flex items-center justify-center pointer-events-none">
                <div className="w-6 h-6 rounded-full border border-charcoal/5 flex items-center justify-center">
                  <span className="font-mono text-[6px] text-charcoal/20">AAM</span>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-charcoal/40" size={48} />
                  <p className="font-mono text-[10px] uppercase tracking-widest animate-pulse text-charcoal/60">
                    Drawing Architectural Blueprint...
                  </p>
                </div>
              ) : error ? (
                <div className="p-8 text-center space-y-4">
                  <p className="text-red-600 font-mono text-xs">{error}</p>
                  <button 
                    onClick={generateContent}
                    className="px-4 py-2 bg-charcoal text-parchment font-mono text-[10px] uppercase tracking-widest rounded hover:bg-black transition-colors"
                  >
                    Retry Generation
                  </button>
                </div>
              ) : blueprintUrl ? (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={blueprintUrl} 
                  alt={`${landmark.name} 3D Axonometric`}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              ) : null}
              
              {/* Overlay Label */}
              <div className="absolute top-4 right-16 font-mono text-[8px] uppercase tracking-[0.2em] text-charcoal/30 pointer-events-none">
                Axonometric Plate // Ref. {landmark.id.toUpperCase()}
              </div>
            </div>

            {/* Historical Data & Metadata */}
            <div className="space-y-12">
              {/* Core Stats */}
              <div className="grid grid-cols-2 gap-8 border-b border-parchment/10 pb-8">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/40">Architect</span>
                  <p className="font-serif text-lg">{landmark.architect || 'Unknown'}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/40">Coordinates</span>
                  <p className="font-mono text-sm">{landmark.latitude.toFixed(4)}° N, {landmark.longitude.toFixed(4)}° E</p>
                </div>
              </div>

              {metadata ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  {/* Location & Period */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/40">Location</span>
                      <div className="font-serif text-base leading-snug">
                        <p>{metadata.location.cityRegion}, {metadata.location.country}</p>
                        <p className="text-parchment/50 italic text-sm">{metadata.location.geographicRegion}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/40">Period & Era</span>
                      <div className="font-serif text-base leading-snug">
                        <p>{metadata.period.yearBuilt}</p>
                        <p className="text-parchment/50 italic text-sm">{metadata.period.era}</p>
                      </div>
                    </div>
                  </div>

                  {/* Influences */}
                  <div className="space-y-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/40">Architectural Influences</span>
                    <div className="flex flex-wrap gap-2">
                      {metadata.influences.styles.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-parchment/5 rounded text-[10px] font-mono text-parchment/70 border border-parchment/10">{s}</span>
                      ))}
                    </div>
                    <p className="font-serif text-base text-parchment/80 leading-relaxed italic">
                      Influenced by {metadata.influences.influences.join(', ')}.
                    </p>
                  </div>

                  {/* Purpose */}
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/40">Original Purpose</span>
                    <div className="space-y-2">
                      <p className="font-serif text-lg leading-snug">{metadata.purpose.function}</p>
                      <p className="font-serif text-sm text-parchment/60 leading-relaxed">
                        Commissioned by <span className="text-parchment/80">{metadata.purpose.patron}</span>. {metadata.purpose.intent}
                      </p>
                    </div>
                  </div>

                  {/* Significance */}
                  <div className="space-y-4 p-6 bg-parchment/5 rounded-xl border border-parchment/10 border-dashed">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/40">Architectural Significance</span>
                    <div className="space-y-4">
                      <p className="font-serif text-base leading-relaxed text-parchment/90">
                        {metadata.significance.importance}
                      </p>
                      <div className="grid grid-cols-1 gap-4 text-sm italic text-parchment/70">
                        <p><span className="font-mono text-[8px] uppercase not-italic text-parchment/30 block mb-1">Innovation</span> {metadata.significance.innovations}</p>
                        <p><span className="font-mono text-[8px] uppercase not-italic text-parchment/30 block mb-1">Legacy</span> {metadata.significance.influence}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-parchment/40">Historical Context</span>
                  <p className="font-serif text-lg leading-relaxed text-parchment/80 italic">
                    "{landmark.description}"
                  </p>
                  {isLoading && (
                    <div className="flex items-center gap-2 font-mono text-[10px] text-parchment/30 animate-pulse">
                      <Loader2 size={10} className="animate-spin" />
                      <span>Retrieving scholarly records...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="pt-8 border-t border-parchment/10 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-mono text-[8px] uppercase tracking-widest text-parchment/30">Index Position</span>
                <span className="font-serif text-xl italic">{currentIndex} of {totalInSequence}</span>
              </div>
              <button 
                onClick={onNext}
                className="flex items-center gap-3 px-8 py-4 bg-parchment text-charcoal rounded-full hover:bg-white transition-all group shadow-xl"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Next Landmark</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Technical Specs (Decorative) */}
            <div className="pt-8 border-t border-parchment/10">
              <div className="grid grid-cols-3 gap-4 font-mono text-[8px] text-parchment/30 uppercase tracking-tighter">
                <div className="space-y-1">
                  <p>Scale: 1:500</p>
                  <p>Paper: Archival Vellum</p>
                </div>
                <div className="space-y-1 text-center">
                  <p>Draft ID: {landmark.id.toUpperCase()}-001</p>
                  <p>Status: Authenticated</p>
                </div>
                <div className="space-y-1 text-right">
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p>Museum: A.A.M. Global</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
