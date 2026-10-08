import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Shuffle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Timer, 
  Volume2, 
  VolumeX, 
  Compass, 
  CalendarDays, 
  Sparkles,
  Trophy,
  Share2
} from 'lucide-react';
import { trueFalseData } from '../data/content';
import { TrueFalseItem } from '../types';
import { usePakalStore } from '../store/usePakalStore';
import { triggerHaptic } from '../lib/haptics';
import { TrueFalseInstructionsModal } from '../components/true-false/TrueFalseInstructionsModal';
import confetti from 'canvas-confetti';
import { seededShuffle, deriveTopicSeed } from '../lib/random';

interface TrueFalsePageProps {
  onBack?: () => void;
}

type MainFilter = 'all' | 'regions' | 'holidays';

export const TrueFalsePage: React.FC<TrueFalsePageProps> = ({ onBack }) => {
  const { themeMode, soundEnabled, toggleSound, hapticsEnabled, showToast, deviceShuffleSeed, randomOrderEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const [mainFilter, setMainFilter] = useState<MainFilter>('all');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [localShuffleNonce, setLocalShuffleNonce] = useState<number>(0);

  // Team competition scores
  const [showTeamScores, setShowTeamScores] = useState<boolean>(false);
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);

  // Field Countdown Timer (15s default)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filtered dataset (device-based seeded shuffle within topic/filter)
  const filteredItems = useMemo(() => {
    const raw = trueFalseData.filter(item => {
      if (mainFilter !== 'all' && item.category !== mainFilter) return false;
      if (subFilter !== 'all' && item.subSlug !== subFilter) return false;
      return true;
    });

    if (!randomOrderEnabled) return raw;
    const topicKey = `tf_${mainFilter}_${subFilter}_${localShuffleNonce}`;
    const seed = deriveTopicSeed(deviceShuffleSeed, topicKey);
    return seededShuffle(raw, seed);
  }, [mainFilter, subFilter, randomOrderEnabled, deviceShuffleSeed, localShuffleNonce]);

  // Reset index and state on filter change
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    resetTimer();
  }, [mainFilter, subFilter]);

  // Safe current item
  const currentItem: TrueFalseItem | undefined = filteredItems[currentIndex] || filteredItems[0];

  // Timer logic
  useEffect(() => {
    if (timerActive && timerSeconds !== null && timerSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setTimerSeconds(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      if (hapticsEnabled) triggerHaptic([80, 50, 80]);
      showToast('⏰ הזמן עבר! מה התשובה של הקבוצה?');
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerActive, timerSeconds, hapticsEnabled, showToast]);

  const startTimer = (secs: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimerSeconds(secs);
    setTimerActive(true);
    if (hapticsEnabled) triggerHaptic(20);
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimerSeconds(null);
    setTimerActive(false);
  };

  const handleSelectAnswer = (userChoice: boolean) => {
    if (isRevealed) return;
    setSelectedAnswer(userChoice);
    setIsRevealed(true);

    const isCorrect = userChoice === currentItem?.isTrue;
    if (isCorrect) {
      if (hapticsEnabled) triggerHaptic([30, 40]);
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#22c55e', '#10b981', '#34d399']
        });
      } catch {}
    } else {
      if (hapticsEnabled) triggerHaptic([60, 40, 60]);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    if (hapticsEnabled) triggerHaptic(20);
  };

  const handleNext = () => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
    setSelectedAnswer(null);
    setIsRevealed(false);
    resetTimer();
    if (hapticsEnabled) triggerHaptic(15);
  };

  const handlePrev = () => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    setSelectedAnswer(null);
    setIsRevealed(false);
    resetTimer();
    if (hapticsEnabled) triggerHaptic(15);
  };

  const handleShuffle = () => {
    setLocalShuffleNonce((prev) => prev + 1);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    resetTimer();
    if (hapticsEnabled) triggerHaptic(30);
    showToast('🎲 השאלות עורבבו מחדש!');
  };

  // Desktop Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === '1' || e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleSelectAnswer(true);
      } else if (e.key === '2' || e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleSelectAnswer(false);
      } else if (e.code === 'Space' || e.code === 'Enter') {
        if (isRevealed) {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, currentIndex, filteredItems.length]);

  return (
    <div className="space-y-4 pb-24" dir="rtl">
      {/* Instructions Modal */}
      <TrueFalseInstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="חזרה לדף הקודם"
              className={`p-2 rounded-xl border transition-all ${
                isCampfire 
                  ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white' 
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 shadow-sm'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
              <span>נכון / לא נכון</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                isCampfire 
                  ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300' 
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}>
                152 טענות
              </span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              טריוויית שטח מהירה לטור בהליכה, לעצירת צל ולמדורה
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTeamScores(!showTeamScores)}
            aria-label="ניקוד קבוצות"
            className={`p-2 rounded-xl border transition-all ${
              showTeamScores
                ? isCampfire ? 'bg-amber-600 text-white border-amber-500' : 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-600 shadow-sm'
            }`}
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsInstructionsOpen(true)}
            aria-label="הוראות הפעלה בשטח"
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
              isCampfire 
                ? 'bg-stone-900 border-stone-800 text-emerald-400 hover:bg-stone-800' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-sm'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">איך משחקים?</span>
          </button>
        </div>
      </div>

      {/* Team Scores Drawer / Banner */}
      {showTeamScores && (
        <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-around animate-fade-in ${
          isCampfire ? 'bg-stone-950 border-amber-900/60' : 'bg-amber-50/80 border-amber-200 shadow-sm'
        }`}>
          {/* Team A */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">קבוצה א':</span>
            <span className="text-lg font-black">{teamAScore}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTeamAScore(prev => Math.max(0, prev - 1))}
                className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-800 font-bold text-xs flex items-center justify-center"
              >
                -
              </button>
              <button
                onClick={() => setTeamAScore(prev => prev + 1)}
                className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="h-6 w-px bg-stone-300 dark:bg-stone-800" />

          {/* Team B */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">קבוצה ב':</span>
            <span className="text-lg font-black">{teamBScore}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTeamBScore(prev => Math.max(0, prev - 1))}
                className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-800 font-bold text-xs flex items-center justify-center"
              >
                -
              </button>
              <button
                onClick={() => setTeamBScore(prev => prev + 1)}
                className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => { setTeamAScore(0); setTeamBScore(0); }}
            className="text-[10px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            איפוס
          </button>
        </div>
      )}

      {/* Main Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
        <button
          onClick={() => { setMainFilter('all'); setSubFilter('all'); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            mainFilter === 'all'
              ? isCampfire ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-emerald-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          הכל (152)
        </button>

        <button
          onClick={() => { setMainFilter('regions'); setSubFilter('all'); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mainFilter === 'regions'
              ? isCampfire ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-emerald-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>חבלי ארץ (84)</span>
        </button>

        <button
          onClick={() => { setMainFilter('holidays'); setSubFilter('all'); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mainFilter === 'holidays'
              ? isCampfire ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-emerald-800 shadow-sm'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>חגים ומועדים (68)</span>
        </button>
      </div>

      {/* Sub-Category Pills */}
      {mainFilter === 'regions' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSubFilter('all')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'all'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            כל האזורים (84)
          </button>
          <button
            onClick={() => setSubFilter('north')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'north'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            צפון וגולן (21)
          </button>
          <button
            onClick={() => setSubFilter('center')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'center'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            מרכז וחוף (21)
          </button>
          <button
            onClick={() => setSubFilter('jerusalem')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'jerusalem'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            ירושלים ויהודה (21)
          </button>
          <button
            onClick={() => setSubFilter('south')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'south'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            דרום, נגב וערבה (21)
          </button>
        </div>
      )}

      {mainFilter === 'holidays' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSubFilter('all')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'all'
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            כל המועדים (68)
          </button>
          <button
            onClick={() => setSubFilter('tishrei')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'tishrei'
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            חגי תשרי (17)
          </button>
          <button
            onClick={() => setSubFilter('chanukah-tubishvat')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'chanukah-tubishvat'
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            חנוכה וט"ו בשבט (17)
          </button>
          <button
            onClick={() => setSubFilter('purim-pesach')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'purim-pesach'
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            פורים ופסח (17)
          </button>
          <button
            onClick={() => setSubFilter('iyar-sivan')}
            className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all font-medium ${
              subFilter === 'iyar-sivan'
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm font-bold'
                : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            עצמאות, ל"ג בעומר ושבועות (17)
          </button>
        </div>
      )}

      {/* Top Visual Progress Bar */}
      {filteredItems.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 px-1">
            <span>שאלה {currentIndex + 1} מתוך {filteredItems.length}</span>
            <span>{Math.round(((currentIndex + 1) / filteredItems.length) * 100)}%</span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredItems.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Field Play Style Tip */}
      <div className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
        isCampfire ? 'bg-stone-900 border-stone-800 text-amber-300' : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
      }`}>
        <span className="text-base shrink-0">🏃‍♂️</span>
        <span>{currentIndex % 2 === 0 ? 'טיפ להליכה בטור: צעד ימינה = נכון ✅ | צעד שמאלה = לא נכון ❌' : 'טיפ למעגל: ידיים על הראש = נכון ✅ | ידיים על המותניים = לא נכון ❌'}</span>
      </div>

      {/* Main Interactive Game Card */}
      {currentItem ? (
        <div className={`rounded-3xl border-2 p-5 sm:p-6 shadow-xl transition-all relative overflow-hidden ${
          isCampfire 
            ? 'bg-stone-950 border-campfire-border/80 shadow-fire' 
            : 'bg-white border-amber-200/90 shadow-field'
        }`}>
          {/* Card Top Meta */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                isCampfire 
                  ? 'bg-stone-900 border-stone-800 text-orange-400' 
                  : 'bg-amber-100/80 border-amber-300 text-amber-900'
              }`}>
                שאלה {currentIndex + 1} מתוך {filteredItems.length}
              </span>

              <span className="text-[11px] text-stone-400 font-medium">
                {currentItem.subCategory}
              </span>
            </div>

            {/* Quick Timer Pill */}
            <div className="flex items-center gap-1">
              {timerSeconds !== null ? (
                <div className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border animate-pulse ${
                  timerSeconds <= 5 
                    ? 'bg-rose-500 text-white border-rose-600' 
                    : 'bg-amber-500 text-white border-amber-600'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{timerSeconds} שנ'</span>
                </div>
              ) : (
                <button
                  onClick={() => startTimer(15)}
                  className={`p-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 ${
                    isCampfire 
                      ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white' 
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                  title="טיימר 15 שניות"
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>15ש'</span>
                </button>
              )}
            </div>
          </div>

          {/* Statement Box */}
          <div className="my-5 min-h-[110px] flex items-center justify-center text-center px-2">
            <h2 className="text-xl sm:text-2xl font-black leading-snug tracking-tight text-stone-900 dark:text-stone-50">
              "{currentItem.statement}"
            </h2>
          </div>

          {/* Choice Buttons (Interactive Mode) */}
          {!isRevealed ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* TRUE Button */}
              <button
                onClick={() => handleSelectAnswer(true)}
                className="py-4 px-4 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                <span>נכון!</span>
              </button>

              {/* FALSE Button */}
              <button
                onClick={() => handleSelectAnswer(false)}
                className="py-4 px-4 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-6 h-6 stroke-[2.5]" />
                <span>לא נכון!</span>
              </button>
            </div>
          ) : (
            /* Revealed Answer & Explanation */
            (() => {
              const isUserCorrect = selectedAnswer !== null ? selectedAnswer === currentItem.isTrue : null;

              // 1. User answered correctly (celebratory green styling whether statement was true or false)
              if (isUserCorrect === true) {
                return (
                  <div className="space-y-3 pt-2 animate-fade-in">
                    <div className={`p-5 rounded-2xl border-2 flex items-start gap-3 shadow-md ${
                      isCampfire 
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-emerald-950/50' 
                        : 'bg-emerald-50/95 border-emerald-500 text-emerald-950 shadow-emerald-600/10'
                    }`}>
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                          <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                            <span>צדקתם! תשובה מעולה! 🎯</span>
                          </span>
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white border border-emerald-700 shadow-sm">
                            הטענה אכן {currentItem.isTrue ? 'נכונה ✅' : 'אינה נכונה ❌'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                          {currentItem.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // 2. User made a mistake (rose / red error styling)
              if (isUserCorrect === false) {
                return (
                  <div className="space-y-3 pt-2 animate-fade-in">
                    <div className={`p-5 rounded-2xl border-2 flex items-start gap-3 shadow-md ${
                      isCampfire 
                        ? 'bg-rose-950/60 border-rose-600 text-rose-100 shadow-rose-950/50' 
                        : 'bg-rose-50/95 border-rose-500 text-rose-950 shadow-rose-600/10'
                    }`}>
                      <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                          <span className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                            <span>הפעם לא צדקתם... 😅</span>
                          </span>
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white border border-rose-700 shadow-sm">
                            התשובה הנכונה: {currentItem.isTrue ? 'נכון ✅' : 'לא נכון ❌'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                          {currentItem.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // 3. Guide directly revealed without an answer selection (neutral objective styling)
              return (
                <div className="space-y-3 pt-2 animate-fade-in">
                  <div className={`p-5 rounded-2xl border-2 flex items-start gap-3 shadow-md ${
                    isCampfire 
                      ? 'bg-stone-900/90 border-amber-500/70 text-amber-100 shadow-amber-950/50' 
                      : 'bg-amber-50/95 border-amber-400 text-amber-950 shadow-amber-600/10'
                  }`}>
                    <Sparkles className="w-8 h-8 text-amber-500 shrink-0 mt-0.5 stroke-[2.2]" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <span className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                          התשובה היא: {currentItem.isTrue ? 'נכון! ✅' : 'לא נכון! ❌'}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/40">
                          חשיפת מדריך 💡
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                        {currentItem.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* Big Next Question Thumb Button */}
          {isRevealed && (
            <button
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-[0.98] text-white shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2 transition-all mt-4 animate-bounce-subtle"
            >
              <span>לשאלה הבאה</span>
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
          )}

          {/* Guide Controls Toolbar */}
          <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1 transition-all ${
                currentIndex === 0 
                  ? 'opacity-40 cursor-not-allowed border-transparent' 
                  : isCampfire ? 'bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800' : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>הקודם</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                  isCampfire ? 'bg-stone-900 border-stone-800 text-orange-300' : 'bg-white border-stone-200 text-stone-700 shadow-sm'
                }`}
                title="ערבוב אקראי"
              >
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">ערבב</span>
              </button>

              {!isRevealed ? (
                <button
                  onClick={handleReveal}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                    isCampfire ? 'bg-stone-800 border-stone-700 text-stone-200' : 'bg-stone-100 border-stone-300 text-stone-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>חשוף פתרון</span>
                </button>
              ) : null}
            </div>

            <button
              onClick={handleNext}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1 transition-all shadow-sm ${
                isCampfire 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <span>הבא</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl border bg-white dark:bg-stone-950">
          <p className="text-stone-500">לא נמצאו שאלות בסינון הנוכחי</p>
        </div>
      )}
    </div>
  );
};
