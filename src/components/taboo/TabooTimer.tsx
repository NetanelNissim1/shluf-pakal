import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';
import { playTimerTick, playWarningTick, playTimerEnd } from '../../lib/sound';
import { triggerHaptic } from '../../lib/haptics';

interface TabooTimerProps {
  secondsLeft: number;
  isRunning: boolean;
  totalSeconds: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onTimeUp?: () => void;
}

export const TabooTimer: React.FC<TabooTimerProps> = ({
  secondsLeft,
  isRunning,
  totalSeconds,
  onTogglePlay,
  onReset,
  onTimeUp,
}) => {
  const { themeMode, soundEnabled, hapticsEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const progress = (secondsLeft / totalSeconds) * 100;
  const strokeDashoffset = 283 - (283 * progress) / 100;

  // Sound and haptic alerts during last seconds
  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft <= 5 && secondsLeft > 0) {
      if (soundEnabled) playWarningTick();
      if (hapticsEnabled) triggerHaptic(40);
    } else if (secondsLeft === 0) {
      if (soundEnabled) playTimerEnd();
      if (hapticsEnabled) triggerHaptic([100, 100, 200]);
      if (onTimeUp) onTimeUp();
    }
  }, [secondsLeft, isRunning, soundEnabled, hapticsEnabled, onTimeUp]);

  const getColorClass = () => {
    if (secondsLeft <= 10) return 'text-red-500 stroke-red-500';
    if (secondsLeft <= 25) return 'text-amber-500 stroke-amber-500';
    return isCampfire ? 'text-orange-400 stroke-orange-400' : 'text-emerald-500 stroke-emerald-500';
  };

  return (
    <div className={`flex items-center justify-between gap-4 p-3 rounded-2xl border transition-all ${
      isCampfire ? 'bg-campfire-card border-campfire-border/80' : 'bg-white border-amber-200/90 shadow-sm'
    }`}>
      {/* Circular Animated SVG Timer */}
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`stroke-current ${isCampfire ? 'text-stone-800' : 'text-stone-100'}`}
              strokeWidth="8"
              fill="transparent"
            />
            {/* Countdown Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`transition-all duration-300 ${getColorClass()}`}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-black tracking-tighter ${getColorClass()} ${
              secondsLeft <= 10 && isRunning ? 'animate-ping-once' : ''
            }`}>
              {secondsLeft}
            </span>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-stone-400">טיימר {totalSeconds} שניות</div>
          <div className={`text-sm font-extrabold ${secondsLeft === 0 ? 'text-red-500 animate-pulse' : ''}`}>
            {secondsLeft === 0 ? 'הזמן תם!' : isRunning ? 'רץ ברקע...' : 'מוכן להזנקה'}
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all touch-press ${
            isRunning
              ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
              : isCampfire
                ? 'bg-orange-600 text-white hover:bg-orange-500'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>השהה</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{secondsLeft === totalSeconds ? 'התחל' : 'המשך'}</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          aria-label="איפוס טיימר"
          className={`p-2.5 rounded-xl transition-all touch-press border ${
            isCampfire
              ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
              : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
