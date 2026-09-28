import React, { useState, useRef } from 'react';
import { Star, Share2, Check, Eye, EyeOff, Sparkles } from 'lucide-react';
import { RiddleItem } from '../../types';
import { usePakalStore } from '../../store/usePakalStore';
import { formatRiddleForShare, shareContent } from '../../lib/share';

interface RiddleCardProps {
  riddle: RiddleItem;
  index?: number;
}

export const RiddleCard: React.FC<RiddleCardProps> = ({ riddle, index }) => {
  const { 
    themeMode, 
    isFavorite, 
    toggleFavorite, 
    isRevealed, 
    toggleReveal 
  } = usePakalStore();

  const [copied, setCopied] = useState(false);
  const [isPressHolding, setIsPressHolding] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isCampfire = themeMode === 'campfire';
  const favorite = isFavorite(riddle.id);
  const permanentRevealed = isRevealed(riddle.id);
  const showAnswer = permanentRevealed || isPressHolding;

  // Handle Share / WhatsApp Copy
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = formatRiddleForShare(riddle);
    const shared = await shareContent('שלוף - חידה', text);
    if (shared) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Press & Hold to peek support
  const handleTouchStart = () => {
    holdTimerRef.current = setTimeout(() => {
      setIsPressHolding(true);
    }, 250);
  };

  const handleTouchEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (isPressHolding) {
      setIsPressHolding(false);
    }
  };

  return (
    <div 
      className={`rounded-2xl border p-4.5 transition-all duration-200 animate-card-pop relative overflow-hidden ${
        isCampfire
          ? 'bg-campfire-card border-campfire-border/90 text-orange-100 shadow-fire'
          : 'bg-white border-amber-200/90 text-stone-900 shadow-field hover:border-amber-300'
      }`}
    >
      {/* Top Meta Bar: SubCategory, Tags, Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
            isCampfire
              ? 'bg-orange-950/70 text-orange-400 border-orange-900/60'
              : 'bg-amber-100/90 text-amber-900 border-amber-200'
          }`}>
            {riddle.subCategory}
          </span>
          {riddle.difficulty && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
              riddle.difficulty === 'hard'
                ? isCampfire ? 'bg-rose-950/60 text-rose-300 border-rose-900/60' : 'bg-rose-50 text-rose-700 border-rose-200'
                : riddle.difficulty === 'medium'
                  ? isCampfire ? 'bg-amber-950/60 text-amber-300 border-amber-900/60' : 'bg-amber-50 text-amber-700 border-amber-200'
                  : isCampfire ? 'bg-emerald-950/60 text-emerald-300 border-emerald-900/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                riddle.difficulty === 'hard' ? 'bg-rose-500' : riddle.difficulty === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span>
                {riddle.difficulty === 'hard' ? 'מאתגר' : riddle.difficulty === 'medium' ? 'בינוני' : 'קליל'}
              </span>
            </span>
          )}
          {index !== undefined && (
            <span className="text-[11px] text-stone-400 font-medium">
              #{index + 1}
            </span>
          )}
        </div>

        {/* Action Buttons: Star Favorite & Share */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            aria-label="שתף חידה"
            className={`p-2 rounded-xl transition-all touch-press ${
              isCampfire
                ? 'text-orange-400 hover:bg-orange-950/60'
                : 'text-stone-500 hover:text-amber-800 hover:bg-amber-50'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleFavorite(riddle.id)}
            aria-label={favorite ? 'הסר מהפק"ל שלי' : 'הוסף לפק"ל שלי'}
            className={`p-2 rounded-xl transition-all touch-press ${
              favorite
                ? 'text-amber-500'
                : isCampfire
                  ? 'text-stone-500 hover:text-orange-300 hover:bg-orange-950/40'
                  : 'text-stone-400 hover:text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Star className={`w-5 h-5 ${favorite ? 'fill-amber-500 stroke-amber-500' : 'stroke-[1.8]'}`} />
          </button>
        </div>
      </div>

      {/* Question Text (Large 18px+ font for outdoor sunlight readability) */}
      <div className="mb-4">
        <p className="text-[19px] sm:text-[20px] font-bold leading-snug tracking-tight">
          {riddle.question}
        </p>
      </div>

      {/* Anti-Peeking Solution Box */}
      <div 
        onClick={() => toggleReveal(riddle.id)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        className={`w-full rounded-xl cursor-pointer transition-all duration-200 select-none ${
          showAnswer
            ? isCampfire
              ? 'bg-orange-950/90 border border-orange-600/80 text-orange-200 p-3.5'
              : 'bg-amber-50 border border-amber-300 text-stone-900 p-3.5 shadow-inner'
            : isCampfire
              ? 'bg-stone-900/90 border border-stone-800/80 hover:border-orange-700 text-orange-300/80 py-3 px-4'
              : 'bg-stone-50 hover:bg-amber-50/60 border border-dashed border-stone-300 hover:border-amber-400 text-stone-600 py-3 px-4'
        }`}
      >
        {showAnswer ? (
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 opacity-75">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>הפתרון:</span>
              </div>
              <div className="text-[18px] sm:text-[19px] font-extrabold text-amber-600 dark:text-orange-400">
                {riddle.answer}
              </div>
            </div>
            <span className="text-stone-400 hover:text-stone-600 p-1">
              <EyeOff className="w-4 h-4" />
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 opacity-70" />
              <span className="text-sm font-semibold">
                לחץ לחשיפת התשובה
              </span>
            </div>
            <span className="text-[11px] opacity-60">
              (או החזק להצצה)
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
