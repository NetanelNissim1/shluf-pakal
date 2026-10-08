import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Send, 
  X, 
  Building2, 
  Mail, 
  User, 
  MessageSquare, 
  AlertTriangle, 
  Zap,
  Shuffle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePakalStore } from '../../store/usePakalStore';
import { FeedbackCategory, FeedbackSubmission } from '../../types';
import { sendFeedback, checkFeedbackRateLimit, getFriendlyDeviceInfo, getOrCreateClientId } from '../../lib/feedback';
import { triggerHaptic } from '../../lib/haptics';
import { CATEGORIES as APP_CATEGORIES } from '../../data/categories';
import { NavTab } from '../layout/BottomNav';

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'riddle-idea', label: '💡 רעיון לחידה או תוכן', icon: Lightbulb },
  { id: 'site-improvement', label: '⚡ הצעה לייעול האתר', icon: Zap },
  { id: 'bug-report', label: '🐛 דיווח על שיבוש', icon: AlertTriangle },
  { id: 'general', label: '💬 משוב כללי', icon: MessageSquare }
];

interface FeedbackDrawerProps {
  currentTab?: NavTab;
}

export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({ currentTab = 'home' }) => {
  const { 
    isFeedbackDrawerOpen, 
    closeFeedbackDrawer, 
    savedFeedbackUser, 
    saveFeedbackUserInfo,
    showToast,
    themeMode,
    hapticsEnabled,
    randomOrderEnabled,
    toggleRandomOrder,
    reshuffleDeviceSeed
  } = usePakalStore();

  const [category, setCategory] = useState<FeedbackCategory>('riddle-idea');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [botTrap, setBotTrap] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize saved values when drawer opens
  useEffect(() => {
    if (isFeedbackDrawerOpen) {
      setName(savedFeedbackUser.name || '');
      setEmail(savedFeedbackUser.email || '');
      setOrganization(savedFeedbackUser.organization || '');
      setMessage('');
      setCategory('riddle-idea');
      setErrorMessage(null);
      setBotTrap('');
    }
  }, [isFeedbackDrawerOpen, savedFeedbackUser]);

  if (!isFeedbackDrawerOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!name.trim()) {
      setErrorMessage('נא למלא שם ושם משפחה');
      if (hapticsEnabled) triggerHaptic([50, 50]);
      return;
    }

    if (!message.trim()) {
      setErrorMessage('נא לכתוב את תוכן ההצעה או המשוב');
      if (hapticsEnabled) triggerHaptic([50, 50]);
      return;
    }

    // Rate Limiting check
    const rateLimit = checkFeedbackRateLimit();
    if (!rateLimit.allowed) {
      setErrorMessage(`נשלחו מספר פניות בזמן קצר. תודה על השיתוף! המערכת תאפשר שליחה נוספת בעוד ${rateLimit.remainingMinutes} דקות.`);
      if (hapticsEnabled) triggerHaptic([50, 50]);
      return;
    }

    const resolveCurrentScreenName = (): string => {
      const store = usePakalStore.getState();

      // Explicit Tab Resolution
      if (currentTab === 'taboo') return 'משחק טאבו שטח';
      if (currentTab === 'true-false') return 'משחק נכון / לא נכון';
      if (currentTab === 'odt') return 'פעילויות שטח ואימוני ODT';
      if (currentTab === 'visual') return 'חידות בציורים ורבוסים';
      if (currentTab === 'pakal') return 'הפק"ל שלי (מועדפים)';

      if (currentTab === 'categories') {
        if (store.activeCategory) {
          if (store.activeCategory === 'he-and-she') return 'קטגוריית שטח: חידות הוא והיא';
          const cat = APP_CATEGORIES.find((c) => c.id === store.activeCategory);
          return cat ? `קטגוריית שטח: ${cat.title}` : `קטגוריית שטח: ${store.activeCategory}`;
        }
        return 'קטגוריות תוכן שטח';
      }

      // Check situation filters if on home tab
      if (store.activeSituation === 'pakal') return 'הפק"ל שלי (מועדפים)';
      if (store.activeSituation === 'bus') return 'סינון: נסיעה באוטובוס';
      if (store.activeSituation === 'walking') return 'סינון: הליכה בשביל';
      if (store.activeSituation === 'campfire') return 'סינון: סביב המדורה';
      if (store.activeSituation === 'icebreaker') return 'סינון: שבירת קרח';
      if (store.activeSituation === 'holidays') return 'סינון: חגי ישראל';
      if (store.activeSituation === 'odt') return 'פעילויות שטח ואימוני ODT';
      if (store.activeSituation === 'visual') return 'חידות בציורים ורבוסים';

      return 'דף הבית';
    };

    const submission: FeedbackSubmission = {
      name: name.trim(),
      message: message.trim(),
      category,
      email: email.trim() || undefined,
      organization: organization.trim() || undefined,
      bot_trap: botTrap,
      currentScreen: resolveCurrentScreenName(),
      deviceInfo: getFriendlyDeviceInfo(),
      clientId: getOrCreateClientId()
    };

    // Save user info for future submissions
    saveFeedbackUserInfo({
      name: name.trim(),
      email: email.trim() || undefined,
      organization: organization.trim() || undefined
    });

    if (hapticsEnabled) triggerHaptic([30, 50, 40]);

    // Close the drawer immediately
    closeFeedbackDrawer();

    // Show friendly, non-blocking toast notification
    showToast('✨ תודה! ההצעה התקבלה בהצלחה 👍');

    // Confetti celebration
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b']
      });
    } catch {
      // Confetti fallback
    }

    // Dispatch silently in background (automatically queued if offline)
    sendFeedback(submission).catch((err) => {
      console.warn('Background feedback dispatch note:', err);
    });
  };

  const isCampfire = themeMode === 'campfire';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0" 
        onClick={() => closeFeedbackDrawer()}
        aria-hidden="true" 
      />

      {/* Drawer / Modal Container */}
      <div 
        className={`relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[92vh] max-h-[92dvh] pb-safe flex flex-col overflow-hidden transition-all transform ${
          isCampfire 
            ? 'bg-stone-900 border border-amber-900/40 text-stone-100' 
            : 'bg-white border border-stone-200 text-stone-800'
        }`}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-drawer-title"
      >
        {/* Top Handle for mobile drawer */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className={`w-12 h-1.5 rounded-full ${isCampfire ? 'bg-stone-700' : 'bg-stone-300'}`} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-3 border-b border-stone-200/40 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isCampfire ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-100 text-emerald-700'}`}>
              <Lightbulb className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 id="feedback-drawer-title" className="text-lg font-bold">
                עוזרים לנו לשפר את שלוף פק"ל
              </h2>
              <p className={`text-xs ${isCampfire ? 'text-stone-400' : 'text-stone-500'}`}>
                הצעות ייעול, רעיונות לחידות ותוכן מהשטח
              </p>
            </div>
          </div>
          <button
            onClick={() => closeFeedbackDrawer()}
            className={`p-2 rounded-full transition-colors ${
              isCampfire ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-100 text-stone-500'
            }`}
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4">

          {/* Quick Settings: Random Order Switch */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-3 ${
            isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-blue-50/70 border-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-500">
                <Shuffle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black block">סדר שאלות אקראי למכשיר</span>
                <span className="text-[11px] text-stone-400 block">סדר ייחודי למכשיר זה במשחקים ובנושאים</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {randomOrderEnabled && (
                <button
                  type="button"
                  onClick={reshuffleDeviceSeed}
                  title="ערבב מחדש את השאלות"
                  className={`p-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                    isCampfire 
                      ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white' 
                      : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={toggleRandomOrder}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  randomOrderEnabled
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : isCampfire
                      ? 'bg-stone-900 border border-stone-800 text-stone-400'
                      : 'bg-white border border-stone-300 text-stone-600'
                }`}
              >
                {randomOrderEnabled ? 'אקראי 🎲' : 'מקורי 📚'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invisible Honeypot for Bot Protection */}
            <input
              type="text"
              name="bot_trap"
              value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              {/* Category Pills (One-Click Selection) */}
              <div>
                <label className="block text-xs font-semibold mb-2">
                  נושא הפנייה:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => {
                          setCategory(cat.id);
                          if (hapticsEnabled) triggerHaptic(15);
                        }}
                        className={`text-xs py-2 px-3 rounded-xl border text-right font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? isCampfire
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                              : 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm font-bold'
                            : isCampfire
                              ? 'bg-stone-800/60 border-stone-700 text-stone-400 hover:border-stone-600'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name (Required) */}
              <div>
                <label htmlFor="feedback-name" className="block text-xs font-semibold mb-1">
                  שם ושם משפחה <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="feedback-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="למשל: דני לוי"
                    maxLength={70}
                    className={`w-full pr-9 pl-3 py-2 text-base sm:text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                      isCampfire
                        ? 'bg-stone-800/80 border-stone-700 text-stone-100 focus:ring-amber-500/50'
                        : 'bg-white border-stone-300 text-stone-900 focus:ring-emerald-500/50'
                    }`}
                  />
                </div>
              </div>

              {/* Message (Required) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="feedback-message" className="block text-xs font-semibold">
                    תוכן ההצעה או השיפור <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-[10px] ${message.length > 1800 ? 'text-amber-500' : 'text-stone-400'}`}>
                    {message.length}/2000
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="רשמו כאן את הרעיון לחידה, שיפור רצוי או כל משוב שחשוב לכם בשטח..."
                  maxLength={2000}
                  className={`w-full p-3 text-base sm:text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors resize-none ${
                    isCampfire
                      ? 'bg-stone-800/80 border-stone-700 text-stone-100 focus:ring-amber-500/50'
                      : 'bg-white border-stone-300 text-stone-900 focus:ring-emerald-500/50'
                  }`}
                />
              </div>

              {/* Organization / Tour Company (Optional) */}
              <div>
                <label htmlFor="feedback-org" className="block text-xs font-semibold mb-1">
                  מסגרת הדרכה / חברת טיולים <span className="text-stone-400 font-normal">(רשות)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    id="feedback-org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="למשל: מורה דרך עצמאי, מדריך של&quot;ח, קק&quot;ל, תנועת נוער..."
                    maxLength={100}
                    className={`w-full pr-9 pl-3 py-2 text-base sm:text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                      isCampfire
                        ? 'bg-stone-800/80 border-stone-700 text-stone-100 focus:ring-amber-500/50'
                        : 'bg-white border-stone-300 text-stone-900 focus:ring-emerald-500/50'
                    }`}
                  />
                </div>
              </div>

              {/* Email Address for Reply (Optional) */}
              <div>
                <label htmlFor="feedback-email" className="block text-xs font-semibold mb-1">
                  דוא"ל למענה <span className="text-stone-400 font-normal">(רשות – ללא התחייבות למענה)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com (אם תרצו שנוכל לענות לכם)"
                    maxLength={100}
                    className={`w-full pr-9 pl-3 py-2 text-base sm:text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
                      isCampfire
                        ? 'bg-stone-800/80 border-stone-700 text-stone-100 focus:ring-amber-500/50'
                        : 'bg-white border-stone-300 text-stone-900 focus:ring-emerald-500/50'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  ניתן להשאיר ריק. המייל ישמש אך ורק למענה במידה ונצטרך הבהרה לגבי ההצעה.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 text-xs rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isCampfire
                      ? 'bg-amber-600 hover:bg-amber-500 text-white active:scale-[0.98]'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]'
                  }`}
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span>שליחת הצעה למערכת</span>
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};
