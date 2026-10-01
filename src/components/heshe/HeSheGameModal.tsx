import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Shuffle, 
  Star, 
  Share2, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  Layers,
  Check
} from 'lucide-react';
import { hesheData } from '../../data/content';
import { HeSheRiddle } from '../../types';
import { usePakalStore } from '../../store/usePakalStore';
import { triggerHaptic } from '../../lib/haptics';
import { playSuccess, playShuffle } from '../../lib/sound';
import { shareContent } from '../../lib/share';
import { HeSheInstructionsModal } from './HeSheInstructionsModal';

interface HeSheGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPart?: string;
}

const PARTS = [
  { id: 'all', label: 'כל המאגר', count: 205 },
  { id: 'nature', label: 'טבע, בעלי חיים וצומח', match: 'טבע', count: 50 },
  { id: 'objects', label: 'חפצים, כלי בית וביגוד', match: 'חפצים', count: 50 },
  { id: 'body', label: 'גוף האדם, מזון ומטבח', match: 'גוף', count: 50 },
  { id: 'society', label: 'חברה, מקצועות ומוזיקה', match: 'מושגים', count: 55 }
];

export const HeSheGameModal: React.FC<HeSheGameModalProps> = ({ isOpen, onClose, initialPart }) => {
  const { 
    themeMode, 
    soundEnabled, 
    toggleSound, 
    hapticsEnabled, 
    favorites, 
    toggleFavorite,
    showToast 
  } = usePakalStore();

  const isCampfire = themeMode === 'campfire';

  const [activePartId, setActivePartId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [deck, setDeck] = useState<HeSheRiddle[]>(hesheData);

  // Sync initialPart if provided
  useEffect(() => {
    if (initialPart) {
      const found = PARTS.find(p => p.match && initialPart.includes(p.match));
      if (found) setActivePartId(found.id);
    }
  }, [initialPart]);

  // Filter deck based on activePart and difficulty
  const filteredList = useMemo(() => {
    let result = hesheData;
    if (activePartId !== 'all') {
      const partObj = PARTS.find(p => p.id === activePartId);
      if (partObj?.match) {
        result = result.filter(r => r.part.includes(partObj.match));
      }
    }
    if (selectedDifficulty !== 'all') {
      result = result.filter(r => r.difficulty === selectedDifficulty);
    }
    return result;
  }, [activePartId, selectedDifficulty]);

  // Reset deck when filter changes
  useEffect(() => {
    setDeck(filteredList);
    setCurrentIndex(0);
    setIsRevealed(false);
  }, [filteredList]);

  if (!isOpen) return null;

  const currentCard: HeSheRiddle | undefined = deck[currentIndex];
  const isCardFavorite = currentCard ? favorites.includes(`riddle-${currentCard.id}`) : false;

  const handleNext = () => {
    if (deck.length === 0) return;
    if (hapticsEnabled) triggerHaptic(15);
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    if (deck.length === 0) return;
    if (hapticsEnabled) triggerHaptic(15);
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    if (deck.length <= 1) return;
    if (soundEnabled) playShuffle();
    if (hapticsEnabled) triggerHaptic(30);
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsRevealed(false);
    showToast('הקלפים עורבבו בהצלחה! 🎲');
  };

  const handleToggleReveal = () => {
    if (!isRevealed) {
      if (soundEnabled) playSuccess();
      if (hapticsEnabled) triggerHaptic(25);
    }
    setIsRevealed(!isRevealed);
  };

  const handleToggleFav = () => {
    if (!currentCard) return;
    if (hapticsEnabled) triggerHaptic(20);
    toggleFavorite(`riddle-${currentCard.id}`);
  };

  const handleShare = async () => {
    if (!currentCard) return;
    if (hapticsEnabled) triggerHaptic(15);
    const text = `✨ *חידת "הוא והיא" מתוך אפליקציית שלוף* ✨\n\n"${currentCard.question}"\n\n||תשובה: ${currentCard.answer}||\n🏷️ ${currentCard.part}\n\n📲 https://shluf-pakal.org`;
    await shareContent('שלוף - חידת הוא והיא', text);
    showToast('החידה הועתקה / שותפה בהצלחה! 📲');
  };

  const getDifficultyBadge = (diff?: string) => {
    switch (diff) {
      case 'easy':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">🟢 קליל</span>;
      case 'hard':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-600 dark:text-rose-400">🔴 מאתגר</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400">🟡 בינוני</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className={`w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col max-h-[95vh] overflow-hidden ${
          isCampfire 
            ? 'bg-black border-campfire-border/90 text-orange-100 shadow-fire' 
            : 'bg-[#fffdf7] border-sky-300 text-stone-900 shadow-2xl'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className={`px-4 py-3 flex items-center justify-between border-b ${
          isCampfire ? 'border-stone-800 bg-stone-950/80' : 'border-sky-100 bg-sky-50/70'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isCampfire ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-600 text-white shadow-sm'
            }`}>
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-sm sm:text-base">משחק "הוא והיא"</h2>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300">
                  {deck.length} הגדרות
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                כרטיס {deck.length > 0 ? currentIndex + 1 : 0} מתוך {deck.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowInstructions(true)}
              className="p-2 rounded-full text-stone-500 hover:text-sky-600 dark:text-stone-400 dark:hover:text-sky-300 transition-colors touch-press"
              title="הוראות משחק"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={toggleSound}
              className="p-2 rounded-full text-stone-500 hover:text-sky-600 dark:text-stone-400 dark:hover:text-sky-300 transition-colors touch-press"
              title={soundEnabled ? 'השתק צלילים' : 'הפעל צלילים'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 opacity-40" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors touch-press"
              title="סגור משחק"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subcategories Horizontal Scroll Filter */}
        <div className={`px-3 py-2 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar ${
          isCampfire ? 'border-stone-800/80 bg-stone-900/40' : 'border-sky-100/80 bg-white/70'
        }`}>
          {PARTS.map(part => {
            const isActive = activePartId === part.id;
            return (
              <button
                key={part.id}
                onClick={() => {
                  if (hapticsEnabled) triggerHaptic(10);
                  setActivePartId(part.id);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all touch-press ${
                  isActive
                    ? isCampfire
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-sky-600 text-white shadow-sm'
                    : isCampfire
                      ? 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{part.label}</span>
                <span className={`mr-1 text-[10px] opacity-80`}>({part.count})</span>
              </button>
            );
          })}
        </div>

        {/* Main Card Arena */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto flex flex-col justify-between">
          {deck.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="font-bold text-sm">אין חידות התואמות לסינון זה</p>
            </div>
          ) : currentCard ? (
            <div className="space-y-4">
              {/* Card Meta Badges */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-sky-600 dark:text-sky-400">
                  {currentCard.part}
                </span>
                <div className="flex items-center gap-2">
                  {getDifficultyBadge(currentCard.difficulty)}
                  <span className="text-[11px] font-mono opacity-50">#{currentCard.num}</span>
                </div>
              </div>

              {/* The Riddle Definition (Large, high-contrast field text) */}
              <div className={`p-5 sm:p-6 rounded-3xl border transition-all text-center flex flex-col items-center justify-center min-h-[160px] sm:min-h-[190px] shadow-sm ${
                isCampfire 
                  ? 'bg-stone-950 border-stone-800 text-orange-100' 
                  : 'bg-white border-amber-200/90 text-stone-900 shadow-md'
              }`}>
                <p className="text-lg sm:text-2xl font-black leading-relaxed tracking-wide">
                  "{currentCard.question}"
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-400">
                  <span>💡 מקריאים למעגל ומגלים מי יפצח ראשון</span>
                </div>
              </div>

              {/* Reveal Solution Action Container (#2: Single button reveals both) */}
              <div className="pt-1">
                {!isRevealed ? (
                  <button
                    onClick={handleToggleReveal}
                    className={`w-full py-3.5 rounded-2xl font-black text-sm sm:text-base transition-all touch-press flex items-center justify-center gap-2 shadow-md ${
                      isCampfire
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-500 hover:to-amber-500'
                        : 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white hover:opacity-95'
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                    <span>חשוף פתרון (הוא והיא)</span>
                  </button>
                ) : (
                  <div className={`p-4 sm:p-5 rounded-2xl border animate-fade-in transition-all ${
                    isCampfire 
                      ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200' 
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-md'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>הפתרון השנון:</span>
                      </span>
                      <button
                        onClick={handleToggleReveal}
                        className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center gap-1 touch-press"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>הסתר</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center py-1">
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/50 border border-emerald-200/60 dark:border-stone-800">
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 font-bold mb-0.5">הוא (זכר)</div>
                        <div className="text-base sm:text-lg font-black text-sky-700 dark:text-sky-300">{currentCard.heAnswer}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/50 border border-emerald-200/60 dark:border-stone-800">
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 font-bold mb-0.5">היא (נקבה)</div>
                        <div className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-300">{currentCard.sheAnswer}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom Game Navigation Bar */}
        <div className={`p-3 sm:p-4 border-t flex items-center justify-between gap-2 ${
          isCampfire ? 'border-stone-800 bg-stone-950' : 'border-sky-100 bg-sky-50/50'
        }`}>
          {/* Prev Card */}
          <button
            onClick={handlePrev}
            disabled={deck.length <= 1}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all touch-press ${
              isCampfire 
                ? 'bg-stone-900 text-stone-200 hover:bg-stone-800 disabled:opacity-30' 
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-30 shadow-sm'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>הקודם</span>
          </button>

          {/* Shuffle Random */}
          <button
            onClick={handleShuffle}
            title="ערבב קלפים אקראית"
            className={`p-2.5 sm:px-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all touch-press ${
              isCampfire 
                ? 'bg-stone-900 text-amber-400 hover:bg-stone-800' 
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 shadow-sm'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">ערבב</span>
          </button>

          {/* Star Favorite */}
          <button
            onClick={handleToggleFav}
            title={isCardFavorite ? 'הסר מהפק"ל שלי' : 'שמור לפק"ל שלי'}
            className={`p-2.5 rounded-2xl font-bold transition-all touch-press ${
              isCardFavorite
                ? 'bg-amber-500 text-white shadow-md'
                : isCampfire
                  ? 'bg-stone-900 text-stone-400 hover:text-amber-400'
                  : 'bg-white border border-stone-200 text-stone-500 hover:text-amber-600 shadow-sm'
            }`}
          >
            <Star className={`w-4 h-4 ${isCardFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Share WhatsApp */}
          <button
            onClick={handleShare}
            title="שתף לוואטסאפ של המדריכים"
            className={`p-2.5 rounded-2xl font-bold transition-all touch-press ${
              isCampfire
                ? 'bg-stone-900 text-emerald-400 hover:bg-stone-800'
                : 'bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 shadow-sm'
            }`}
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Next Card */}
          <button
            onClick={handleNext}
            disabled={deck.length <= 1}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all touch-press text-white ${
              isCampfire 
                ? 'bg-sky-600 hover:bg-sky-500 disabled:opacity-30' 
                : 'bg-sky-600 hover:bg-sky-700 disabled:opacity-30 shadow-md'
            }`}
          >
            <span>הבא</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instructions Modal Sub-component */}
      <HeSheInstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
    </div>
  );
};
