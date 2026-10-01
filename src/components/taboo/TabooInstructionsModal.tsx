import React from 'react';
import { X, EyeOff, Ban, Trophy, Users, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface TabooInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TabooInstructionsModal: React.FC<TabooInstructionsModalProps> = ({
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
            ? 'bg-stone-950 border-amber-900/60 text-stone-100 shadow-orange-950/80' 
            : 'bg-white border-amber-300 text-stone-900 shadow-2xl'
        }`}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="taboo-instructions-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${
              isCampfire ? 'bg-orange-600/20 text-orange-400' : 'bg-amber-100 text-amber-800'
            }`}>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 id="taboo-instructions-title" className="text-lg sm:text-xl font-extrabold tracking-tight">
                איך משחקים טאבו שטח?
              </h2>
              <p className="text-xs text-stone-400">
                מדריך מהיר להפעלת המשחק במעגל סביב המדורה או בהפסקה
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="סגור חלון הסבר"
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Rules Content */}
        <div className="overflow-y-auto py-3 space-y-4 pr-1 text-sm leading-relaxed">
          
          {/* Rule 1: The Golden Rule (Stealth Screen) */}
          <div className={`p-3.5 rounded-2xl border flex gap-3 items-start ${
            isCampfire 
              ? 'bg-amber-950/30 border-amber-700/50 text-amber-200' 
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 shrink-0 mt-0.5">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm mb-0.5">
                כלל הברזל: רק המסביר מביט במסך!
              </h3>
              <p className="text-xs opacity-90">
                שחקן אחד מחזיק את הטלפון ומסתיר את המסך מהמעגל. שאר החניכים אינם רואים את הכרטיס וחייבים לנחש אך ורק לפי ההסבר המילולי שלו.
              </p>
            </div>
          </div>

          {/* Rule 2: Objective & Taboo Words */}
          <div className={`p-3.5 rounded-2xl border flex gap-3 items-start ${
            isCampfire 
              ? 'bg-red-950/20 border-red-900/50 text-stone-200' 
              : 'bg-red-50/70 border-red-200 text-stone-800'
          }`}>
            <div className="p-2 rounded-xl bg-red-500/20 text-red-500 shrink-0 mt-0.5">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm mb-0.5 text-red-600 dark:text-red-400">
                המילים האסורות (ה"טאבו")
              </h3>
              <p className="text-xs opacity-90">
                על המסביר לתאר את <strong>מילת המטרה</strong> שבראש הכרטיס, אך <strong>אסור לו באיסור מוחלט</strong> להגיד אף אחת מ-4 המילים המסומנות ב-✕ באדום!
              </p>
              <div className="mt-2 text-[11px] p-2 rounded-lg bg-black/10 dark:bg-black/40 font-mono">
                💡 <em>למשל עבור "מצפן":</em> אסור להגיד "צפון", "מחט", "כיוון", "ניווט".
              </div>
            </div>
          </div>

          {/* Rule 3: Strict Field Fouls */}
          <div className={`p-3.5 rounded-2xl border ${
            isCampfire ? 'bg-stone-900/80 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <h3 className="font-extrabold text-xs mb-2 flex items-center gap-1.5 text-stone-400">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>חוקי פסילה נוספים:</span>
            </h3>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-stone-600 dark:text-stone-300">
              <li><strong>בלי תנועות ידיים:</strong> אסור פנטומימה או סימונים באצבעות.</li>
              <li><strong>בלי חרוזים:</strong> אסור להגיד "מתחרז עם..." או "נשמע כמו...".</li>
              <li><strong>בלי אותיות:</strong> אסור להגיד "מתחיל באות..." או להרכיב ראשי תיבות.</li>
              <li><strong>בלי תרגום:</strong> אסור להגיד את המילה בשפה אחרת (אנגלית, ערבית וכו').</li>
            </ul>
          </div>

          {/* Rule 4: Round flow and scoring */}
          <div className={`p-3.5 rounded-2xl border flex gap-3 items-start ${
            isCampfire ? 'bg-stone-900/80 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm mb-0.5 text-emerald-600 dark:text-emerald-400">
                מהלך הסיבוב והניקוד
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                1. לוחצים <strong>התחל</strong> בטיימר.<br/>
                2. ניחשו נכון? לוחצים <strong>"הצלחה! (+1)"</strong> בירוק והכרטיס מתחלף מיד.<br/>
                3. הסתבכתם או פלטתם מילה אסורה? לוחצים <strong>"דלג / פסילה"</strong>.<br/>
                4. בתום הזמן סופרים את הנקודות ומעבירים את הטלפון לקבוצה הבאה!
              </p>
            </div>
          </div>

          {/* Rule 5: Team vs Free Play */}
          <div className={`p-3.5 rounded-2xl border flex gap-3 items-start ${
            isCampfire ? 'bg-stone-900/80 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-500 shrink-0 mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm mb-0.5 text-blue-600 dark:text-blue-400">
                מצב תחרות קבוצות ⚔️
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                מחלקים את המעגל לקבוצה א' וקבוצה ב'. כל קבוצה שולחת בתורה מסביר לדקה שלמה. האפליקציה מחשבת אוטומטית את הניקוד המצטבר של כל קבוצה!
              </p>
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 touch-press ${
              isCampfire
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>הבנתי, בואו נתחיל לשחק!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
