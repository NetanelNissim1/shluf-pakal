import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  FastForward, 
  Shuffle, 
  RotateCcw, 
  Trophy, 
  Award, 
  HelpCircle, 
  Clock, 
  Users, 
  Swords,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { tabooData } from '../../data/content';
import { TabooCard } from '../../types';
import { TabooTimer } from './TabooTimer';
import { TabooCardView } from './TabooCardView';
import { TabooInstructionsModal } from './TabooInstructionsModal';
import { TabooRoundSummaryModal } from './TabooRoundSummaryModal';
import { usePakalStore } from '../../store/usePakalStore';
import { playSuccess, playPass, playShuffle, playTimerEnd } from '../../lib/sound';
import { triggerHaptic } from '../../lib/haptics';

export const TabooGame: React.FC = () => {
  const { themeMode, soundEnabled, hapticsEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const [cards, setCards] = useState<TabooCard[]>(tabooData as TabooCard[]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Duration settings (30s, 60s, 90s)
  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | 90>(60);
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState(false);

  // Round Score
  const [score, setScore] = useState({ correct: 0, skipped: 0 });

  // Team competition mode
  const [isTeamMode, setIsTeamMode] = useState(false);
  const [activeTeam, setActiveTeam] = useState<'A' | 'B'>('A');
  const [teamScores, setTeamScores] = useState({ teamA: 0, teamB: 0 });

  // Modals state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isRoundSummaryOpen, setIsRoundSummaryOpen] = useState(false);

  // Swipe detection ref
  const touchStartXRef = useRef<number | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      handleTimeUp();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  // When timer runs out
  const handleTimeUp = () => {
    setIsRunning(false);
    if (soundEnabled) playTimerEnd();
    if (hapticsEnabled) triggerHaptic([50, 100, 150]);

    // Update cumulative team score if team mode is enabled
    if (isTeamMode) {
      setTeamScores((prev) => ({
        ...prev,
        [activeTeam === 'A' ? 'teamA' : 'teamB']: prev[activeTeam === 'A' ? 'teamA' : 'teamB'] + score.correct
      }));
    }

    // Celebratory confetti on round completion
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6']
      });
    } catch {
      // Confetti fallback
    }

    // Open round summary dialog
    setIsRoundSummaryOpen(true);
  };

  const handleToggleTimer = () => {
    if (hapticsEnabled) triggerHaptic(30);
    if (secondsLeft === 0) {
      setSecondsLeft(selectedDuration);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleResetTimer = () => {
    if (hapticsEnabled) triggerHaptic(20);
    setIsRunning(false);
    setSecondsLeft(selectedDuration);
  };

  const handleDurationChange = (dur: 30 | 60 | 90) => {
    if (hapticsEnabled) triggerHaptic(20);
    setSelectedDuration(dur);
    if (!isRunning) {
      setSecondsLeft(dur);
    }
  };

  const handleSuccess = () => {
    if (soundEnabled) playSuccess();
    if (hapticsEnabled) triggerHaptic([30, 40]);

    // Small celebratory confetti on point
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#3b82f6']
      });
    } catch {
      //
    }

    setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    goToNextCard();
  };

  const handleSkip = () => {
    if (soundEnabled) playPass();
    if (hapticsEnabled) triggerHaptic(20);
    setScore((prev) => ({ ...prev, skipped: prev.skipped + 1 }));
    goToNextCard();
  };

  const goToNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const goToPrevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    if (soundEnabled) playShuffle();
    if (hapticsEnabled) triggerHaptic(40);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleStartNextRound = () => {
    setIsRoundSummaryOpen(false);
    if (isTeamMode) {
      setActiveTeam((prev) => (prev === 'A' ? 'B' : 'A'));
    }
    setScore({ correct: 0, skipped: 0 });
    setSecondsLeft(selectedDuration);
    goToNextCard();
    setIsRunning(true);
  };

  const handleResetGame = () => {
    if (hapticsEnabled) triggerHaptic(30);
    setIsRoundSummaryOpen(false);
    setIsRunning(false);
    setSecondsLeft(selectedDuration);
    setScore({ correct: 0, skipped: 0 });
    setTeamScores({ teamA: 0, teamB: 0 });
    setActiveTeam('A');
    setCurrentIndex(0);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        goToPrevCard();
      } else {
        goToNextCard();
      }
    }
    touchStartXRef.current = null;
  };

  const currentCard = cards[currentIndex] || cards[0];

  return (
    <div className="space-y-4 pb-20 select-none">
      
      {/* Top Header Bar: Title, Help Button, and Shuffle */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>טאבו שטח</span>
          </h2>
          <p className="text-xs text-stone-500">
            הסבר את המושג למעגל מבלי להגיד את המילים האסורות!
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Help Modal Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            aria-label="איך משחקים טאבו?"
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all touch-press ${
              isCampfire
                ? 'bg-amber-950/60 border-amber-800/60 text-amber-300 hover:bg-amber-900/60'
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-sm'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>איך משחקים?</span>
          </button>

          {/* Shuffle button */}
          <button
            onClick={handleShuffle}
            aria-label="ערבב כרטיסים"
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all touch-press ${
              isCampfire
                ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 shadow-sm'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ערבב</span>
          </button>
        </div>
      </div>

      {/* Game Settings Pills: Duration selector & Team competition toggle */}
      <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-2xl bg-stone-100 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 text-xs">
        {/* Round Duration Selector (30 / 60 / 90s) */}
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-stone-400 mr-0.5" />
          <span className="font-semibold text-stone-400 hidden xs:inline">זמן:</span>
          {([30, 60, 90] as const).map((dur) => (
            <button
              key={dur}
              onClick={() => handleDurationChange(dur)}
              className={`px-2 py-1 rounded-lg font-bold transition-all touch-press ${
                selectedDuration === dur
                  ? isCampfire
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-amber-500 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {dur}ש'
            </button>
          ))}
        </div>

        {/* Team Mode Switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (hapticsEnabled) triggerHaptic(20);
              setIsTeamMode((prev) => !prev);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border transition-all touch-press ${
              isTeamMode
                ? isCampfire
                  ? 'bg-orange-600/30 border-orange-500 text-orange-300'
                  : 'bg-emerald-50 border-emerald-400 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {isTeamMode ? (
              <>
                <Swords className="w-3.5 h-3.5 text-amber-500" />
                <span>תחרות קבוצות</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5" />
                <span>משחק חופשי</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Team Indicator & Running Leaderboard (if Team Mode is active) */}
      {isTeamMode && (
        <div className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
          isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200/80 shadow-sm'
        }`}>
          {/* Team A Pill */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
            activeTeam === 'A'
              ? isCampfire 
                ? 'bg-orange-600/30 border-orange-500 text-orange-300 font-extrabold ring-2 ring-orange-500/30' 
                : 'bg-amber-100 border-amber-400 text-amber-950 font-extrabold ring-2 ring-amber-400/30'
              : 'border-transparent text-stone-400 opacity-70'
          }`}>
            <span className="text-xs">קבוצה א'</span>
            <span className="text-sm font-black">{teamScores.teamA} נק'</span>
            {activeTeam === 'A' && <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full">משחקת</span>}
          </div>

          <div className="text-stone-400 font-bold text-xs">VS</div>

          {/* Team B Pill */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
            activeTeam === 'B'
              ? isCampfire 
                ? 'bg-orange-600/30 border-orange-500 text-orange-300 font-extrabold ring-2 ring-orange-500/30' 
                : 'bg-amber-100 border-amber-400 text-amber-950 font-extrabold ring-2 ring-amber-400/30'
              : 'border-transparent text-stone-400 opacity-70'
          }`}>
            <span className="text-xs">קבוצה ב'</span>
            <span className="text-sm font-black">{teamScores.teamB} נק'</span>
            {activeTeam === 'B' && <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full">משחקת</span>}
          </div>
        </div>
      )}

      {/* Animated Circular Timer with Selected Duration */}
      <TabooTimer
        secondsLeft={secondsLeft}
        isRunning={isRunning}
        totalSeconds={selectedDuration}
        onTogglePlay={handleToggleTimer}
        onReset={handleResetTimer}
        onTimeUp={handleTimeUp}
      />

      {/* Live Round Score Tracker */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
          isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold">הצלחות בסיבוב:</span>
          </div>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{score.correct}</span>
        </div>

        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
          isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5">
            <FastForward className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold">דילוגים / פסילה:</span>
          </div>
          <span className="text-lg font-black text-stone-400">{score.skipped}</span>
        </div>
      </div>

      {/* Main Taboo Card with Swipe Support & Stealth Indicator */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="cursor-grab active:cursor-grabbing select-none"
      >
        <TabooCardView
          card={currentCard}
          cardNumber={currentIndex + 1}
          totalCards={cards.length}
        />
      </div>

      {/* Card Navigation Arrows (Next / Prev) */}
      <div className="flex items-center justify-between px-2 text-xs text-stone-400">
        <button
          onClick={goToPrevCard}
          className="flex items-center gap-1 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          <span>כרטיס קודם</span>
        </button>

        <span className="text-[11px] opacity-70">
          החלק שמאלה או ימינה לדפדוף 👈👉
        </span>

        <button
          onClick={goToNextCard}
          className="flex items-center gap-1 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
        >
          <span>כרטיס הבא</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Big Action Buttons: Pass & Correct */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={handleSkip}
          className={`py-3.5 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 border transition-all touch-press ${
            isCampfire
              ? 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
              : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700 shadow-sm'
          }`}
        >
          <FastForward className="w-5 h-5" />
          <span>דלג / פסילה</span>
        </button>

        <button
          onClick={handleSuccess}
          className="py-3.5 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 transition-all touch-press"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>הצלחה! (+1)</span>
        </button>
      </div>

      {/* Reset Game Button */}
      {(score.correct > 0 || score.skipped > 0 || teamScores.teamA > 0 || teamScores.teamB > 0) && (
        <div className="text-center pt-2">
          <button
            onClick={handleResetGame}
            className="text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 underline inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>איפוס תוצאות המשחק</span>
          </button>
        </div>
      )}

      {/* Instructions Modal (איך משחקים?) */}
      <TabooInstructionsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Round Summary Modal (הזמן נגמר!) */}
      <TabooRoundSummaryModal
        isOpen={isRoundSummaryOpen}
        roundScore={score}
        isTeamMode={isTeamMode}
        activeTeam={activeTeam}
        teamScores={teamScores}
        onStartNextRound={handleStartNextRound}
        onResetGame={handleResetGame}
      />

    </div>
  );
};
