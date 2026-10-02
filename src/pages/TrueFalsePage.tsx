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

interface TrueFalsePageProps {
  onBack?: () => void;
}

type MainFilter = 'all' | 'regions' | 'holidays';

export const TrueFalsePage: React.FC<TrueFalsePageProps> = ({ onBack }) => {
  const { themeMode, soundEnabled, toggleSound, hapticsEnabled, showToast } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const [mainFilter, setMainFilter] = useState<MainFilter>('all');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);

  // Team competition scores
  const [showTeamScores, setShowTeamScores] = useState<boolean>(false);
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);

  // Field Countdown Timer (15s default)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filtered dataset
  const filteredItems = useMemo(() => {
    return trueFalseData.filter(item => {
      if (mainFilter !== 'all' && item.category !== mainFilter) return false;
      if (subFilter !== 'all' && item.subSlug !== subFilter) return false;
      return true;
    });
  }, [mainFilter, subFilter]);

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
    if (filteredItems.length <= 1) return;
    const nextIdx = Math.floor(Math.random() * filteredItems.length);
    setCurrentIndex(nextIdx);
    setSelectedAnswer(null);
    setIsRevealed(false);
    resetTimer();
    if (hapticsEnabled) triggerHaptic(30);
    showToast('🎲 השאלות עורבבו מחדש!');
  };

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
        <div className={`p-3 rounded-2xl border flex items-center justify-around animate-fade-in ${
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
            <div className="space-y-3 pt-2 animate-fade-in">
              <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                currentItem.isTrue
                  ? isCampfire 
                    ? 'bg-emerald-950/50 border-emerald-600 text-emerald-200' 
                    : 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : isCampfire 
                    ? 'bg-rose-950/50 border-rose-600 text-rose-200' 
                    : 'bg-rose-50 border-rose-500 text-rose-900'
              }`}>
                {currentItem.isTrue ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 stroke-[2.5]" />
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base sm:text-lg font-black">
                      התשובה היא: {currentItem.isTrue ? 'נכון!' : 'לא נכון!'}
                    </span>
                    {selectedAnswer !== null && (
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedAnswer === currentItem.isTrue 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-rose-600 text-white'
                      }`}>
                        {selectedAnswer === currentItem.isTrue ? 'צדקתם! 🎯' : 'טעיתם! 😅'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-95">
                    {currentItem.explanation}
                  </p>
                </div>
              </div>
            </div>
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
