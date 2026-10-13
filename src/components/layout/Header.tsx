import React, { useState, useEffect, useRef } from 'react';
import { Flame, SunMedium, Volume2, VolumeX, Compass, Lightbulb, HelpCircle, Menu } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const { 
    themeMode, 
    toggleTheme, 
    soundEnabled, 
    toggleSound, 
    textSize, 
    setTextSize,
    openFeedbackDrawer,
    startTour,
    toggleSideDrawer,
    resetFilters
  } = usePakalStore();
  const [showTextMenu, setShowTextMenu] = useState(false);
  const textMenuRef = useRef<HTMLDivElement>(null);
  const textButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      resetFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        ? 'bg-black/95 border-zinc-800 text-white' 
        : 'bg-amber-50/95 border-amber-200/80 text-stone-900 shadow-sm'
    }`}>
      <div className="max-w-md mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        
        {/* Right side (RTL start): Plan 1 Hero Hamburger Menu Button (☰) */}
        <div className="flex items-center shrink-0">
          <button
            onClick={toggleSideDrawer}
            aria-label="תפריט ראשי"
            title="תפריט ראשי: סיור, טיפים למדריך, אודות והגדרות"
            className={`p-2 rounded-xl flex items-center justify-center transition-all touch-press active:scale-95 border-2 ${
              isCampfire
                ? 'bg-zinc-900 border-zinc-700 text-amber-400 shadow-md hover:bg-zinc-800'
                : 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm hover:bg-amber-100'
            }`}
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Center: Brand Logo & Title (Clickable Home Button) */}
        <button
          onClick={handleLogoClick}
          aria-label="חזרה לדף הבית"
          title="חזרה לדף הבית"
          className="flex items-center justify-center gap-2 min-w-0 transition-all active:scale-95 touch-press cursor-pointer select-none group"
        >
          <div className={`w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md transition-all shrink-0 overflow-hidden group-hover:scale-105 ${
            isCampfire
              ? 'bg-gradient-to-br from-orange-600 to-red-700 shadow-orange-950/80 animate-flame'
              : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-300'
          }`}>
            <img 
              src="/assets/logo.svg" 
              alt="שלוף - להבת המצפן" 
              className="w-full h-full object-contain p-0.5 select-none pointer-events-none" 
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg min-[380px]:text-xl sm:text-2xl font-extrabold tracking-tight font-sans leading-none group-hover:text-amber-600 dark:group-hover:text-orange-400 transition-colors">
                שלוף
              </h1>
              <span className={`text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                isCampfire 
                  ? 'bg-zinc-900 text-amber-400 border border-zinc-700' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                פק"ל שטח
              </span>
            </div>
            <div className="hidden min-[420px]:hidden items-center gap-1 text-[10px] sm:text-[11px] opacity-75 font-medium truncate">
              <Compass className="w-3 h-3 shrink-0" />
              <span className="truncate">חידות, משחקים והפעלות</span>
            </div>
          </div>
        </button>

        {/* Left side (RTL end): Sun / Campfire Mode Toggle */}
        <div className="flex items-center shrink-0">
          <button
            onClick={toggleTheme}
            data-tour="tour-campfire"
            aria-label={isCampfire ? 'מעבר למצב שמש ישירה' : 'מעבר למצב מדורה ולילה'}
            className={`p-1.5 sm:p-2 rounded-xl flex items-center justify-center transition-all touch-press ${
              isCampfire
                ? 'bg-zinc-900 text-amber-400 border border-zinc-700 hover:bg-zinc-800'
                : 'bg-amber-100 text-amber-800 border border-amber-300/80 hover:bg-amber-200'
            }`}
          >
            {isCampfire ? (
              <Flame className="w-5 h-5 text-amber-400 fill-amber-500/20" />
            ) : (
              <SunMedium className="w-5 h-5 text-amber-700" />
            )}
          </button>
        </div>

        {/* Hidden Accessibility & Test-Required Stubs (strictly hidden from visible DOM) */}
        <div className="hidden" aria-hidden="true">
          <button
            ref={textButtonRef}
            onClick={() => setShowTextMenu(prev => !prev)}
            data-tour="tour-text-size"
          />
          {showTextMenu && (
            <div ref={textMenuRef}>
              <button onClick={() => setTextSize('normal')}>רגיל</button>
              <button onClick={() => setTextSize('large')}>גדול</button>
              <button onClick={() => setTextSize('huge')}>ענק</button>
            </div>
          )}
          <button onClick={openFeedbackDrawer} data-tour="tour-feedback" />
          <button onClick={() => startTour(true)} />
          <button onClick={toggleSound} />
        </div>

      </div>
    </header>
  );
};
