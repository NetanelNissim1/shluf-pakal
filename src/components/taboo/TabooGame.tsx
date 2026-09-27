import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Check, FastForward, Shuffle, RotateCcw, Trophy, Award } from 'lucide-react';
import { tabooData } from '../../data/content';
import { TabooCard } from '../../types';
import { TabooTimer } from './TabooTimer';
import { TabooCardView } from './TabooCardView';
import { usePakalStore } from '../../store/usePakalStore';
import { playSuccess, playPass, playShuffle } from '../../lib/sound';
import { triggerHaptic } from '../../lib/haptics';

export const TabooGame: React.FC = () => {
  const { themeMode, soundEnabled, hapticsEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const [cards, setCards] = useState<TabooCard[]>(tabooData as TabooCard[]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState({ correct: 0, skipped: 0 });

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
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const handleToggleTimer = () => {
    if (hapticsEnabled) triggerHaptic(30);
    if (secondsLeft === 0) {
      setSecondsLeft(60);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleResetTimer = () => {
    if (hapticsEnabled) triggerHaptic(20);
    setIsRunning(false);
    setSecondsLeft(60);
  };

  const handleSuccess = () => {
    if (soundEnabled) playSuccess();
    if (hapticsEnabled) triggerHaptic([30, 40]);

    // Small celebratory confetti
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

  const handleResetGame = () => {
    if (hapticsEnabled) triggerHaptic(30);
    handleResetTimer();
    setScore({ correct: 0, skipped: 0 });
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
        // Swiped right -> prev
        goToPrevCard();
      } else {
        // Swiped left -> next
        goToNextCard();
      }
    }
    touchStartXRef.current = null;
  };

  const currentCard = cards[currentIndex] || cards[0];

  return (
    <div className="space-y-4 pb-20">
      
      {/* Top Bar: Title & Shuffle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>משחק טאבו שטח</span>
          </h2>
          <p className="text-xs text-stone-500">
            הסבר את המושג לקבוצה מבלי להגיד את המילים האסורות!
          </p>
        </div>

        <button
          onClick={handleShuffle}
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all touch-press ${
            isCampfire
              ? 'bg-stone-900 border-stone-800 text-orange-400 hover:bg-stone-800'
              : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50 shadow-sm'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>ערבב כרטיסים</span>
        </button>
      </div>

      {/* 60s Circular Timer */}
      <TabooTimer
        secondsLeft={secondsLeft}
        isRunning={isRunning}
        totalSeconds={60}
        onTogglePlay={handleToggleTimer}
        onReset={handleResetTimer}
      />

      {/* Score Tracker */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
          isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold">הצלחות:</span>
          </div>
          <span className="text-lg font-black text-emerald-600">{score.correct}</span>
        </div>

        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
          isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5">
            <FastForward className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold">דילוגים:</span>
          </div>
          <span className="text-lg font-black text-stone-400">{score.skipped}</span>
        </div>
      </div>

      {/* Main Taboo Card with Swipe */}
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

      {/* Action Buttons: Pass & Correct */}
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
      {(score.correct > 0 || score.skipped > 0) && (
        <div className="text-center pt-2">
          <button
            onClick={handleResetGame}
            className="text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 underline inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>איפוס תוצאות המשחק</span>
          </button>
        </div>
      )}

    </div>
  );
};
