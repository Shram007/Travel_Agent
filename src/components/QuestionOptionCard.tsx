import { memo } from 'react';
import { Check, Circle } from 'lucide-react';

interface QuestionOptionCardProps {
  index: number;
  label: string;
  sublabel?: string;
  isSelected: boolean;
  onClick: () => void;
  multiSelect?: boolean;
}

export const QuestionOptionCard = memo(function QuestionOptionCard({
  index,
  label,
  sublabel,
  isSelected,
  onClick,
  multiSelect = false,
}: QuestionOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors duration-150 text-left
        ${isSelected
          ? 'bg-primary/6 border-primary/25'
          : 'bg-white border-border hover:bg-surface-alt'
        }`}
    >
      {/* Badge */}
      {multiSelect ? (
        <span className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors duration-150
          ${isSelected
            ? 'bg-primary text-white'
            : 'bg-surface-alt text-text-secondary border border-border'
          }`}>
          {isSelected ? <Check size={14} strokeWidth={2.5} /> : null}
        </span>
      ) : (
        <span className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 font-semibold text-xs transition-colors duration-150
          ${isSelected
            ? 'bg-primary text-white'
            : 'bg-surface-alt text-text-secondary'
          }`}>
          {index + 1}
        </span>
      )}

      {/* Label */}
      <div className="flex-1 min-w-0">
        <span className={`font-medium text-sm transition-colors ${isSelected ? 'text-primary' : 'text-text'}`}>
          {label}
        </span>
        {sublabel && (
          <span className="ml-2 text-xs text-text-secondary">{sublabel}</span>
        )}
      </div>
    </button>
  );
});
