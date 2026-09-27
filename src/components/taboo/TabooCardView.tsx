import React from 'react';
import { Ban, AlertCircle } from 'lucide-react';
import { TabooCard } from '../../types';
import { usePakalStore } from '../../store/usePakalStore';

interface TabooCardViewProps {
  card: TabooCard;
  cardNumber: number;
  totalCards: number;
}

export const TabooCardView: React.FC<TabooCardViewProps> = ({
  card,
  cardNumber,
  totalCards,
}) => {
  const { themeMode } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  return (
    <div className={`w-full rounded-3xl border-2 p-6 sm:p-8 transition-all duration-300 shadow-2xl relative overflow-hidden text-center ${
      isCampfire
        ? 'bg-gradient-to-b from-stone-950 via-campfire-card to-black border-orange-600/60 shadow-orange-950/50'
        : 'bg-gradient-to-b from-white to-amber-50/70 border-amber-300 shadow-xl'
    }`}>
      {/* Card Header & Counter */}
      <div className="flex items-center justify-between text-xs font-bold mb-4 opacity-75">
        <span className="flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          <span>כרטיס טאבו שטח</span>
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
          isCampfire ? 'bg-orange-950 text-orange-300' : 'bg-amber-100 text-amber-900'
        }`}>
          {cardNumber} מתוך {totalCards}
        </span>
      </div>

      {/* Target Word (Main Guessing Word) */}
      <div className="py-4 border-b border-dashed border-stone-300 dark:border-stone-800">
        <span className="text-xs font-bold text-stone-400 block mb-1">
          המילה שצריך לנחש:
        </span>
        <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${
          isCampfire ? 'text-orange-400' : 'text-stone-900'
        }`}>
          {card.targetWord}
        </h2>
      </div>

      {/* Forbidden Words (טאבו) */}
      <div className="pt-5">
        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider mb-4">
          <Ban className="w-4 h-4 stroke-[3]" />
          <span>אסור להגיד את המילים הבאות:</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 max-w-xs mx-auto">
          {card.forbiddenWords.map((word, idx) => (
            <div
              key={idx}
              className={`py-3 px-4 rounded-xl font-bold text-lg border transition-all flex items-center justify-center gap-2 ${
                isCampfire
                  ? 'bg-red-950/40 border-red-900/60 text-red-200'
                  : 'bg-red-50/90 border-red-200 text-red-950 shadow-sm'
              }`}
            >
              <span className="text-xs text-red-500 font-mono">✕</span>
              <span>{word}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Field Tip Footer */}
      <div className="mt-6 text-[11px] text-stone-400 font-medium">
        💡 רמז למדריך: אסור להשתמש בחלקי מילים, תרגום לשפה אחרת או תנועות ידיים!
      </div>
    </div>
  );
};
