import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface TourStep {
  targetSelector: string;
  title: string;
  icon: string;
  description: string;
  preferredPosition: 'top' | 'bottom';
  roundedClass: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="tour-games"]',
    title: 'משחקי שטח ותחרויות קבוצתיות',
    icon: '🏆',
    description: 'טאבו שטח עם טיימר וצפצופים, משחק נכון/לא נכון להליכה בטור, וחידות בציורים. הכל מובנה ומוכן להפעלה מיידית במעגל ללא שום ציוד!',
    preferredPosition: 'bottom',
    roundedClass: 'rounded-2xl'
  },
  {
    targetSelector: '[data-tour="tour-visual"]',
    title: 'חידות בציורים ואימוני ODT',
    icon: '🎨',
    description: '154 חידות ויזואליות עם זום ומצב מקרן, ו-101 מתודות שטח לפיתוח מנהיגות וגיבוש עם טיימר משימות משולב.',
    preferredPosition: 'bottom',
    roundedClass: 'rounded-2xl'
  },
  {
    targetSelector: '[data-tour="tour-fab"]',
    title: 'שליפה מהירה למעגל',
    icon: '🎲',
    description: 'נמצאים באמצע צעידה בשביל או בהפסקת קפה? לחיצה כאן שולפת מיד שאלה אקראית לשבירת שגרה. האפליקציה פועלת 100% אופליין – חלקה לחלוטין גם בעומק נחל או במדבר ללא אינטרנט כלל!',
    preferredPosition: 'top',
    roundedClass: 'rounded-full'
  },
  {
    targetSelector: '[data-tour="tour-situations"]',
    title: 'חידות מותאמות לרגע',
    icon: '🧭',
    description: 'סינון מהיר של תכנים מותאמים לרגע: נסיעה ארוכה באוטובוס, צעידה בשביל, עצירה במעיין או שבירת קרח.',
    preferredPosition: 'bottom',
    roundedClass: 'rounded-2xl'
  },
  {
    targetSelector: '[data-tour="tour-pakal"]',
    title: 'הפק"ל האישי שלך למסלול',
    icon: '⭐',
    description: 'סמנו כל חידה או הפעלה בכוכב כדי להרכיב מערך הדרכה אישי מראש. בלחיצה אחת תוכלו לשתף את כל המערך לוואטסאפ של המדריכים. כל התוכן שמור במכשיר ללא אינטרנט כלל!',
    preferredPosition: 'top',
    roundedClass: 'rounded-2xl'
  },
  {
    targetSelector: '[data-tour="tour-text-size"]',
    title: 'התאמת גודל טקסט לשטח',
    icon: '🔍',
    description: 'השמש מסנוורת או שאתה מקריא תוך כדי תנועה? ניתן להגדיל את הטקסט ל-115% או 130% בלחיצה אחת.',
    preferredPosition: 'bottom',
    roundedClass: 'rounded-xl'
  },
  {
    targetSelector: '[data-tour="tour-campfire"]',
    title: 'מצב מדורה לראיית לילה',
    icon: '⛺',
    description: 'פעילות לילה סביב המדורה? מעבר לתצוגה כהה בגווני להבה שאינה מסנוורת את החניכים במעגל הלילי.',
    preferredPosition: 'bottom',
    roundedClass: 'rounded-xl'
  },
  {
    targetSelector: '[data-tour="tour-feedback"]',
    title: 'הגדרות שטח, ערבוב ומשוב',
    icon: '💡',
    description: 'כאן תוכלו לערבב מחדש את סדר השאלות בכל רגע, להתאים הגדרות, או לשלוח רעיון וחידה חדשה ישירות למפתחים בלחיצה אחת!',
    preferredPosition: 'bottom',
    roundedClass: 'rounded-xl'
  }
];

export const OnboardingTour: React.FC = () => {
  const { 
    isOnboardingActive, 
    currentTourStep, 
    nextTourStep, 
    prevTourStep, 
    skipTour, 
    completeTour,
    themeMode 
  } = usePakalStore();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top?: number; bottom?: number; left: number; arrowPosition: 'top' | 'bottom'; arrowLeft: number }>({
    top: 100,
    left: 20,
    arrowPosition: 'top',
    arrowLeft: 50
  });

  const tooltipRef = useRef<HTMLDivElement>(null);
  const isCampfire = themeMode === 'campfire';

  const updatePosition = useCallback(() => {
    if (!isOnboardingActive) return;
    const currentStep = TOUR_STEPS[currentTourStep];
    if (!currentStep) return;

    const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    const tooltipWidth = Math.min(340, window.innerWidth - 32);
    const tooltipHeight = 210; // Estimated height for calculations

    // Calculate horizontal center
    const targetCenterX = rect.left + rect.width / 2;
    let left = targetCenterX - tooltipWidth / 2;

    // Constrain left within screen padding
    const minLeft = 16;
    const maxLeft = window.innerWidth - tooltipWidth - 16;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    // Calculate arrow relative position
    const arrowLeft = Math.max(16, Math.min(targetCenterX - left, tooltipWidth - 16));

    // Vertical placement logic: flip if overflows viewport
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let position = currentStep.preferredPosition;
    if (position === 'bottom' && spaceBelow < tooltipHeight + 20 && spaceAbove > spaceBelow) {
      position = 'top';
    } else if (position === 'top' && spaceAbove < tooltipHeight + 20 && spaceBelow > spaceAbove) {
      position = 'bottom';
    }

    if (position === 'bottom') {
      setTooltipPos({
        top: Math.min(rect.bottom + 12, window.innerHeight - tooltipHeight - 16),
        left,
        arrowPosition: 'top',
        arrowLeft
      });
    } else {
      setTooltipPos({
        bottom: Math.max(window.innerHeight - rect.top + 12, 16),
        left,
        arrowPosition: 'bottom',
        arrowLeft
      });
    }
  }, [isOnboardingActive, currentTourStep]);

  // Scroll to element & update rect on step change
  useEffect(() => {
    if (!isOnboardingActive) return;

    const currentStep = TOUR_STEPS[currentTourStep];
    if (!currentStep) return;

    const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
    if (el) {
      // Smooth scroll if element is not fully in view
      const inView = (
        el.getBoundingClientRect().top >= 0 &&
        el.getBoundingClientRect().bottom <= window.innerHeight
      );
      if (!inView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Initial update and delayed update after smooth scroll settles
    updatePosition();
    const timer = setTimeout(updatePosition, 180);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOnboardingActive, currentTourStep, updatePosition]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOnboardingActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        skipTour();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextTourStep();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        prevTourStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOnboardingActive, nextTourStep, prevTourStep, skipTour]);

  if (!isOnboardingActive) return null;

  const currentStep = TOUR_STEPS[currentTourStep];
  if (!currentStep) return null;

  const isLastStep = currentTourStep === TOUR_STEPS.length - 1;
  const padding = 6; // Extra breathing room around highlighted element

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden transition-opacity duration-300"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="סיור קליטה מודרך"
    >
      {/* Semi-transparent Backdrop click to dismiss */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-all"
        onClick={skipTour}
        aria-hidden="true"
      />

      {/* Target Spotlight Highlight (Box-shadow cutout spotlight) */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.72)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className={`pointer-events-none z-50 ${currentStep.roundedClass} ring-4 ${
            isCampfire 
              ? 'ring-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.6)]' 
              : 'ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
          } animate-pulse`}
        />
      )}

      {/* Floating Coach-Mark Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          top: tooltipPos.top !== undefined ? `${tooltipPos.top}px` : undefined,
          bottom: tooltipPos.bottom !== undefined ? `${tooltipPos.bottom}px` : undefined,
          left: `${tooltipPos.left}px`,
          width: Math.min(340, window.innerWidth - 32),
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className={`z-50 rounded-2xl p-5 border-2 shadow-2xl transition-all ${
          isCampfire 
            ? 'bg-stone-950 border-orange-500/60 text-stone-100 shadow-orange-950/80' 
            : 'bg-white border-amber-300 text-stone-900 shadow-2xl'
        }`}
      >
        {/* Tooltip Arrow Pointer */}
        <div
          style={{
            left: `${tooltipPos.arrowLeft}px`,
            transform: 'translateX(-50%) rotate(45deg)'
          }}
          className={`absolute w-3.5 h-3.5 border-2 ${
            tooltipPos.arrowPosition === 'top'
              ? `-top-[8px] ${isCampfire ? 'bg-stone-950 border-t-orange-500/60 border-l-orange-500/60 border-b-transparent border-r-transparent' : 'bg-white border-t-amber-300 border-l-amber-300 border-b-transparent border-r-transparent'}`
              : `-bottom-[8px] ${isCampfire ? 'bg-stone-950 border-b-orange-500/60 border-r-orange-500/60 border-t-transparent border-l-transparent' : 'bg-white border-b-amber-300 border-r-amber-300 border-t-transparent border-l-transparent'}`
          }`}
        />

        {/* Header: Step counter pill & Close button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
              isCampfire
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              תחנה {currentTourStep + 1} מתוך {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={skipTour}
            aria-label="סגור סיור"
            title="סגור סיור (דלג)"
            className={`p-1 rounded-lg transition-colors ${
              isCampfire ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-100 text-stone-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Title & Description */}
        <div className="space-y-1.5 mb-4">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <span className="text-lg leading-none">{currentStep.icon}</span>
            <span>{currentStep.title}</span>
          </h3>
          <p className={`text-xs leading-relaxed ${isCampfire ? 'text-stone-300' : 'text-stone-600'}`}>
            {currentStep.description}
          </p>
        </div>

        {/* Footer: Progress dots & Navigation buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 dark:border-stone-800">
          {/* Step dots */}
          <div className="flex items-center gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentTourStep
                    ? isCampfire ? 'w-5 bg-orange-500' : 'w-5 bg-amber-600'
                    : isCampfire ? 'w-1.5 bg-stone-700' : 'w-1.5 bg-stone-300'
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Skip button */}
            <button
              onClick={skipTour}
              className={`text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${
                isCampfire 
                  ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-900' 
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              דלג
            </button>

            {/* Previous step (disabled on step 0) */}
            {currentTourStep > 0 && (
              <button
                onClick={prevTourStep}
                aria-label="לתחנה הקודמת"
                className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
                  isCampfire
                    ? 'border-stone-700 bg-stone-900 text-stone-300 hover:bg-stone-800'
                    : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Next or Complete button */}
            <button
              onClick={isLastStep ? completeTour : nextTourStep}
              className={`py-1.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1 active:scale-95 ${
                isCampfire
                  ? 'bg-orange-600 hover:bg-orange-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isLastStep ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>הבנתי, קדימה לשטח!</span>
                </>
              ) : (
                <>
                  <span>הבא</span>
                  <ChevronLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
