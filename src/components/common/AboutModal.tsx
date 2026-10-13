import React from 'react';
import { X, Heart, ShieldCheck, WifiOff, Smartphone, Sparkles, Send, Compass } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

export const AboutModal: React.FC = () => {
  const { isAboutModalOpen, closeAboutModal, themeMode, openFeedbackDrawer } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  if (!isAboutModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={closeAboutModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div 
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors select-none ${
          isCampfire 
            ? 'bg-stone-950 border-stone-800 text-orange-100 shadow-orange-950/40' 
            : 'bg-white border-amber-200 text-stone-900 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isCampfire ? 'border-stone-800 bg-stone-900/50' : 'border-amber-100 bg-amber-50/60'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
              isCampfire 
                ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-orange-950' 
                : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-300'
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 id="about-modal-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5">
                <span>אודות שלוף פק"ל</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  v2.4
                </span>
              </h2>
              <p className="text-xs opacity-75 font-medium">פק"ל שטח, הפעלות וחידות למדריכים</p>
            </div>
          </div>

          <button
            onClick={closeAboutModal}
            className={`p-2 rounded-full transition-colors ${
              isCampfire ? 'hover:bg-stone-800 text-stone-400 hover:text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
            }`}
            aria-label="סגור חלון אודות"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs leading-relaxed">
          
          {/* Creator & Developer Credit */}
          <div className={`p-4 rounded-2xl border ${
            isCampfire 
              ? 'bg-gradient-to-br from-stone-900 to-stone-950 border-orange-500/30' 
              : 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200'
          }`}>
            <div className="flex items-center gap-2 text-amber-600 dark:text-orange-400 font-extrabold text-sm mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>יוצר ומפתח המיזם</span>
            </div>
            <div className="text-base font-black text-stone-900 dark:text-white tracking-wide">
              Netanel Nissim (נתנאל נסים)
            </div>
            <p className="opacity-80 mt-1">
              פותח באהבה ובמסירות עבור מדריכי שטח, תנועות נוער, מורים, שנות שירות ומטיילים ברחבי ארץ ישראל. המיזם נועד לספק ארגז כלים איכותי, מהיר וחינמי שפועל באופן מלא גם ללא חיבור לאינטרנט.
            </p>
          </div>

          {/* 100% Offline Guarantee */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isCampfire ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-500 shrink-0 mt-0.5">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900 dark:text-white">100% עבודה אופליין בשטח</div>
              <p className="opacity-75 mt-0.5">
                כל החידות, המשחקים, ההפעלות ומערכי ה-ODT שמורים באופן מקומי במכשירך. האפליקציה פועלת בצורה מלאה גם בעומק נחלים, במדבר או במסלולים מרוחקים ללא קליטה סלולרית.
              </p>
            </div>
          </div>

          {/* PWA Home Screen Installation Guide */}
          <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
            isCampfire ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-white">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>התקנה מהירה כאפליקציה למסך הבית (PWA)</span>
            </div>

            <div className="space-y-1.5 opacity-85 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 dark:text-stone-200">🍏 באייפון (Safari):</span>
                <span>לחצו על כפתור השיתוף בתחתית המסך ⬅️ ״הוספה למסך הבית״.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 dark:text-stone-200">🤖 באנדרואיד (Chrome):</span>
                <span>לחצו על 3 הנקודות בראש הדפדפן ⬅️ ״התקנת אפליקציה״ או ״הוספה למסך הבית״.</span>
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
            isCampfire ? 'bg-stone-900/40 border-stone-800/80' : 'bg-stone-50/80 border-stone-200/80'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-[11px] opacity-75">
              פרטיות מלאה • אפס מעקב • תוכן מאובטח ומוצפן בטלפון
            </span>
          </div>

        </div>

        {/* Footer Button */}
        <div className={`p-3.5 sm:p-4 border-t flex items-center justify-between shrink-0 ${
          isCampfire ? 'border-stone-800 bg-stone-900/40' : 'border-amber-100 bg-amber-50/40'
        }`}>
          <div className="flex items-center gap-1 text-[11px] opacity-60">
            <span>נבנה עם</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>למען המדריכים</span>
          </div>

          <button
            onClick={() => {
              closeAboutModal();
              openFeedbackDrawer();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isCampfire 
                ? 'bg-orange-600 text-white hover:bg-orange-500' 
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>שליחת משוב</span>
          </button>
        </div>

      </div>
    </div>
  );
};
