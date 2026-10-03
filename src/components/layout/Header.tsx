import React, { useState, useEffect, useRef } from 'react';
import { Flame, SunMedium, Volume2, VolumeX, Compass, Lightbulb, HelpCircle, Sparkles } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

export const Header: React.FC = () => {
  const { 
    themeMode, 
    toggleTheme, 
    soundEnabled, 
    toggleSound, 
    textSize, 
    setTextSize,
    openFeedbackDrawer,
    startTour,
    uxMode,
    toggleUxMode
  } = usePakalStore();
  const [showTextMenu, setShowTextMenu] = useState(false);
  const textMenuRef = useRef<HTMLDivElement>(null);
  const textButtonRef = useRef<HTMLButtonElement>(null);

  // Close text menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        textMenuRef.current && 
        !textMenuRef.current.contains(e.target as Node) &&
        textButtonRef.current &&
        !textButtonRef.current.contains(e.target as Node)
      ) {
        setShowTextMenu(false);
      }
    };
    if (showTextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTextMenu]);

  const isCampfire = themeMode === 'campfire';

  return (
    <header className={`sticky top-0 z-40 pt-safe transition-colors duration-200 border-b backdrop-blur-md ${
      isCampfire 
        ? 'bg-black/90 border-campfire-border/60 text-orange-100' 
        : 'bg-amber-50/95 border-amber-200/80 text-stone-900 shadow-sm'
    }`}>
      <div className="max-w-md mx-auto px-2 min-[380px]:px-3 sm:px-4 h-16 flex items-center justify-between gap-1">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-1.5 min-[380px]:gap-2 min-w-0 shrink">
          <div className={`w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md transition-all shrink-0 ${
            isCampfire
              ? 'bg-gradient-to-br from-orange-600 to-red-700 text-white shadow-orange-950/80 animate-flame'
              : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-300'
          }`}>
            <Flame className="w-4.5 h-4.5 min-[380px]:w-5 min-[380px]:h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 min-[380px]:gap-1.5">
              <h1 className="text-lg min-[380px]:text-xl sm:text-2xl font-extrabold tracking-tight font-sans">
                שלוף
              </h1>
              <span className={`text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                isCampfire 
                  ? 'bg-orange-950/80 text-orange-400 border border-orange-800/60' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                פק"ל שטח
              </span>
            </div>
            <div className="hidden min-[420px]:flex items-center gap-1 text-[10px] sm:text-[11px] opacity-75 font-medium truncate">
              <Compass className="w-3 h-3 shrink-0" />
              <span className="truncate">חידות, משחקים והפעלות</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Help, Text Size, Sound, Theme, Feedback */}
        <div className="flex items-center gap-0.5 min-[380px]:gap-1 sm:gap-1.5 shrink-0">

          {/* Quick Text Scaling Stepper (A- / A / A+) */}
          <div className="relative">
            <button
              ref={textButtonRef}
              onClick={() => setShowTextMenu(prev => !prev)}
              data-tour="tour-text-size"
              aria-label="שנה גודל טקסט לקריאה בשטח"
              title="שנה גודל טקסט לקריאה בשטח (רגיל / גדול / ענק)"
              className={`p-1.5 sm:p-2 rounded-xl flex items-center justify-center transition-all touch-press ${
                textSize !== 'normal'
                  ? isCampfire
                    ? 'bg-orange-600/30 text-orange-300 border border-orange-500/50'
                    : 'bg-amber-200 text-amber-950 border border-amber-400'
                  : isCampfire
                    ? 'text-stone-400 hover:bg-stone-900'
                    : 'text-stone-600 hover:bg-amber-100/70'
              }`}
            >
              <div className="flex items-baseline font-black leading-none select-none">
                <span className="text-sm">א</span>
                <span className="text-[10px] opacity-75 font-bold">A</span>
                {textSize === 'large' && <span className="text-[10px] text-amber-600 dark:text-orange-400 font-extrabold mr-0.5">+</span>}
                {textSize === 'huge' && <span className="text-[10px] text-amber-600 dark:text-orange-400 font-extrabold mr-0.5">++</span>}
              </div>
            </button>

            {/* Stepper Popover Dropdown */}
            {showTextMenu && (
              <div 
                ref={textMenuRef}
                className={`absolute top-12 left-0 z-50 p-2.5 rounded-2xl border-2 shadow-2xl animate-card-pop min-w-[210px] dir-rtl ${
                  isCampfire 
                    ? 'bg-stone-950 border-orange-600/70 text-orange-100 shadow-orange-950/80' 
                    : 'bg-white border-amber-300 text-stone-900 shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2 px-1">
                  <span className="text-[11px] font-black tracking-wide opacity-75">
                    גודל טקסט לקריאה
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-orange-300 border border-amber-500/30">
                    {textSize === 'huge' ? 'ענק 130%' : textSize === 'large' ? 'גדול 115%' : 'רגיל 100%'}
                  </span>
                </div>

                {/* 3-Step Segmented Quick Selector */}
                <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${
                  isCampfire ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
                }`}>
                  {/* Normal 100% */}
                  <button
                    onClick={() => {
                      setTextSize('normal');
                      setShowTextMenu(false);
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-black transition-all flex flex-col items-center gap-0.5 ${
                      textSize === 'normal'
                        ? isCampfire
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-amber-500 text-white shadow-md'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <span className="text-xs">א</span>
                    <span className="text-[9px] font-medium">רגיל</span>
                  </button>

                  {/* Large 115% */}
                  <button
                    onClick={() => {
                      setTextSize('large');
                      setShowTextMenu(false);
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-black transition-all flex flex-col items-center gap-0.5 ${
                      textSize === 'large'
                        ? isCampfire
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-amber-500 text-white shadow-md'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <span className="text-sm">א+</span>
                    <span className="text-[9px] font-medium">גדול</span>
                  </button>

                  {/* Huge 130% */}
                  <button
                    onClick={() => {
                      setTextSize('huge');
                      setShowTextMenu(false);
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-black transition-all flex flex-col items-center gap-0.5 ${
                      textSize === 'huge'
                        ? isCampfire
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-amber-500 text-white shadow-md'
                        : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <span className="text-base">א++</span>
                    <span className="text-[9px] font-medium">ענק</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feedback & Suggestion Drawer Button */}
          <button
            onClick={openFeedbackDrawer}
            data-tour="tour-feedback"
            aria-label="הצעת ייעול, רעיון לחידה או משוב מהשטח"
            title="הצעת ייעול, רעיון לחידה או משוב מהשטח"
            className={`p-1.5 sm:p-2 rounded-xl transition-all touch-press flex items-center justify-center ${
              isCampfire
                ? 'text-amber-400 hover:bg-stone-900 hover:text-amber-300'
                : 'text-amber-700 hover:bg-amber-100/70 hover:text-amber-900'
            }`}
          >
            <Lightbulb className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* Quick Onboarding Tour Help Button */}
          <button
            onClick={() => startTour(true)}
            aria-label="סיור הדרכה מהיר באתר"
            title="סיור הדרכה מהיר באתר (איך להשתמש בשלוף פק״ל)"
            className={`p-1.5 sm:p-2 rounded-xl transition-all touch-press flex items-center justify-center ${
              isCampfire
                ? 'text-stone-400 hover:bg-stone-900 hover:text-orange-300'
                : 'text-stone-500 hover:bg-amber-100/70 hover:text-stone-800'
            }`}
          >
            <HelpCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'השתק צלילים' : 'הפעל צלילים'}
            className={`p-1.5 sm:p-2 rounded-xl transition-all touch-press ${
              isCampfire
                ? soundEnabled 
                  ? 'text-orange-400 hover:bg-orange-950/50' 
                  : 'text-stone-500 hover:bg-stone-900'
                : soundEnabled 
                  ? 'text-amber-800 hover:bg-amber-100' 
                  : 'text-stone-400 hover:bg-stone-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <VolumeX className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
          </button>

          {/* UX Mode Switch (Option B: Classic vs. Enhanced 2.0) */}
          <button
            onClick={toggleUxMode}
            data-tour="tour-ux-mode"
            aria-label={uxMode === 'enhanced' ? 'מעבר לעיצוב קלאסי' : 'מעבר לעיצוב משחקים 2.0 משודרג'}
            title={uxMode === 'enhanced' ? 'עיצוב 2.0 פעיל ✨ (לחץ למעבר לעיצוב קלאסי)' : 'הפעל עיצוב 2.0 ✨ (לחץ להפעלת ממשק משחקים משודרג)'}
            className={`px-1.5 min-[380px]:px-2 py-1 min-[380px]:py-1.5 rounded-xl flex items-center justify-center gap-0.5 min-[380px]:gap-1 transition-all touch-press ${
              uxMode === 'enhanced'
                ? isCampfire
                  ? 'bg-gradient-to-r from-orange-600/40 to-amber-600/40 text-amber-300 border border-orange-500/50 shadow-sm'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                : isCampfire
                  ? 'text-stone-500 hover:text-stone-300 hover:bg-stone-900 border border-stone-800'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-amber-100/70 border border-stone-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${uxMode === 'enhanced' ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-black">{uxMode === 'enhanced' ? '2.0 ✨' : 'קלאסי'}</span>
          </button>

          {/* Sun / Campfire Mode Toggle */}
          <button
            onClick={toggleTheme}
            data-tour="tour-campfire"
            aria-label={isCampfire ? 'מעבר למצב שמש ישירה' : 'מעבר למצב מדורה ולילה'}
            className={`p-1.5 sm:p-2 rounded-xl flex items-center justify-center transition-all touch-press ${
              isCampfire
                ? 'bg-orange-600/20 text-orange-400 border border-orange-500/40 hover:bg-orange-600/30'
                : 'bg-amber-100 text-amber-800 border border-amber-300/80 hover:bg-amber-200'
            }`}
          >
            {isCampfire ? (
              <Flame className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-orange-400 fill-orange-500/20" />
            ) : (
              <SunMedium className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
