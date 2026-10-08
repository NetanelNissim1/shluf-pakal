import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Share2, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Compass, 
  Users, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Waves,
  Footprints,
  Trees
} from 'lucide-react';
import { ODTActivity } from '../../types';
import { usePakalStore } from '../../store/usePakalStore';
import { triggerHaptic } from '../../lib/haptics';
import { playSuccess, playTimerEnd, playTimerTick, playWarningTick } from '../../lib/sound';
import { shareContent } from '../../lib/share';

interface ODTCardProps {
  activity: ODTActivity;
  index?: number;
  onSelectNextActivity?: (act: ODTActivity) => void;
  nextActivitySuggestion?: ODTActivity;
}

export const ODTCard: React.FC<ODTCardProps> = ({ 
  activity, 
  index,
  onSelectNextActivity,
  nextActivitySuggestion 
}) => {
  const { themeMode, isFavorite, toggleFavorite, soundEnabled, hapticsEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';
  const favorite = isFavorite(activity.id);

  // Timer state
  const [timerMode, setTimerMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [targetSeconds, setTargetSeconds] = useState<number>(60);
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showNextSuggestion, setShowNextSuggestion] = useState<boolean>(false);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown and Stopwatch Runner
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        if (timerMode === 'countdown') {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerIntervalRef.current as NodeJS.Timeout);
              setIsTimerRunning(false);
              if (soundEnabled) playTimerEnd();
              if (hapticsEnabled) triggerHaptic([150, 100, 200, 100, 300]);
              return 0;
            }
            if (prev <= 5 && soundEnabled) {
              playWarningTick();
            } else if (soundEnabled && prev % 5 === 0) {
              playTimerTick();
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerMode, soundEnabled, hapticsEnabled]);

  const handleStartTimer = (presetSeconds: number) => {
    setTimerMode('countdown');
    setTargetSeconds(presetSeconds);
    setSecondsLeft(presetSeconds);
    setIsTimerRunning(true);
    setIsTimerOpen(true);
    if (hapticsEnabled) triggerHaptic(30);
  };

  const handleStartStopwatch = () => {
    setTimerMode('stopwatch');
    setStopwatchSeconds(0);
    setIsTimerRunning(true);
    setIsTimerOpen(true);
    if (hapticsEnabled) triggerHaptic(30);
  };

  const handleToggleTimer = () => {
    if (hapticsEnabled) triggerHaptic(25);
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    if (hapticsEnabled) triggerHaptic(20);
    setIsTimerRunning(false);
    if (timerMode === 'countdown') {
      setSecondsLeft(targetSeconds);
    } else {
      setStopwatchSeconds(0);
    }
  };

  // WhatsApp share
  const handleShare = async () => {
    const text = `🏕️ *פעילות ODT משלוף:* ${activity.title}
🏷️ קטגוריה: ${activity.category}
🎯 ערך ומיומנות: ${activity.groupValue}
🎒 ציוד נדרש: ${activity.equipment.join(', ') || 'ללא ציוד'}
⏱️ זמן משוער: ${activity.durationMinutes || 15} דקות

📋 *הוראות הפעלה למדריך:*
${activity.instructions}

✨ _נשלף באמצעות אפליקציית "שלוף" - פק"ל שטח למדריכים_`;

    const shared = await shareContent(activity.title, text);
    if (shared) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Environment icon
  const getEnvBadge = () => {
    switch (activity.environment) {
      case 'water':
        return { label: 'מים ונחלים', icon: Waves, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30' };
      case 'night':
        return { label: 'לילה ומדורה', icon: Flame, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' };
      case 'trail':
        return { label: 'שביל הליכה', icon: Footprints, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
      case 'camp':
        return { label: 'חניון / מחנה', icon: Trees, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
      default:
        return { label: 'שטח פתוח', icon: Compass, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' };
    }
  };

  const env = getEnvBadge();
  const EnvIcon = env.icon;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 animate-card-pop relative overflow-hidden ${
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
            {activity.category}
          </span>

          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${env.color}`}>
            <EnvIcon className="w-3 h-3" />
            <span>{env.label}</span>
          </span>

          {activity.durationMinutes && (
            <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{activity.durationMinutes} דק'</span>
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
            aria-label="שתף פעילות"
            className={`p-2 rounded-xl transition-all touch-press ${
              isCampfire
                ? 'text-orange-400 hover:bg-orange-950/60'
                : 'text-stone-500 hover:text-amber-800 hover:bg-amber-50'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleFavorite(activity.id)}
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

      {/* Activity Title */}
      <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-2">
        {activity.title}
      </h3>

      {/* Group Value / Educational Skill */}
      <div className={`flex items-start gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl mb-3 border ${
        isCampfire 
          ? 'bg-amber-950/40 border-amber-900/40 text-amber-300' 
          : 'bg-amber-50/80 border-amber-200 text-amber-900'
      }`}>
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
        <span>ערך ומיומנות: {activity.groupValue}</span>
      </div>

      {/* Equipment Badges */}
      <div className="mb-3">
        <span className="text-[11px] font-bold text-stone-400 block mb-1">ציוד נדרש:</span>
        <div className="flex flex-wrap gap-1.5">
          {activity.equipment.map((eq, i) => (
            <span
              key={i}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                eq.includes('אין') || eq.includes('ללא')
                  ? isCampfire ? 'bg-emerald-950/60 text-emerald-300 border-emerald-900/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isCampfire ? 'bg-stone-900 text-stone-300 border-stone-800' : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              🎒 {eq}
            </span>
          ))}
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className={`p-4 sm:p-5 rounded-xl border text-sm sm:text-base leading-relaxed mb-4 select-none ${
        isCampfire
          ? 'bg-stone-950/80 border-stone-800/80 text-stone-200'
          : 'bg-stone-50 border-stone-200/80 text-stone-800'
      }`}>
        <div className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" />
          <span>מהלך הפעילות:</span>
        </div>
        <p className="whitespace-pre-line">
          {activity.instructions}
        </p>
      </div>

      {/* Integrated Field Timer / Stopwatch Section */}
      <div className={`p-4 rounded-xl border transition-all ${
        isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-amber-50/50 border-amber-200/70'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-orange-400">
            <Timer className="w-4 h-4" />
            <span>טיימר שטח משולב</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStartTimer(30)}
              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 hover:bg-amber-500 hover:text-white transition-all"
            >
              30 ש'
            </button>
            <button
              onClick={() => handleStartTimer(60)}
              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 hover:bg-amber-500 hover:text-white transition-all"
            >
              60 ש'
            </button>
            <button
              onClick={() => handleStartTimer(180)}
              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 hover:bg-amber-500 hover:text-white transition-all"
            >
              3 דק'
            </button>
            <button
              onClick={handleStartStopwatch}
              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 hover:bg-amber-500 hover:text-white transition-all"
            >
              עצר ⏱️
            </button>
          </div>
        </div>

        {/* Active Timer Display Bar */}
        {isTimerOpen && (
          <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black font-mono tracking-tight ${
                timerMode === 'countdown' && secondsLeft <= 5 && isTimerRunning
                  ? 'text-red-500 animate-pulse'
                  : 'text-amber-600 dark:text-orange-400'
              }`}>
                {timerMode === 'countdown' ? formatTime(secondsLeft) : formatTime(stopwatchSeconds)}
              </span>
              <span className="text-[11px] text-stone-400 font-bold">
                {timerMode === 'countdown' ? (secondsLeft === 0 ? '⏰ הזמן תם!' : 'ספירה לאחור') : 'שעון עצר'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleTimer}
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1 shadow-sm transition-all touch-press"
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'השהה' : 'הפעל'}</span>
              </button>

              <button
                onClick={handleResetTimer}
                aria-label="איפוס טיימר"
                className="p-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-all touch-press"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Next Game Sequel Recommendation ("רעיון למשחק המשך") */}
      {nextActivitySuggestion && (
        <div className="mt-3">
          {!showNextSuggestion ? (
            <button
              onClick={() => {
                setShowNextSuggestion(true);
                if (hapticsEnabled) triggerHaptic(20);
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all touch-press flex items-center justify-center gap-1.5 ${
                isCampfire
                  ? 'bg-stone-900 border-stone-800 text-orange-400 hover:bg-stone-800'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>רעיון למשחק המשך / עליית שלב ➔</span>
            </button>
          ) : (
            <div className={`p-3 rounded-xl border animate-fadeIn ${
              isCampfire ? 'bg-orange-950/40 border-orange-800/60' : 'bg-amber-100/60 border-amber-300'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-black text-amber-600 dark:text-orange-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>משחק המשך מומלץ:</span>
                </span>
                {onSelectNextActivity && (
                  <button
                    onClick={() => onSelectNextActivity(nextActivitySuggestion)}
                    className="text-[11px] font-bold text-amber-700 dark:text-orange-300 underline flex items-center gap-1"
                  >
                    <span>עבור לפעילות זו</span>
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </button>
                )}
              </div>
              <h4 className="font-extrabold text-sm mb-1">{nextActivitySuggestion.title}</h4>
              <p className="text-xs text-stone-500 line-clamp-2">{nextActivitySuggestion.instructions}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
