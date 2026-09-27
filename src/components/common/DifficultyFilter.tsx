import React from 'react';
import { Gauge } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface DifficultyFilterProps {
  counts?: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ counts }) => {
  const { activeDifficulty, setActiveDifficulty, themeMode } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const options: { id: 'all' | 'easy' | 'medium' | 'hard'; label: string; dotColor: string }[] = [
    { id: 'all', label: 'כל הרמות', dotColor: 'bg-stone-400' },
    { id: 'easy', label: 'קליל', dotColor: 'bg-emerald-500' },
    { id: 'medium', label: 'בינוני', dotColor: 'bg-amber-500' },
    { id: 'hard', label: 'מאתגר', dotColor: 'bg-rose-500' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1 text-[11px] font-bold text-stone-400 pl-1 shrink-0">
        <Gauge className="w-3.5 h-3.5" />
        <span>רמת קושי:</span>
      </div>

      <div className="flex items-center gap-1.5">
        {options.map((opt) => {
          const isActive = activeDifficulty === opt.id;
          const count = counts ? counts[opt.id] : undefined;

          return (
            <button
              key={opt.id}
              onClick={() => setActiveDifficulty(opt.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all touch-press flex items-center gap-1.5 border ${
                isActive
                  ? isCampfire
                    ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                    : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : isCampfire
                    ? 'bg-stone-900 text-stone-300 border-campfire-border/60 hover:text-white'
                    : 'bg-white text-stone-600 border-amber-200/80 hover:bg-amber-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${opt.dotColor} ${isActive ? 'ring-2 ring-white/50' : ''}`} />
              <span>{opt.label}</span>
              {count !== undefined && (
                <span className={`text-[10px] font-semibold opacity-75`}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
