import React from 'react';
import { X, CheckCircle2, XCircle, HelpCircle, Users, Footprints, Flame, Sparkles } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface TrueFalseInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrueFalseInstructionsModal: React.FC<TrueFalseInstructionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { themeMode } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Dialog */}
      <div 
        className={`relative w-full max-w-lg rounded-3xl border-2 p-5 sm:p-6 shadow-2xl z-10 max-h-[88vh] max-h-[88dvh] flex flex-col overflow-hidden transition-all text-right ${
          isCampfire 
            ? 'bg-stone-950 border-emerald-900/60 text-stone-100 shadow-emerald-950/80' 
            : 'bg-white border-emerald-300 text-stone-900 shadow-2xl'
        }`}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="true-false-instructions-title"
      >
        {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${
            isCampfire ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <HelpCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 id="true-false-instructions-title" className="text-lg sm:text-xl font-extrabold tracking-tight">
              איך מפעילים "נכון או לא נכון" בשטח?
            </h2>
            <p className="text-xs text-stone-400">
              משחק טריוויה מהיר ודינמי שאינו דורש שום ציוד (152 טענות שטח)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="סגור חלון הסבר"
          className={`p-2 rounded-full transition-colors ${
            isCampfire ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-100 text-stone-600'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body with scrolling */}
      <div className="overflow-y-auto py-4 space-y-4 text-xs sm:text-sm leading-relaxed">
        
        {/* 1. גרסת הטור בהליכה */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${
          isCampfire ? 'bg-stone-900/80 border-stone-800' : 'bg-emerald-50/70 border-emerald-200'
        }`}>
          <div className="flex items-center gap-2 mb-1.5 font-bold text-emerald-700 dark:text-emerald-400">
            <Footprints className="w-4 h-4 shrink-0" />
            <span>1. גרסת הטור בהליכה (בזמן צעידה בשביל):</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300">
            המדריך צועד באמצע או בראש הטור ומקריא טענה בקול רם:
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2 font-bold text-xs">
            <div className="p-2 rounded-xl bg-emerald-600 text-white flex items-center gap-1.5 justify-center">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>נכון = יד ימין למעלה / צד ימין</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-600 text-white flex items-center gap-1.5 justify-center">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>לא נכון = יד שמאל למעלה / צד שמאל</span>
            </div>
          </div>
        </div>

        {/* 2. גרסת הפסילות במעגל */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${
          isCampfire ? 'bg-stone-900/80 border-stone-800' : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex items-center gap-2 mb-1.5 font-bold text-amber-700 dark:text-amber-400">
            <Users className="w-4 h-4 shrink-0" />
            <span>2. גרסת הפסילות בעצירת צל / מנוחה:</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300">
            החניכים עומדים במעגל רחב. המדריך מקריא היגד:
          </p>
          <ul className="list-disc list-inside mt-1.5 space-y-1 text-stone-600 dark:text-stone-300">
            <li><strong>נכון:</strong> שמים שתי ידיים על הראש.</li>
            <li><strong>לא נכון:</strong> שמים ידיים על המותניים או כורעים.</li>
            <li><strong>טעות:</strong> מי שטועה מבצע משימה היתולית קצרה (שלוק מים מודרך, סיפור בדיחה או הובלת השיירה).</li>
          </ul>
        </div>

        {/* 3. גרסת הבלוף וההסבר המחכים */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${
          isCampfire ? 'bg-stone-900/80 border-stone-800' : 'bg-purple-50/70 border-purple-200'
        }`}>
          <div className="flex items-center gap-2 mb-1.5 font-bold text-purple-700 dark:text-purple-400">
            <Flame className="w-4 h-4 shrink-0" />
            <span>3. גרסת הבלוף וסודות השטח (מסביב למדורה):</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300">
            המדריך מקריא עובדה שנשמעת מופרכת אך היא אמיתית לחלוטין (למשל: שפן הסלע הוא קרוב משפחה של הפיל!), או עובדה שנשמעת הגיונית אך שקרית לגמרי (למשל: מכתש רמון נוצר ממטאוריט).
          </p>
          <p className="mt-1 text-xs text-purple-700 dark:text-purple-300 font-medium">
            💡 לחיצה על "חשוף תשובה" מציגה את ההסבר המלא והמלמד לחניכים.
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>הבנתי, בואו נתחיל לשחק!</span>
        </button>
      </div>
    </div>
  </div>
  );
};
