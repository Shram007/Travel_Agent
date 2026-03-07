import { Globe, User } from 'lucide-react';
import type { UserPreferences } from '../types/travel';

interface TopBarProps {
  user: UserPreferences;
}

export function TopBar({ user }: TopBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 h-14 z-30 bg-white border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Globe size={18} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg text-text tracking-tight">Wanderlust</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-secondary">
          Flying from <span className="font-semibold text-text">{user.homeAirport.code}</span>
        </span>
        <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center">
          <User size={16} className="text-text-secondary" />
        </div>
        <span className="text-sm font-medium text-text">{user.name}</span>
      </div>
    </div>
  );
}
