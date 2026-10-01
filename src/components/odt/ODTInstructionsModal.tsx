import React from 'react';
import { X, Compass, Target, Eye, MessageSquare, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface ODTInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ODTInstructionsModal: React.FC<ODTInstructionsModalProps> = ({
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
            ? 'bg-stone-950 border-orange-900/60 text-stone-100 shadow-orange-950/80' 
            : 'bg-white border-amber-300 text-stone-900 shadow-2xl'
        }`}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="odt-instructions-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${
              isCampfire ? 'bg-orange-600/20 text-orange-400' : 'bg-amber-100 text-amber-800'
            }`}>
              <Compass className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 id="odt-instructions-title" className="text-lg sm:text-xl font-extrabold tracking-tight">
                איך מפעילים מתודת ODT בשטח?
              </h2>
              <p className="text-xs text-stone-400">
                מודל 4 השלבים לפיתוח צוות, מנהיגות ואמון במסלול
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="סגור חלון הסבר"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 py-4 pr-1 text-sm leading-relaxed custom-scrollbar">
          
          {/* Intro Box */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isCampfire ? 'bg-orange-950/30 border-orange-900/50 text-orange-200' : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium">
              <strong>ODT (Outdoor Training)</strong> אינו סתם "משחק להעביר את הזמן", אלא כלי חינוכי חווייתי. ההצלחה תלויה פחות במנצחים ויותר ב<strong>עיבוד הערכי</strong> שלאחריו.
            </p>
          </div>

          {/* 4 Steps Methodology */}
          <div className="space-y-3">
            
            {/* Step 1 */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">1</span>
                <Target className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">הצגת האתגר וכללי הבטיחות</h3>
              </div>
              <p className="text-xs text-stone-300 dark:text-stone-300">
                ספרו סיפור מסגרת מושך (למשל: "חציית שדה מוקשים" או "חילוץ מנחל שוצף"). הגדירו מטרה ברורה, זמן מוקצב, וחוקי בטיחות נוקשים (ללא קפיצות מסוכנות, הקשבה לבן זוג).
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">2</span>
                <Eye className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">ביצוע עצמאי ללא התערבות</h3>
              </div>
              <p className="text-xs text-stone-300 dark:text-stone-300">
                תנו לקבוצה להתמודד בעצמה! אל תגלו פתרונות ואל תמהרו לעזור כשהם נתקעים. תנו להם לחוות את הקושי, לתקשר, לנסות ולהיכשל. התפקיד שלכם: השגחה ושמירה על בטיחות בלבד.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">3</span>
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">עיבוד ורפלקציה במעגל (Debriefing)</h3>
              </div>
              <p className="text-xs text-stone-300 dark:text-stone-300">
                הושיבו את כולם במעגל פנים אל פנים ושאלו שאלות מעוררות מחשבה:
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-stone-400 pr-4 list-disc">
                <li>"מה עבד לנו טוב ומה תסכל אותנו בהתחלה?"</li>
                <li>"האם כולם הרגישו שדעתם נשמעת?"</li>
                <li>"איך התמודדנו כשהתוכנית הראשונה נכשלה?"</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">4</span>
                <ArrowUpRight className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">השלכה לשטח ולחיים הקבוצתיים</h3>
              </div>
              <p className="text-xs text-stone-300 dark:text-stone-300">
                חברו את התובנה להמשך הטיול: "איך שיתוף הפעולה שראינו כאן יעזור לנו בעלייה התלולה הבאה? איך נדאג שאף חניך לא יישאר מאחור?".
              </p>
            </div>

          </div>

          {/* Quick Tip */}
          <div className="text-center p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            טיפ מנצח: התאימו את רמת המשימה לפי גודל הקבוצה והציוד הזמין בפילטרים שלמעלה.
          </div>

        </div>

        {/* Footer Action Button */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            הבנתי, בואו נתחיל פעילות
          </button>
        </div>

      </div>
    </div>
  );
};
