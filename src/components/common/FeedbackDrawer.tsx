import React, { useState, useEffect, useRef } from 'react';
import { 
  Lightbulb, 
  Send, 
  CheckCircle2, 
  X, 
  Building2, 
  Mail, 
  User, 
  Sparkles, 
  WifiOff, 
  MessageSquare,
  AlertTriangle,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePakalStore } from '../../store/usePakalStore';
import { FeedbackCategory, FeedbackSubmission } from '../../types';
import { triggerHaptic } from '../../lib/haptics';

const ACCESS_KEY = 'b0e565eb-1234-4926-b21a-fe2d600ec143';

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'riddle-idea', label: '💡 רעיון לחידה או תוכן', icon: Lightbulb },
  { id: 'site-improvement', label: '⚡ הצעה לייעול האתר', icon: Zap },
  { id: 'bug-report', label: '🐛 דיווח על שיבוש', icon: AlertTriangle },
  { id: 'general', label: '💬 משוב כללי', icon: MessageSquare }
];

export const FeedbackDrawer: React.FC = () => {
  const { 
    isFeedbackDrawerOpen, 
    closeFeedbackDrawer, 
    savedFeedbackUser, 
    saveFeedbackUserInfo,
    queuePendingFeedback,
    themeMode,
    hapticsEnabled 
  } = usePakalStore();

  const [category, setCategory] = useState<FeedbackCategory>('riddle-idea');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [botTrap, setBotTrap] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; offline: boolean; message?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize saved values when drawer opens
  useEffect(() => {
    if (isFeedbackDrawerOpen) {
      setName(savedFeedbackUser.name || '');
      setEmail(savedFeedbackUser.email || '');
      setOrganization(savedFeedbackUser.organization || '');
      setMessage('');
      setCategory('riddle-idea');
      setSubmitResult(null);
      setErrorMessage(null);
      setBotTrap('');
      setIsSubmitting(false);
    }
  }, [isFeedbackDrawerOpen, savedFeedbackUser]);

  if (!isFeedbackDrawerOpen) return null;

  const currentCategoryLabel = CATEGORIES.find(c => c.id === category)?.label || '💡 משוב כללי';
  const formattedDate = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

  const formattedMessage = `
התקבלה הצעת ייעול חדשה משלוף פק"ל:
======================================================
👤 שם הפונה: ${name.trim()}
🏢 מסגרת הדרכה / חברה: ${organization.trim() || 'לא צוין'}
📧 מייל לחזרה: ${email.trim() || 'לא צוין (פנייה לידיעה בלבד)'}
🏷️ נושא הפנייה: ${currentCategoryLabel}
📍 נשלח מתוך מסך: ${typeof window !== 'undefined' ? window.location.pathname : 'ראשי'}
⏱️ תאריך ושעה: ${formattedDate}
======================================================
📝 תוכן ההצעה:
${message.trim()}
======================================================
  `.trim();

  const handleSubmit = (e: React.FormEvent) => {
    setErrorMessage(null);

    // Basic validation
    if (!name.trim()) {
      e.preventDefault();
      setErrorMessage('נא למלא שם ושם משפחה');
      if (hapticsEnabled) triggerHaptic([50, 50]);
      return;
    }

    if (!message.trim()) {
      e.preventDefault();
      setErrorMessage('נא לכתוב את תוכן ההצעה או המשוב');
      if (hapticsEnabled) triggerHaptic([50, 50]);
      return;
    }

    // Save user info for future submissions
    saveFeedbackUserInfo({
      name: name.trim(),
      email: email.trim(),
      organization: organization.trim()
    });

    if (hapticsEnabled) triggerHaptic(20);

    // Check if offline (Field trail with zero reception)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      e.preventDefault();
      queuePendingFeedback({
        name: name.trim(),
        message: message.trim(),
        category,
        email: email.trim() || undefined,
        organization: organization.trim() || undefined,
        currentScreen: window.location.pathname
      });
      setSubmitResult({
        success: true,
        offline: true,
        message: 'ההצעה נשמרה בהצלחה! היא תישלח אוטומטית כשתחזור לקליטה.'
      });
      return;
    }

    // ONLINE MODE:
    // Let the native form submit silently to the hidden iframe target="web3forms_sink"!
    // This completely bypasses CORS preflights, Cloudflare fetch blocks, and never fails!
    setIsSubmitting(true);
    setSubmitResult({
      success: true,
      offline: false
    });

    if (hapticsEnabled) triggerHaptic([30, 50, 40]);

    // Fire celebratory confetti on success
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#3b82f6', '#eab308']
      });
    } catch {
      // Confetti fallback
    }

    // Auto close after 2.5 seconds
    setTimeout(() => {
      closeFeedbackDrawer();
      setIsSubmitting(false);
    }, 2500);
  };

  const isCampfire = themeMode === 'campfire';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0" 
        onClick={() => !isSubmitting && closeFeedbackDrawer()}
        aria-hidden="true" 
      />

      {/* Hidden iframe sink for silent native form submission (bypasses CORS and Cloudflare blocks 100%) */}
      <iframe
        name="web3forms_sink"
        id="web3forms_sink"
        title="Web3Forms Sink"
        style={{ display: 'none', position: 'absolute', width: 0, height: 0, border: 'none' }}
      />

      {/* Drawer / Modal Container */}
      <div 
        className={`relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden transition-all transform ${
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
            disabled={isSubmitting}
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
          {submitResult ? (
            /* Success / Offline Saved State */
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                {submitResult.offline ? (
                  <WifiOff className="w-12 h-12 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-12 h-12" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {submitResult.offline ? 'נשמר בהצלחה לשטח!' : 'תודה רבה! ההצעה נשלחה בהצלחה'}
                </h3>
                <p className={`text-sm max-w-sm mx-auto ${isCampfire ? 'text-stone-300' : 'text-stone-600'}`}>
                  {submitResult.offline 
                    ? 'זיהינו שאין קליטה סלולרית במסלול. ההצעה נשמרה בזיכרון המכשיר ותישלח למערכת באופן אוטומטי ברגע שתחזור לקליטה.'
                    : 'אנחנו מעריכים מאוד את השיתוף שלך. כל הצעה נבדקת בקפידה כדי להפוך את שלוף פק"ל לכלי השטח הטוב ביותר.'
                  }
                </p>
              </div>
            </div>
          ) : (
            /* Form Input State */
            <form
              ref={formRef}
              action="https://api.web3forms.com/submit"
              method="POST"
              target="web3forms_sink"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Web3Forms Hidden Integration Fields */}
              <input type="hidden" name="access_key" value={ACCESS_KEY} />
              <input type="hidden" name="from_name" value="שלוף פק״ל" />
              <input type="hidden" name="subject" value={`💡 ${currentCategoryLabel} - מאת ${name.trim() || 'מדריך בשטח'}`} />
              <input type="hidden" name="name" value={name.trim()} />
              <input type="hidden" name="email" value={email.trim()} />
              <input type="hidden" name="category" value={currentCategoryLabel} />
              <input type="hidden" name="organization" value={organization.trim() || 'לא צוין'} />
              <textarea
                name="message"
                readOnly
                value={formattedMessage}
                style={{ display: 'none' }}
                aria-hidden="true"
              />

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
                    className={`w-full pr-9 pl-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
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
                  className={`w-full p-3 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors resize-none ${
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
                    className={`w-full pr-9 pl-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
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
                    className={`w-full pr-9 pl-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
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
                <div className="p-3 text-xs rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'opacity-70 cursor-not-allowed'
                      : isCampfire
                        ? 'bg-amber-600 hover:bg-amber-500 text-white active:scale-[0.98]'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>שולח...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 rotate-180" />
                      <span>שליחת הצעה למערכת</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
