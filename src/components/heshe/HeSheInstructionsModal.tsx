import React from 'react';
import { X, Sparkles, BookOpen, Lightbulb, Users, CheckCircle2 } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface HeSheInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeSheInstructionsModal: React.FC<HeSheInstructionsModalProps> = ({ isOpen, onClose }) => {
  const { themeMode } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isCampfire 
            ? 'bg-stone-950 border-campfire-border/90 text-orange-100' 
            : 'bg-white border-sky-300 text-stone-900'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
          isCampfire ? 'border-stone-800 bg-stone-900/60' : 'border-sky-100 bg-sky-50/70'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isCampfire ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-600 text-white'
            }`}>
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg">איך משחקים "הוא והיא"?</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">חוקי המשחק והנחיות שטח למדריך</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors touch-press"
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm leading-relaxed">
          {/* Rule 1: The Essence */}
          <div className={`p-3.5 rounded-2xl border ${
            isCampfire ? 'bg-stone-900/40 border-stone-800' : 'bg-sky-50/50 border-sky-200'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1.5 text-sky-600 dark:text-sky-400">
              <BookOpen className="w-4 h-4" />
              <span>מהות המשחק – כפל משמעות בעברית</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              "הוא והיא" הוא משחק הלשון הקלאסי שבו הזכר והנקבה נגזרים מאותה מילה או צמד שורשים, אך מקבלים משמעויות שונות לגמרי בהקשר של המשפט!
            </p>
            <div className="mt-2.5 p-2 rounded-xl bg-white/70 dark:bg-black/40 border border-sky-200/50 dark:border-stone-800 text-xs space-y-1">
              <p>💡 <strong className="text-sky-700 dark:text-sky-300">לדוגמה:</strong> הוא כלי בישול במטבח, והיא שיח קוצני בשדה?</p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">⬅️ פתרון: סיר (הוא) | סירה (היא)!</p>
            </div>
          </div>

          {/* Rule 2: How to Run in Circle */}
          <div className={`p-3.5 rounded-2xl border ${
            isCampfire ? 'bg-stone-900/40 border-stone-800' : 'bg-amber-50/50 border-amber-200'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-600 dark:text-amber-400">
              <Users className="w-4 h-4" />
              <span>הפעלה במעגל או באוטובוס</span>
            </div>
            <ul className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 space-y-1.5 list-disc list-inside">
              <li>המדריך מקריא את ההגדרה בקול רם מול הקבוצה.</li>
              <li>החניכים מנסים לפצח את שני המושגים יחד.</li>
              <li>לחיצה על כפתור <strong>"חשוף פתרון"</strong> מציגה את שני הפתרונות יחד באופן מיידי.</li>
            </ul>
          </div>

          {/* Rule 3: Field Tip */}
          <div className={`p-3.5 rounded-2xl border ${
            isCampfire ? 'bg-stone-900/40 border-stone-800' : 'bg-emerald-50/50 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-600 dark:text-emerald-400">
              <Lightbulb className="w-4 h-4" />
              <span>טיפ שטח למדריך</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              החניכים מתקשים? רמזו להם את אחד מחלקי הצמד (למשל: "הוא מסור, אז מה היא?"), ותראו איך הניצוץ נדלק להם בעיניים!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t ${
          isCampfire ? 'border-stone-800 bg-stone-900/40' : 'border-stone-100 bg-stone-50'
        }`}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md hover:from-sky-500 hover:to-blue-500 transition-all touch-press flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>הבנתי, בואו נתחיל לשחק!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
