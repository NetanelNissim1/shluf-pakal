import React from 'react';
import { Home, Layers, Sparkles, Trophy, Star, Compass, Palette } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

export type NavTab = 'home' | 'categories' | 'odt' | 'visual' | 'taboo' | 'pakal';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { themeMode, favorites, openRandomizer } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 transition-colors duration-200 border-t pb-safe ${
      isCampfire 
        ? 'bg-black/95 border-campfire-border/80 text-orange-200 shadow-fire' 
        : 'bg-white/95 border-amber-200/80 text-stone-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
    } backdrop-blur-md`}>
      <div className="max-w-lg mx-auto px-1.5 h-16 flex items-center justify-between relative">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all touch-press ${
            currentTab === 'home'
              ? isCampfire ? 'text-orange-400 font-bold' : 'text-amber-600 font-bold'
              : isCampfire ? 'text-stone-400 hover:text-orange-300' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className={`w-4.5 h-4.5 mb-0.5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">ראשי</span>
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => onTabChange('categories')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all touch-press ${
            currentTab === 'categories'
              ? isCampfire ? 'text-orange-400 font-bold' : 'text-amber-600 font-bold'
              : isCampfire ? 'text-stone-400 hover:text-orange-300' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className={`w-4.5 h-4.5 mb-0.5 ${currentTab === 'categories' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">חידות</span>
        </button>

        {/* Tab 3: ODT */}
        <button
          onClick={() => onTabChange('odt')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all touch-press ${
            currentTab === 'odt'
              ? isCampfire ? 'text-orange-400 font-bold' : 'text-amber-600 font-bold'
              : isCampfire ? 'text-stone-400 hover:text-orange-300' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Compass className={`w-4.5 h-4.5 mb-0.5 ${currentTab === 'odt' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">ODT</span>
        </button>

        {/* CENTER FAB: "שלוף לי!" (The Randomizer) */}
        <div className="flex-1 flex justify-center -mt-7">
          <button
            onClick={openRandomizer}
            data-tour="tour-fab"
            aria-label="שלוף שאלה אקראית"
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center shadow-xl border-4 transition-all transform active:scale-95 ${
              isCampfire
                ? 'bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 border-black text-black shadow-orange-600/50'
                : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 border-white text-white shadow-amber-500/40'
            }`}
          >
            <Sparkles className="w-5 h-5 stroke-[2.5] animate-spin-slow" />
            <span className="text-[9px] font-black -mt-0.5 tracking-tight">שלוף!</span>
          </button>
        </div>

        {/* Tab 4: Visual Riddles */}
        <button
          onClick={() => onTabChange('visual')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all touch-press ${
            currentTab === 'visual'
              ? isCampfire ? 'text-orange-400 font-bold' : 'text-amber-600 font-bold'
              : isCampfire ? 'text-stone-400 hover:text-orange-300' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Palette className={`w-4.5 h-4.5 mb-0.5 ${currentTab === 'visual' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">ציורים</span>
        </button>

        {/* Tab 5: Taboo Game */}
        <button
          onClick={() => onTabChange('taboo')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all touch-press ${
            currentTab === 'taboo'
              ? isCampfire ? 'text-orange-400 font-bold' : 'text-amber-600 font-bold'
              : isCampfire ? 'text-stone-400 hover:text-orange-300' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Trophy className={`w-4.5 h-4.5 mb-0.5 ${currentTab === 'taboo' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">טאבו</span>
        </button>

        {/* Tab 6: My Pakal */}
        <button
          onClick={() => onTabChange('pakal')}
          data-tour="tour-pakal"
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all touch-press ${
            currentTab === 'pakal'
              ? isCampfire ? 'text-orange-400 font-bold' : 'text-amber-600 font-bold'
              : isCampfire ? 'text-stone-400 hover:text-orange-300' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <Star className={`w-4.5 h-4.5 mb-0.5 ${currentTab === 'pakal' ? 'stroke-[2.5] fill-current' : 'stroke-2'}`} />
            {favorites.length > 0 && (
              <span className={`absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 text-[9px] font-black rounded-full flex items-center justify-center ${
                isCampfire 
                  ? 'bg-orange-500 text-black' 
                  : 'bg-amber-600 text-white shadow-sm'
              }`}>
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">הפק"ל</span>
        </button>

      </div>
    </nav>
  );
};

