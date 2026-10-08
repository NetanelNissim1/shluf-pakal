import React from 'react';
import { X, Palette, Lightbulb, QrCode, Maximize2, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface VisualInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualInstructionsModal: React.FC<VisualInstructionsModalProps> = ({
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
        aria-labelledby="visual-instructions-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${
              isCampfire ? 'bg-orange-600/20 text-orange-400' : 'bg-amber-100 text-amber-800'
            }`}>
              <Palette className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 id="visual-instructions-title" className="text-lg sm:text-xl font-extrabold tracking-tight">
                איך פותרים ומפעילים חידות בציורים?
              </h2>
              <p className="text-xs text-stone-400">
                מדריך לפיצוח רבוסים והפעלת מעגלי חניכים בשטח
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
          
          {/* What is a Rebus Box */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3 ${
            isCampfire ? 'bg-orange-950/30 border-orange-900/50 text-orange-200' : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium">
              <strong>רֶבּוּס (Rebus)</strong> הוא אתגר חזותי שבו מילים, פתגמים ושמות מיוצגים באמצעות רצף של ציורים, סמלים, אותיות וסימנים. מחברים את הצלילים והמשמעויות לקבלת הביטוי השלם!
            </p>
          </div>

          {/* Key Principles */}
          <div className="space-y-3">
            
            {/* Rule 1 */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">1</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">פירוק צלילים ומשחקי מילים (פונטיקה)</h3>
              </div>
              <p className="text-xs text-stone-300 dark:text-stone-300">
                קראו כל סמל בקול רם: ציור של <strong>תפוח</strong> + אות <strong>בְּ</strong> + צנצנת <strong>דבש</strong> יוצרים יחד: <em>תפוח בדבש</em>. לעיתים ציור של "שושן" ו"בירה" ירכיבו את <em>שושן הבירה</em>.
              </p>
            </div>

            {/* Rule 2 */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">2</span>
                <Maximize2 className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">הצגה במעגל ומסך מלא למקרן</h3>
              </div>
              <p className="text-xs text-stone-300 dark:text-stone-300">
                לחצו על כפתור <strong>מסך מלא</strong> (או על הציור עצמו) כדי להציג את החידה בבירור לכל המעגל, בלי שהחניכים יראו את התשובה או את כפתורי המדריך.
              </p>
            </div>

            {/* Rule 3 */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">3</span>
                <QrCode className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">קוד QR שטח לסמארטפונים של החניכים</h3>
              </div>
              <p className="text-xs text-stone-300 dark:text-stone-300">
                אם הקבוצה גדולה או מפוזרת, לחצו על כפתור <strong>קוד QR</strong>. החניכים סורקים את הברקוד ומקבלים ישירות למכשיר שלהם <strong>תצוגת חניך נקייה ובטוחה</strong> שאינה חושפת את הפתרון!
              </p>
            </div>

            {/* Rule 4 */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isCampfire ? 'bg-stone-900/70 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center shrink-0">4</span>
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">שיטת הרמזים המדורגת</h3>
              </div>
              <p className="text-xs text-stone-300 dark:text-stone-300">
                אם המעגל מתקשה, אל תמהרו לגלות את הפתרון! לחצו על <strong>רמז מדורג</strong> כדי לתת כיוון מחשבה מעורר סקרנות.
              </p>
            </div>

          </div>

          {/* Quick Tip */}
          <div className="text-center p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            רעיון לתחרות: חלקו את הקבוצה לשני צוותים. הצוות הראשון שמפענח את הרבוס זוכה בנקודה!
          </div>

        </div>

        {/* Footer Action Button */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            הבנתי, בואו נפענח חידות
          </button>
        </div>

      </div>
    </div>
  );
};
