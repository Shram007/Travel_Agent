import { memo } from 'react';
import type { QuestionOption } from '../types/travel';

interface BudgetSliderProps {
  min: number;
  max: number;
  step: number;
  prefix: string;
  presets: QuestionOption[];
  value: number;
  onChange: (value: number) => void;
}

const presetValues: Record<string, number> = {
  'budget': 750,
  'moderate': 2000,
  'comfortable': 4000,
  'luxury': 7500,
};

export const BudgetSlider = memo(function BudgetSlider({
  min,
  max,
  step,
  prefix,
  presets,
  value,
  onChange,
}: BudgetSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const formatValue = (v: number) => {
    return `${prefix}${v.toLocaleString()}`;
  };

  const getActivePreset = () => {
    for (const preset of presets) {
      const pv = presetValues[preset.id] ?? 0;
      if (Math.abs(value - pv) < step * 2) return preset.id;
    }
    return null;
  };

  const activePreset = getActivePreset();

  return (
    <div className="w-full space-y-5 py-3">
      {/* Large value display */}
      <div className="text-center">
        <span className="text-3xl font-display font-bold text-text">
          {formatValue(value)}
        </span>
        <p className="text-xs text-text-secondary mt-1">per person</p>
      </div>

      {/* Slider track */}
      <div className="px-1">
        <div className="relative h-8 flex items-center">
          <div className="absolute w-full h-1.5 rounded-full bg-surface-alt" />
          <div
            className="absolute h-1.5 rounded-full bg-primary"
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer slider-input z-10"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-text-secondary">{formatValue(min)}</span>
          <span className="text-[11px] text-text-secondary">{formatValue(max)}</span>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onChange(presetValues[preset.id] ?? min)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors duration-150 border
              ${activePreset === preset.id
                ? 'bg-primary/8 border-primary/25 text-primary'
                : 'bg-white border-border text-text-secondary hover:bg-surface-alt'
              }`}
          >
            <div className="font-medium">{preset.label}</div>
            {preset.sublabel && (
              <div className="text-[10px] opacity-60 mt-0.5">{preset.sublabel}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
});
