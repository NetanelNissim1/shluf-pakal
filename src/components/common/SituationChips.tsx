import React from 'react';
import { Bus, Footprints, Flame, Sparkles, Star, LayoutGrid, CalendarDays, Compass, Palette } from 'lucide-react';
import { SituationFilter } from '../../types';
import { usePakalStore } from '../../store/usePakalStore';

interface ChipItem {
  id: SituationFilter;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SITUATIONS: ChipItem[] = [
  { id: 'all', label: 'הכל', icon: LayoutGrid },
  { id: 'odt', label: 'פעילויות ODT', icon: Compass },
  { id: 'visual', label: 'חידות בציורים', icon: Palette },
  { id: 'holidays', label: 'חגי ישראל', icon: CalendarDays },
  { id: 'bus', label: 'באוטובוס', icon: Bus },
  { id: 'walking', label: 'תוך כדי הליכה', icon: Footprints },
  { id: 'campfire', label: 'סביב המדורה', icon: Flame },
  { id: 'icebreaker', label: 'שבירת קרח', icon: Sparkles },
  { id: 'pakal', label: 'הפק"ל שלי', icon: Star },
];

export const SituationChips: React.FC = () => {
  const { activeSituation, setActiveSituation, themeMode, favorites } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 px-1 min-w-max">
        {SITUATIONS.map((chip) => {
          const Icon = chip.icon;
          const isActive = activeSituation === chip.id;
          const isPakal = chip.id === 'pakal';

          return (
            <button
              key={chip.id}
              onClick={() => setActiveSituation(chip.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 touch-press border ${
                isActive
                  ? isCampfire
                    ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-950/60'
                    : 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-300'
                  : isCampfire
                    ? 'bg-stone-900/90 text-orange-200/80 border-campfire-border/60 hover:border-orange-500/50 hover:text-orange-100'
                    : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-50 hover:text-amber-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span>{chip.label}</span>
              {isPakal && favorites.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-white text-amber-700'
                    : isCampfire ? 'bg-orange-950 text-orange-400' : 'bg-amber-100 text-amber-800'
                }`}>
                  {favorites.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
