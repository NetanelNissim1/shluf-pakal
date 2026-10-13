import React, { useEffect } from 'react';
import { 
  X, 
  Compass, 
  Tent, 
  Info, 
  Lightbulb, 
  Shuffle, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronLeft,
  Smartphone,
  Sparkles,
  HelpCircle,
  Star
} from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

export const SideDrawer: React.FC = () => {
  const {
    isSideDrawerOpen,
    closeSideDrawer,
    themeMode,
    textSize,
    setTextSize,
    soundEnabled,
    toggleSound,
    randomOrderEnabled,
    toggleRandomOrder,
    reshuffleDeviceSeed,
    openAboutModal,
    openGuideTipsModal,
    openFeedbackDrawer,
    startTour,
    favorites,
    setActiveSituation
  } = usePakalStore();

  const isCampfire = themeMode === 'campfire';

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSideDrawerOpen) {
        closeSideDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSideDrawerOpen, closeSideDrawer]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isSideDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSideDrawerOpen]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isSideDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSideDrawer}
        aria-hidden={!isSideDrawerOpen}
      />

      {/* Slide-out Drawer Panel (RTL - Right to Left) */}
      <aside 
        className={`fixed top-0 right-0 bottom-0 w-[84%] max-w-[340px] z-50 transition-transform duration-300 ease-out shadow-2xl flex flex-col border-l select-none touch-manipulation ${
          isSideDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } ${
          isCampfire 
            ? 'bg-stone-950 border-stone-800 text-orange-100 shadow-orange-950/60' 
            : 'bg-white border-amber-200 text-stone-900 shadow-2xl'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ראשי"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
      >
        {/* Drawer Header */}
        <div className={`p-4 sm:p-5 pt-safe border-b flex items-center justify-between shrink-0 ${
          isCampfire ? 'border-stone-800 bg-stone-900/60' : 'border-amber-100 bg-amber-50/70'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md overflow-hidden ${
              isCampfire 
                ? 'bg-gradient-to-br from-orange-600 to-red-700 shadow-orange-950' 
                : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-300'
            }`}>
              <img 
                src="/assets/logo.svg" 
                alt="שלוף פק״ל" 
                className="w-full h-full object-contain p-0.5 pointer-events-none select-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight">שלוף</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  100% אופליין
                </span>
              </div>
              <p className="text-xs opacity-75 font-medium mt-0.5">פק"ל שטח, חידות והפעלות</p>
            </div>
          </div>

          <button
            onClick={closeSideDrawer}
            className={`p-2 rounded-full transition-colors ${
              isCampfire ? 'hover:bg-stone-800 text-stone-400 hover:text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
            }`}
            aria-label="סגור תפריט"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Menu List */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5">
          
          {/* Menu Item 1: Guided Tour */}
          <button
            onClick={() => {
              closeSideDrawer();
              setTimeout(() => startTour(true), 150);
            }}
            className={`w-full p-3 rounded-2xl border text-right transition-all flex items-start gap-3 group ${
              isCampfire 
                ? 'bg-stone-900/60 border-stone-800 hover:border-amber-500/50 hover:bg-stone-900' 
                : 'bg-amber-50/50 border-amber-200/80 hover:border-amber-400 hover:bg-amber-50'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              isCampfire ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
            }`}>
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-stone-900 dark:text-white">סיור מודרך באתר</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  הפעלה
                </span>
              </div>
              <p className="text-xs opacity-70 mt-0.5 leading-snug">
                איך לתפעל את שלוף בשטח: שליפה מהירה, חידות ופק"ל אישי
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all self-center" />
          </button>

          {/* Menu Item 2: Guide Tips (NEW!) */}
          <button
            onClick={openGuideTipsModal}
            className={`w-full p-3 rounded-2xl border text-right transition-all flex items-start gap-3 group ${
              isCampfire 
                ? 'bg-stone-900/60 border-stone-800 hover:border-emerald-500/50 hover:bg-stone-900' 
                : 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-50'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              isCampfire ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <Tent className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-stone-900 dark:text-white">פק"ל טיפים למדריך</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  חדש!
                </span>
              </div>
              <p className="text-xs opacity-70 mt-0.5 leading-snug">
                מתודיקה והדרכה: 10 חוקי ברזל למעגל, שבירת שגרה בהליכה ו-ODT
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all self-center" />
          </button>

          {/* Menu Item 3: Personal Pakal (Favorites) */}
          <button
            onClick={() => {
              setActiveSituation('pakal');
              closeSideDrawer();
            }}
            className={`w-full p-3 rounded-2xl border text-right transition-all flex items-start gap-3 group ${
              isCampfire 
                ? 'bg-stone-900/60 border-stone-800 hover:border-amber-500/50 hover:bg-stone-900' 
                : 'bg-amber-50/50 border-amber-200/80 hover:border-amber-400 hover:bg-amber-50'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              isCampfire ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
            }`}>
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-stone-900 dark:text-white">הפק"ל האישי שלי</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  אישי
                </span>
              </div>
              <p className="text-xs opacity-70 mt-0.5 leading-snug">
                חידות ושאלות שסימנת בכוכב לקראת היציאה לשטח
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all self-center" />
          </button>

          {/* Menu Item 4: About & PWA */}
          <button
            onClick={openAboutModal}
            className={`w-full p-3 rounded-2xl border text-right transition-all flex items-start gap-3 group ${
              isCampfire 
                ? 'bg-stone-900/60 border-stone-800 hover:border-cyan-500/50 hover:bg-stone-900' 
                : 'bg-sky-50/50 border-sky-200/80 hover:border-sky-400 hover:bg-sky-50'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              isCampfire ? 'bg-cyan-500/20 text-cyan-400' : 'bg-sky-100 text-sky-700'
            }`}>
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-stone-900 dark:text-white">אודות והתקנת אפליקציה</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-700 dark:text-sky-300">
                  PWA
                </span>
              </div>
              <p className="text-xs opacity-70 mt-0.5 leading-snug">
                חזון המיזם, קרדיט ליוצר ומדריך התקנה מהיר למסך הבית
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all self-center" />
          </button>

          {/* Divider */}
          <div className="border-t my-3 opacity-25" />

          {/* Quick Settings Section */}
          <div className={`p-3.5 rounded-2xl border space-y-3 ${
            isCampfire ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <span className="text-[11px] font-black uppercase tracking-wider opacity-60 block">
              ⚙️ הגדרות שטח מהירות
            </span>

            {/* Text Size Stepper */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">גודל טקסט:</span>
              <div className={`grid grid-cols-3 gap-1 p-0.5 rounded-xl border ${
                isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-stone-300'
              }`}>
                <button
                  onClick={() => setTextSize('normal')}
                  className={`py-1 px-2.5 rounded-lg text-sm font-bold transition-all ${
                    textSize === 'normal'
                      ? isCampfire ? 'bg-orange-600 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  א
                </button>
                <button
                  onClick={() => setTextSize('large')}
                  className={`py-1 px-2.5 rounded-lg text-sm font-bold transition-all ${
                    textSize === 'large'
                      ? isCampfire ? 'bg-orange-600 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  א+
                </button>
                <button
                  onClick={() => setTextSize('huge')}
                  className={`py-1 px-2.5 rounded-lg text-sm font-bold transition-all ${
                    textSize === 'huge'
                      ? isCampfire ? 'bg-orange-600 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  א++
                </button>
              </div>
            </div>

            {/* Random Order Switch */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-200/40 dark:border-stone-800">
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">ערבוב שאלות:</span>
              <div className="flex items-center gap-1">
                {randomOrderEnabled && (
                  <button
                    onClick={reshuffleDeviceSeed}
                    title="ערבב מחדש את השאלות"
                    className={`p-1 rounded-lg border transition-all ${
                      isCampfire 
                        ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white' 
                        : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={toggleRandomOrder}
                  className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all ${
                    randomOrderEnabled
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isCampfire
                        ? 'bg-stone-800 text-stone-400'
                        : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {randomOrderEnabled ? 'אקראי 🎲' : 'מקורי 📚'}
                </button>
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-200/40 dark:border-stone-800">
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">צלילי מערכת:</span>
              <button
                onClick={toggleSound}
                className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                  soundEnabled
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isCampfire
                      ? 'bg-stone-800 text-stone-400'
                      : 'bg-stone-200 text-stone-600'
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>מופעל</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>מושתק</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Feedback & Suggestion Drawer Button */}
          <button
            onClick={() => {
              closeSideDrawer();
              openFeedbackDrawer();
            }}
            className={`w-full p-3 rounded-2xl border text-right transition-all flex items-center justify-between ${
              isCampfire 
                ? 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300' 
                : 'border-amber-300 bg-amber-100/70 hover:bg-amber-200/70 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-extrabold">יש לך רעיון לחידה או שיפור?</span>
            </div>
            <span className="text-xs opacity-75">←</span>
          </button>

        </div>

        {/* Drawer Footer */}
        <div className={`p-3 pb-safe border-t text-center text-[11px] opacity-65 shrink-0 ${
          isCampfire ? 'border-stone-800 bg-stone-900/40' : 'border-amber-100 bg-amber-50/40'
        }`}>
          שלוף פק"ל הדרכה • נוצר ע״י נתנאל נסים (Netanel Nissim)
        </div>

      </aside>
    </>
  );
};
