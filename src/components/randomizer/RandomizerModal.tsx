import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, RotateCw, Filter } from 'lucide-react';
import { allCombinedRiddles } from '../../data/content';
import { RiddleItem, CategoryId } from '../../types';
import { RiddleCard } from '../riddles/RiddleCard';
import { usePakalStore } from '../../store/usePakalStore';
import { CATEGORIES } from '../../data/categories';
import { playShuffle } from '../../lib/sound';
import { triggerHaptic } from '../../lib/haptics';

export const RandomizerModal: React.FC = () => {
  const { 
    isRandomizerOpen, 
    closeRandomizer, 
    themeMode, 
    activeCategory, 
    soundEnabled,
    hapticsEnabled,
    uxMode 
  } = usePakalStore();

  const isCampfire = themeMode === 'campfire';
  const allRiddles = allCombinedRiddles as RiddleItem[];

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(
    activeCategory || 'all'
  );
  const [currentRiddle, setCurrentRiddle] = useState<RiddleItem | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Sync with store when opened
  useEffect(() => {
    if (isRandomizerOpen) {
      setSelectedCategory(activeCategory || 'all');
      drawRandomRiddle(activeCategory || 'all');
    }
  }, [isRandomizerOpen, activeCategory]);

  const drawRandomRiddle = (cat: CategoryId | 'all' = selectedCategory) => {
    setIsShuffling(true);
    if (soundEnabled) playShuffle();
    if (hapticsEnabled) triggerHaptic([50, 40]);

    const pool = cat === 'all' 
      ? allRiddles 
      : allRiddles.filter((r) => r.categoryId === cat);

    if (pool.length === 0) {
      setCurrentRiddle(allRiddles[Math.floor(Math.random() * allRiddles.length)]);
      setIsShuffling(false);
      return;
    }

    // Roll animation effect
    let count = 0;
    const interval = setInterval(() => {
      const temp = pool[Math.floor(Math.random() * pool.length)];
      setCurrentRiddle(temp);
      count++;
      if (count > 6) {
        clearInterval(interval);
        const finalPick = pool[Math.floor(Math.random() * pool.length)];
        setCurrentRiddle(finalPick);
        setIsShuffling(false);

        // Confetti burst on draw
        try {
          confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#ef4444', '#10b981']
          });
        } catch {
          //
        }
      }
    }, 45);
  };

  if (!isRandomizerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-lg rounded-3xl border-2 p-5 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col transition-all ${
          isCampfire
            ? 'bg-stone-950 border-orange-600/70 shadow-orange-950/60 text-orange-100'
            : 'bg-white border-amber-300 shadow-amber-900/20 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${
              isCampfire ? 'bg-orange-600/20 text-orange-400' : 'bg-amber-100 text-amber-800'
            }`}>
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">שלוף לי!</h3>
              <p className="text-xs text-stone-400">
                {uxMode === 'enhanced' ? 'שליפה אקראית רב-משחקית למעגל ולשטח ✨' : 'שליפה אקראית מהירה לשבירת שתיקה, רענון והקפצת המעגל בשטח'}
              </p>
            </div>
          </div>

          <button
            onClick={closeRandomizer}
            aria-label="סגור חלון"
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Scope Selector */}
        <div className="py-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400 mb-2">
            <Filter className="w-3.5 h-3.5" />
            <span>שלוף מתוך:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => {
                setSelectedCategory('all');
                drawRandomRiddle('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                selectedCategory === 'all'
                  ? isCampfire ? 'bg-orange-600 text-white border-orange-500' : 'bg-amber-600 text-white border-amber-600'
                  : isCampfire ? 'bg-stone-900 text-stone-300 border-stone-800' : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              🎲 כל המאגר ({allRiddles.length})
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  drawRandomRiddle(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  selectedCategory === cat.id
                    ? isCampfire ? 'bg-orange-600 text-white border-orange-500' : 'bg-amber-600 text-white border-amber-600'
                    : isCampfire ? 'bg-stone-900 text-stone-300 border-stone-800' : 'bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Riddle Card View */}
        <div className="my-auto py-2 overflow-y-auto">
          {currentRiddle ? (
            <div className={isShuffling ? 'opacity-50 blur-[0.5px] transition-all' : ''}>
              <RiddleCard riddle={currentRiddle} />
            </div>
          ) : (
            <div className="text-center py-10 text-stone-400 font-bold">
              לוחץ על שלוף...
            </div>
          )}
        </div>

        {/* Bottom Shuffler Action */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={() => drawRandomRiddle()}
            disabled={isShuffling}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl transition-all touch-press ${
              isCampfire
                ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-black shadow-orange-600/40 hover:brightness-110'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-amber-500/30 hover:brightness-105'
            }`}
          >
            <RotateCw className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>שלוף עוד שאלה! 🎲</span>
          </button>
        </div>

      </div>
    </div>
  );
};
