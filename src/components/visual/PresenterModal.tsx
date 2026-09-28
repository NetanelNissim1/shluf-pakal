import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Timer, 
  Tv, 
  Share2, 
  Lock,
  Unlock,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { VisualRiddle } from '../../types';
import { usePakalStore } from '../../store/usePakalStore';
import { triggerHaptic } from '../../lib/haptics';
import { playSuccess } from '../../lib/sound';

interface PresenterModalProps {
  riddle: VisualRiddle;
  allRiddles: VisualRiddle[];
  onClose: () => void;
  onNavigateRiddle: (riddle: VisualRiddle) => void;
  onOpenQR: (riddle: VisualRiddle) => void;
}

export const PresenterModal: React.FC<PresenterModalProps> = ({
  riddle,
  allRiddles,
  onClose,
  onNavigateRiddle,
  onOpenQR,
}) => {
  const { soundEnabled, hapticsEnabled } = usePakalStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHintTooltip, setShowHintTooltip] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [doubleTapCountdown, setDoubleTapCountdown] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCastModeActive, setIsCastModeActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const doubleTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const presentationWindowRef = useRef<Window | null>(null);

  const currentIndex = allRiddles.findIndex(r => r.id === riddle.id);

  // Presentation stopwatch
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Request Fullscreen on launch
  useEffect(() => {
    const req = async () => {
      try {
        if (containerRef.current && containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
        // Try orientation lock to landscape
        if (screen.orientation && (screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch {
        // Fullscreen or orientation lock blocked by policy
      }
    };
    req();

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      if (presentationWindowRef.current) {
        presentationWindowRef.current.close();
      }
    };
  }, []);

  // Reset answer/hints when changing riddle
  useEffect(() => {
    setIsAnswerRevealed(false);
    setShowHintTooltip(false);
    setDoubleTapCountdown(0);
    // Update cast window if open
    if (presentationWindowRef.current && !presentationWindowRef.current.closed) {
      presentationWindowRef.current.document.body.innerHTML = `
        <div style="background:#000;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;margin:0;padding:0;overflow:hidden;">
          <img src="${riddle.imageUrl}" style="max-width:98vw;max-height:98vh;object-fit:contain;" />
        </div>
      `;
    }
  }, [riddle]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      //
    }
  };

  // 3-second temporary hint
  const handleShowHint = () => {
    if (hapticsEnabled) triggerHaptic(20);
    setShowHintTooltip(true);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setShowHintTooltip(false);
    }, 4000); // 4 seconds
  };

  // Double-tap protection to reveal answer
  const handleRevealClick = () => {
    if (isAnswerRevealed) {
      setIsAnswerRevealed(false);
      return;
    }

    if (doubleTapCountdown === 1) {
      // Confirmed second tap
      setIsAnswerRevealed(true);
      setDoubleTapCountdown(0);
      if (soundEnabled) playSuccess();
      if (hapticsEnabled) triggerHaptic([50, 40]);
    } else {
      // First tap: trigger 2.5s timer
      setDoubleTapCountdown(1);
      if (hapticsEnabled) triggerHaptic(20);
      if (doubleTapTimeoutRef.current) clearTimeout(doubleTapTimeoutRef.current);
      doubleTapTimeoutRef.current = setTimeout(() => {
        setDoubleTapCountdown(0);
      }, 2500);
    }
  };

  // Navigation
  const goToNext = () => {
    if (hapticsEnabled) triggerHaptic(25);
    const next = allRiddles[(currentIndex + 1) % allRiddles.length];
    onNavigateRiddle(next);
  };

  const goToPrev = () => {
    if (hapticsEnabled) triggerHaptic(25);
    const prev = allRiddles[(currentIndex - 1 + allRiddles.length) % allRiddles.length];
    onNavigateRiddle(prev);
  };

  // Dual Screen / Presentation API Projector Mode
  const handleLaunchProjector = () => {
    try {
      const win = window.open('', 'shluf_projector', 'width=1280,height=720');
      if (win) {
        presentationWindowRef.current = win;
        setIsCastModeActive(true);
        win.document.title = 'שלוף - מקרן שטח נקי';
        win.document.body.style.margin = '0';
        win.document.body.style.backgroundColor = '#000000';
        win.document.body.innerHTML = `
          <div style="background:#000;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;margin:0;padding:0;overflow:hidden;">
            <img src="${riddle.imageUrl}" style="max-width:98vw;max-height:98vh;object-fit:contain;" />
          </div>
        `;
      }
    } catch {
      // popup blocked
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col select-none overflow-hidden"
    >
      {/* Top Discrete Presenter Navigation Bar */}
      <header className="h-14 px-4 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="סגור מסך מלא"
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>{riddle.title}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {currentIndex + 1} / {allRiddles.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Presenter Controls (Timer, Projector, QR, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* Presentation Elapsed Timer */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono font-bold text-amber-400">
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Projector / Dual Display Button */}
          <button
            onClick={handleLaunchProjector}
            title={isCastModeActive ? 'מקרן פעיל (משדר תמונה נקייה בלבד)' : 'שדר למקרן / מסך חיצוני (Dual Screen)'}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
              isCastModeActive
                ? 'bg-emerald-600/30 text-emerald-400 border-emerald-500/50'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden md:inline">{isCastModeActive ? 'מקרן מחובר' : 'מקרן'}</span>
          </button>

          {/* Circle Share (WhatsApp / QR) */}
          <button
            onClick={() => onOpenQR(riddle)}
            title="שתף למעגל החניכים (וואטסאפ / קוד QR)"
            className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">שתף (וואטסאפ/QR)</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label="מסך מלא"
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Vector Rebus Display Area with Zoom & Pan */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
        <TransformWrapper
          initialScale={1}
          minScale={0.8}
          maxScale={6}
          centerOnInit
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Floating Zoom Bar on the Left */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-stone-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 shadow-2xl">
                <button
                  onClick={() => zoomIn()}
                  aria-label="הגדל"
                  className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 active:scale-95 transition-all"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => zoomOut()}
                  aria-label="הקטן"
                  className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 active:scale-95 transition-all"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={() => resetTransform()}
                  aria-label="איפוס"
                  className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Prev / Next Slide Arrows */}
              <button
                onClick={goToPrev}
                aria-label="החידה הקודמת"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 flex items-center justify-center text-white shadow-2xl active:scale-90 transition-all"
              >
                <ChevronRight className="w-7 h-7" />
              </button>

              <button
                onClick={goToNext}
                aria-label="החידה הבאה"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 flex items-center justify-center text-white shadow-2xl active:scale-90 transition-all"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              {/* Pan Canvas with high-res SVG */}
              <TransformComponent
                wrapperClass="!w-full !h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                contentClass="!w-full !h-full flex items-center justify-center p-2 sm:p-6"
              >
                <img
                  src={riddle.imageUrl}
                  alt={riddle.title}
                  className="max-w-full max-h-[82vh] object-contain drop-shadow-2xl select-none pointer-events-none"
                  draggable={false}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {/* Temporary 3-Second Hint Tooltip Overlay */}
        {showHintTooltip && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-amber-500 text-stone-950 font-black text-sm sm:text-base py-2.5 px-6 rounded-2xl shadow-2xl animate-bounce border-2 border-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>רמז: {riddle.hints[0] || 'שים לב לחיבור בין הפרטים בציור!'}</span>
          </div>
        )}
      </main>

      {/* Bottom Instructor Safe Control Bar */}
      <footer className="h-16 px-4 bg-stone-950/95 border-t border-stone-800 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          {/* Temporary 3s Hint Button */}
          <button
            onClick={handleShowHint}
            className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-all touch-press"
          >
            <HelpCircle className="w-4 h-4" />
            <span>רמז (זמני)</span>
          </button>
        </div>

        {/* Anti-Peeking Solution Reveal Box with Double-Tap Safeguard */}
        <div className="flex items-center gap-2">
          {isAnswerRevealed ? (
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/60 px-4 py-2 rounded-xl animate-fadeIn">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 block">פתרון מלא:</span>
                <span className="text-base sm:text-lg font-black text-white">{riddle.answer}</span>
              </div>
              <button
                onClick={() => setIsAnswerRevealed(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
                title="הסתר פתרון"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleRevealClick}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all touch-press border ${
                doubleTapCountdown === 1
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-700'
              }`}
            >
              {doubleTapCountdown === 1 ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>לחץ שוב לאישור חשיפה!</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>חשוף תשובה (לחיצה כפולה)</span>
                </>
              )}
            </button>
          )}
        </div>
      </footer>

    </div>
  );
};
