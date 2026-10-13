import React, { useState } from 'react';
import { X, Tent, ChevronDown, ChevronUp, Lightbulb, Compass, Users, Sparkles, Moon, Trophy } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface GuideTipItem {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  content: string;
}

const GUIDE_TIPS: GuideTipItem[] = [
  {
    id: 'tip-circle',
    title: '1. ניהול מעגל קשוב ושיתוף השקטים',
    icon: '⭕',
    subtitle: 'איך לשאול חידה בלי שהצעקן הראשון יקלקל לכולם',
    content: 'כאשר אתם שואלים חידה במעגל, תנו הוראה ברורה מראש: "יש לכולם 30 שניות לחשוב בלב בלי לצעוק תשובה. מי שיודע — מרים אגודל". הכלל הזה מונע מחניכים דומיננטיים להשתלט, ומאפשר לחניכים שקטים או מעמיקים להשתתף בשמחה.'
  },
  {
    id: 'tip-walking',
    title: '2. שבירת שגרה בהליכה בטור',
    icon: '🥾',
    subtitle: 'הקבוצה נמרחת בשביל? משחק נכון/לא נכון מציל את הקצב',
    content: 'בזמן צעידה ארוכה ומעייפת, עצרו את הראש של הטור לרגע והפעילו שאלה מתוך משחק "נכון או לא נכון". תנו משימה פיזית: "מי שחושב שנכון — צעד קדימה, מי שחושב שלא — נשאר במקום". זה מחזיר מיד את הריכוז ומכניס אנרגיה מחודשת.'
  },
  {
    id: 'tip-teams',
    title: '3. חלוקה מהירה לקבוצות ללא ציוד',
    icon: '👥',
    subtitle: 'חלוקה הוגנת בשניות בלי ויכוחים',
    content: 'לפני תחרות טאבו או ODT, חלקו את הקבוצה לפי חודשי לידה (ינואר-יוני מול יולי-דצמבר) או לפי "שוקולד למריחה מול חמאת בוטנים". זה יוצר שוויון אקראי, שובר קליקות חברתיות ומייצר צחוק ראשוני עוד לפני שהמשחק התחיל.'
  },
  {
    id: 'tip-campfire',
    title: '4. הדרכת לילה סביב המדורה',
    icon: '🔥',
    subtitle: 'שמירה על ראיית לילה ואווירה אינטימית',
    content: 'בפעילות לילה, מסך טלפון בוהק מסנוור את כל המעגל והורס את אווירת המדורה. הפעילו את "מצב מדורה" (אייקון הלהבה בראש האתר) כדי לעבור לגווני שחור ולהבה כהים שאינם פוגעים בראיית הלילה ומאפשרים לכם להקריא בנחת.'
  },
  {
    id: 'tip-odt',
    title: '5. עיבוד ורפלקציה במשימות ODT',
    icon: '🧭',
    subtitle: 'הערך האמיתי נוצר ב-2 הדקות שאחרי המשימה',
    content: 'משימת ODT בלי שיחת עיבוד היא רק משחק חולף. בסיום כל משימה, שאלו 3 שאלות ממוקדות: 1. "מה עבד לכם טוב בהתחלה?" 2. "איפה היה הרגע שהתקשורת נשברה?" 3. "מה ניקח מזה להמשך המסלול?". הקשיבו לחניכים בלי לשפוט.'
  },
  {
    id: 'tip-visual',
    title: '6. חידות בציורים במעגל שטח',
    icon: '🎨',
    subtitle: 'השתמשו במצב מקרן/הגדלה להעברת הטלפון בסבב',
    content: 'בחידות בציורים, לחצו על כפתור "הפעל במעגל" כדי לפתוח את התמונה במסך מלא ונקי. החזיקו את הטלפון בגובה החזה והסתובבו במעגל, או העבירו את הטלפון יד ביד. התמונה נקייה מהפתרון כך שאין חשש מהצצה מוקדמת.'
  },
  {
    id: 'tip-taboo',
    title: '7. כללי הגינות בתחרות טאבו שטח',
    icon: '🏆',
    subtitle: 'הגדירו מראש חוקי שטח ברורים',
    content: 'בטאבו שטח, הבהירו לקבוצות מראש: מותר לתאר במשפטים ובסיפורים, אך אסור להשתמש בחרוזים ("נשמע כמו..."), באותיות ראשונות או בתנועות פנטומימה. זה שומר על רמת אתגר גבוהה ומעודד יצירתיות שפתית.'
  },
  {
    id: 'tip-prep',
    title: '8. הכנת מסלול מראש עם "הפק"ל שלי"',
    icon: '⭐',
    subtitle: 'הכנה מוקדמת של 3 דקות בבית חוסכת גמגום בשטח',
    content: 'לפני היציאה לטיול, סמנו בכוכב (⭐) 4-5 חידות מתאימות לאופי המסלול (למשל חידות על מים ועצים למסלול נחל). בעצירת הקפה, היכנסו ללשונית "הפק"ל שלי" ותוכלו להפעיל את כל התוכן ברצף מוכן ומסודר.'
  }
];

export const GuideTipsModal: React.FC = () => {
  const { isGuideTipsModalOpen, closeGuideTipsModal, themeMode } = usePakalStore();
  const [expandedId, setExpandedId] = useState<string>('tip-circle');
  const isCampfire = themeMode === 'campfire';

  if (!isGuideTipsModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={closeGuideTipsModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-tips-modal-title"
    >
      <div 
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors select-none ${
          isCampfire 
            ? 'bg-black border-zinc-800 text-zinc-100 shadow-black' 
            : 'bg-white border-emerald-200 text-stone-900 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isCampfire ? 'border-zinc-800 bg-zinc-950/80' : 'border-emerald-100 bg-emerald-50/60'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
              isCampfire 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-black' 
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-200'
            }`}>
              <Tent className="w-5 h-5" />
            </div>
            <div>
              <h2 id="guide-tips-modal-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5">
                <span>פק"ל טיפים למדריך</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  מתודיקה
                </span>
              </h2>
              <p className="text-xs opacity-75 font-medium">עקרונות זהב להדרכה והפעלת מעגלים בשטח</p>
            </div>
          </div>

          <button
            onClick={closeGuideTipsModal}
            className={`p-2 rounded-full transition-colors ${
              isCampfire ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-stone-100 text-stone-500 hover:text-stone-900'
            }`}
            aria-label="סגור טיפים למדריך"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tips Accordion List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {GUIDE_TIPS.map((tip) => {
            const isExpanded = expandedId === tip.id;
            return (
              <div
                key={tip.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? isCampfire
                      ? 'bg-zinc-900/90 border-emerald-500/50 shadow-md'
                      : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                    : isCampfire
                      ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                      : 'bg-white border-stone-200 hover:border-emerald-200'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? '' : tip.id)}
                  className="w-full p-3.5 flex items-center justify-between text-right gap-2.5 focus:outline-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{tip.icon}</span>
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                        {tip.title}
                      </div>
                      <div className="text-[11px] opacity-70 truncate font-medium mt-0.5">
                        {tip.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="p-1 rounded-lg text-stone-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className={`px-4 pb-4 pt-1 text-xs leading-relaxed border-t ${
                    isCampfire ? 'border-zinc-800/60 text-zinc-300' : 'border-emerald-200/60 text-stone-700'
                  }`}>
                    {tip.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-3.5 border-t text-center text-[11px] opacity-65 shrink-0 ${
          isCampfire ? 'border-zinc-800 bg-zinc-950/80' : 'border-emerald-100 bg-emerald-50/30'
        }`}>
          💡 זכרו: מדריך טוב הוא מדריך שמקשיב לשטח ויוצר חיבור בין החניכים!
        </div>

      </div>
    </div>
  );
};
