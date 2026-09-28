import React from 'react';
import { 
  Package, 
  Clock, 
  Compass, 
  Flame, 
  Waves, 
  Footprints, 
  Trees, 
  Layers,
  Sparkles
} from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

export interface ODTFilterState {
  equipmentFilter: 'all' | 'rope' | 'none' | 'water' | 'blindfold' | 'wood';
  durationFilter: 'all' | 'short' | 'medium' | 'deep' | 'night';
  environmentFilter: 'all' | 'trail' | 'camp' | 'water' | 'night' | 'open-field';
  categoryFilter: string | 'all';
}

interface ODTFiltersProps {
  categories: string[];
  filters: ODTFilterState;
  onFilterChange: (newFilters: ODTFilterState) => void;
  totalActivitiesCount: number;
  filteredCount: number;
}

export const ODTFilters: React.FC<ODTFiltersProps> = ({
  categories,
  filters,
  onFilterChange,
  totalActivitiesCount,
  filteredCount
}) => {
  const { themeMode } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const equipmentOptions = [
    { id: 'all', label: 'כל הציוד' },
    { id: 'none', label: 'ללא ציוד (0 ציוד)' },
    { id: 'rope', label: 'יש לי רק חבל' },
    { id: 'blindfold', label: 'כיסויי עיניים' },
    { id: 'wood', label: 'קרשים / עץ' },
    { id: 'water', label: 'מים / נחל' },
  ];

  const durationOptions = [
    { id: 'all', label: 'כל הזמנים' },
    { id: 'short', label: 'קצר (5 דק\')' },
    { id: 'medium', label: 'רגיל (15 דק\')' },
    { id: 'deep', label: 'עומק (20-30 דק\')' },
    { id: 'night', label: 'פעילות לילה' },
  ];

  const update = (partial: Partial<ODTFilterState>) => {
    onFilterChange({ ...filters, ...partial });
  };

  const isAnyFilterActive = 
    filters.equipmentFilter !== 'all' || 
    filters.durationFilter !== 'all' || 
    filters.environmentFilter !== 'all' ||
    filters.categoryFilter !== 'all';

  return (
    <div className="space-y-3">
      {/* Category Pills (Horizontal Scroll) */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 px-1 min-w-max">
          <button
            onClick={() => update({ categoryFilter: 'all' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all touch-press border flex items-center gap-1.5 ${
              filters.categoryFilter === 'all'
                ? isCampfire
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                  : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : isCampfire
                  ? 'bg-stone-900 text-stone-300 border-campfire-border/60 hover:text-white'
                  : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>כל 101 הפעילויות</span>
          </button>

          {categories.map((cat) => {
            const isActive = filters.categoryFilter === cat;
            const shortName = cat.replace(/\([^)]*\)/g, '').trim();
            return (
              <button
                key={cat}
                onClick={() => update({ categoryFilter: cat })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-press border whitespace-nowrap ${
                  isActive
                    ? isCampfire
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                      : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : isCampfire
                      ? 'bg-stone-900 text-stone-300 border-campfire-border/60 hover:text-white'
                      : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-50'
                }`}
              >
                {shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Situational Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1 py-0.5">
        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-400 pl-1 shrink-0">
          <Package className="w-3.5 h-3.5 text-amber-500" />
          <span>ציוד שטח:</span>
        </div>
        {equipmentOptions.map((opt) => {
          const isActive = filters.equipmentFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => update({ equipmentFilter: opt.id as any })}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap border transition-all touch-press ${
                isActive
                  ? isCampfire
                    ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                    : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : isCampfire
                    ? 'bg-stone-900/90 text-stone-300 border-stone-800 hover:text-white'
                    : 'bg-white text-stone-600 border-amber-200/80 hover:bg-amber-50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Duration & Timing Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1 py-0.5">
        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-400 pl-1 shrink-0">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>זמן ועיתוי:</span>
        </div>
        {durationOptions.map((opt) => {
          const isActive = filters.durationFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => update({ durationFilter: opt.id as any })}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap border transition-all touch-press ${
                isActive
                  ? isCampfire
                    ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                    : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : isCampfire
                    ? 'bg-stone-900/90 text-stone-300 border-stone-800 hover:text-white'
                    : 'bg-white text-stone-600 border-amber-200/80 hover:bg-amber-50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}

        {/* Reset Filter Button */}
        {isAnyFilterActive && (
          <button
            onClick={() => onFilterChange({
              equipmentFilter: 'all',
              durationFilter: 'all',
              environmentFilter: 'all',
              categoryFilter: 'all'
            })}
            className="text-[11px] font-bold text-stone-400 underline hover:text-amber-600 shrink-0 px-2"
          >
            איפוס סינונים
          </button>
        )}
      </div>
    </div>
  );
};
