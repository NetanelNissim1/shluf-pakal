import React, { useState, useEffect } from 'react';
import { Flame, SunMedium, Volume2, VolumeX, Wifi, WifiOff, Compass } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

export const Header: React.FC = () => {
  const { themeMode, toggleTheme, soundEnabled, toggleSound } = usePakalStore();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isCampfire = themeMode === 'campfire';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
      isCampfire 
        ? 'bg-black/90 border-campfire-border/60 text-orange-100' 
        : 'bg-amber-50/95 border-amber-200/80 text-stone-900 shadow-sm'
    }`}>
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all ${
            isCampfire
              ? 'bg-gradient-to-br from-orange-600 to-red-700 text-white shadow-orange-950/80 animate-flame'
              : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-300'
          }`}>
            <Flame className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-extrabold tracking-tight font-sans">
                שלוף
              </h1>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                isCampfire 
                  ? 'bg-orange-950/80 text-orange-400 border border-orange-800/60' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                פק"ל שטח
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] opacity-75 font-medium">
              <Compass className="w-3 h-3" />
              <span>חידות, משחקים והפעלות</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Offline Status, Sound, Theme */}
        <div className="flex items-center gap-1.5">
          {/* Offline/Online Indicator */}
          <div 
            title={isOnline ? 'מחובר לרשת (התוכן נשמר גם אופליין)' : 'פועל אופליין מלא ללא קליטה'}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border transition-all ${
              isOnline 
                ? isCampfire 
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isCampfire
                  ? 'bg-amber-950/70 text-amber-300 border-amber-700'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3 h-3" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <WifiOff className="w-3 h-3" />
                <span className="hidden sm:inline">אופליין</span>
              </>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'השתק צלילים' : 'הפעל צלילים'}
            className={`p-2 rounded-xl transition-all touch-press ${
              isCampfire
                ? soundEnabled 
                  ? 'text-orange-400 hover:bg-orange-950/50' 
                  : 'text-stone-500 hover:bg-stone-900'
                : soundEnabled 
                  ? 'text-amber-800 hover:bg-amber-100' 
                  : 'text-stone-400 hover:bg-stone-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Sun / Campfire Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isCampfire ? 'מעבר למצב שמש ישירה' : 'מעבר למצב מדורה ולילה'}
            className={`p-2 rounded-xl flex items-center justify-center transition-all touch-press ${
              isCampfire
                ? 'bg-orange-600/20 text-orange-400 border border-orange-500/40 hover:bg-orange-600/30'
                : 'bg-amber-100 text-amber-800 border border-amber-300/80 hover:bg-amber-200'
            }`}
          >
            {isCampfire ? (
              <Flame className="w-5 h-5 text-orange-400 fill-orange-500/20" />
            ) : (
              <SunMedium className="w-5 h-5 text-amber-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
