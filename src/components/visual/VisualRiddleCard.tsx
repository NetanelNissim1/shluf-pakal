import React, { useState, useRef } from 'react';
import { 
  Star, 
  Share2, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Maximize2, 
  HelpCircle, 
  QrCode,
  CalendarDays,
  Compass,
  Lightbulb
} from 'lucide-react';
import { VisualRiddle } from '../../types';
import { usePakalStore } from '../../store/usePakalStore';
import { triggerHaptic } from '../../lib/haptics';
import { formatVisualRiddleForWhatsApp, shareToWhatsApp, getStudentShareUrl } from '../../lib/share';

interface VisualRiddleCardProps {
  riddle: VisualRiddle;
  index?: number;
  onOpenPresenter: (riddle: VisualRiddle) => void;
  onOpenQR: (riddle: VisualRiddle) => void;
}

export const VisualRiddleCard: React.FC<VisualRiddleCardProps> = ({
  riddle,
  index,
  onOpenPresenter,
  onOpenQR
}) => {
  const { themeMode, isFavorite, toggleFavorite, isRevealed, toggleReveal, hapticsEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';
  const favorite = isFavorite(riddle.id);

  const [isPressHolding, setIsPressHolding] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null);

  const permanentRevealed = isRevealed(riddle.id);
  const showAnswer = permanentRevealed || isPressHolding;

  // Press & Hold to peek support
  const handleTouchStart = () => {
    holdTimerRef.current = setTimeout(() => {
      setIsPressHolding(true);
    }, 250);
  };

  const handleTouchEnd = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (isPressHolding) setIsPressHolding(false);
  };

  const handleToggleHint = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hapticsEnabled) triggerHaptic(20);
    setShowHint(true);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => {
      setShowHint(false);
    }, 3500);
  };

  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const handleWhatsAppShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hapticsEnabled) triggerHaptic(25);
    const studentUrl = getStudentShareUrl(riddle.id);
    const text = formatVisualRiddleForWhatsApp(riddle.title, studentUrl);
    await shareToWhatsApp(text, studentUrl);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  const getDifficultyBadge = () => {
    switch (riddle.difficulty) {
      case 'hard':
        return { label: 'מאתגר', color: isCampfire ? 'bg-rose-950/60 text-rose-300 border-rose-900/60' : 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
      case 'medium':
        return { label: 'בינוני', color: isCampfire ? 'bg-amber-950/60 text-amber-300 border-amber-900/60' : 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      default:
        return { label: 'קליל', color: isCampfire ? 'bg-emerald-950/60 text-emerald-300 border-emerald-900/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    }
  };

  const diff = getDifficultyBadge();

  return (
    <div className={`rounded-2xl border p-4.5 transition-all duration-200 animate-card-pop relative overflow-hidden ${
      isCampfire
        ? 'bg-campfire-card border-campfire-border/90 text-orange-100 shadow-fire'
        : 'bg-white border-amber-200/90 text-stone-900 shadow-field hover:border-amber-300'
    }`}>
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
            isCampfire
              ? 'bg-orange-950/70 text-orange-400 border-orange-900/60'
              : 'bg-amber-100/90 text-amber-900 border-amber-200'
          }`}>
            {riddle.mainCategory === 'holidays' ? 'חגי ישראל' : riddle.mainCategory === 'geography' ? 'אתרים ומקומות' : 'פתגמים וביטויים'}
          </span>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${diff.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
            <span>{diff.label}</span>
          </span>

          {index !== undefined && (
            <span className="text-[11px] text-stone-400 font-medium">
              #{index + 1}
            </span>
          )}
        </div>

        {/* Action Buttons: WhatsApp Share, QR Share, Star Favorite */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleWhatsAppShare}
            title="שלח קישור תצוגת חניך לוואטסאפ"
            aria-label="שלח לוואטסאפ"
            className={`p-2 rounded-xl transition-all touch-press ${
              isCampfire
                ? 'text-emerald-400 hover:bg-emerald-950/60'
                : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {copiedWhatsApp ? <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onOpenQR(riddle)}
            title="שתף למעגל החניכים (QR)"
            aria-label="שתף למעגל החניכים"
            className={`p-2 rounded-xl transition-all touch-press ${
              isCampfire
                ? 'text-orange-400 hover:bg-orange-950/60'
                : 'text-stone-500 hover:text-amber-800 hover:bg-amber-50'
            }`}
          >
            <QrCode className="w-4 h-4" />
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

      {/* Riddle Title */}
      <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-3">
        {riddle.title}
      </h3>

      {/* Vector Illustration Thumbnail with Presenter Mode Click */}
      <div 
        onClick={() => onOpenPresenter(riddle)}
        className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-black border-2 border-stone-800 hover:border-amber-500/80 transition-all cursor-pointer relative group shadow-lg mb-3"
      >
        <img
          src={riddle.imageUrl}
          alt={riddle.title}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Hover / Tap overlay button: "פתח במסך מלא למרצה" */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-2xl">
            <Maximize2 className="w-4 h-4" />
            <span>פתח במסך מלא למעגל</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenPresenter(riddle);
          }}
          title="פתח במסך מלא"
          className="absolute bottom-2.5 left-2.5 p-2 rounded-xl bg-stone-900/90 text-white hover:bg-amber-600 transition-all shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Rebus Logic Formula */}
      <div className="text-xs text-stone-400 font-medium mb-3 flex items-center gap-1.5 flex-wrap">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>נוסחה:</span>
        <code className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono text-stone-700 dark:text-stone-300">
          {riddle.rebusFormulaDescription}
        </code>
      </div>

      {/* Hint Tooltip */}
      {showHint && (
        <div className="mb-3 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-bold animate-fadeIn flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>רמז: {riddle.hints[0] || 'התבונן בכל מרכיב בנפרד וחבר אותם!'}</span>
        </div>
      )}

      {/* Action Strip: Hint Button & Presenter Mode */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={handleToggleHint}
          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all touch-press flex items-center gap-1 ${
            isCampfire
              ? 'bg-stone-900 border-stone-800 text-amber-400 hover:bg-stone-800'
              : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>רמז לשטח</span>
        </button>

        <button
          onClick={() => onOpenPresenter(riddle)}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all touch-press"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>מסך מלא / מקרן</span>
        </button>
      </div>

      {/* Anti-Peeking Solution Container */}
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
              <div className="text-[18px] sm:text-[19px] font-extrabold text-amber-600 dark:text-orange-400 mb-1">
                {riddle.answer}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-300">
                {riddle.explanation}
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
                לחץ לחשיפת הפתרון
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
