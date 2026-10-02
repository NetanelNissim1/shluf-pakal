import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  EyeOff, 
  Search, 
  X, 
  ChevronDown, 
  Layers,
  Palette,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { allCombinedRiddles, visualData, tabooData, trueFalseData } from '../data/content';
import { CATEGORIES } from '../data/categories';
import { RiddleItem, CategoryId } from '../types';
import { SubCategoryTabs } from '../components/riddles/SubCategoryTabs';
import { RiddleCard } from '../components/riddles/RiddleCard';
import { DifficultyFilter } from '../components/common/DifficultyFilter';
import { usePakalStore } from '../store/usePakalStore';
import { sanitizeSearchQuery } from '../lib/security';

interface CategoryPageProps {
  onNavigateVisual?: () => void;
  onNavigateTaboo?: () => void;
  onNavigateTrueFalse?: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  onNavigateVisual,
  onNavigateTaboo,
  onNavigateTrueFalse,
}) => {
  const { 
    themeMode, 
    activeCategory, 
    setActiveCategory, 
    activeSubCategory, 
    setActiveSubCategory,
    activeDifficulty,
    revealedMap,
    revealAll,
    hideAll
  } = usePakalStore();

  const isCampfire = themeMode === 'campfire';
  const allRiddles = allCombinedRiddles as RiddleItem[];

  const [localSearch, setLocalSearch] = useState('');
  const [displayLimit, setDisplayLimit] = useState(30);

  // Default to first category if none selected
  const currentCategoryId = activeCategory || CATEGORIES[0].id;
  const currentCategoryMeta = CATEGORIES.find((c) => c.id === currentCategoryId) || CATEGORIES[0];

  // Riddles in current category
  const categoryRiddles = useMemo(() => {
    return allRiddles.filter((r) => r.categoryId === currentCategoryId);
  }, [allRiddles, currentCategoryId]);

  // Overall counts per category for badges
  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = allRiddles.filter((r) => r.categoryId === cat.id).length;
      return acc;
    }, {} as Record<string, number>);
  }, [allRiddles]);

  // Unique subcategories with counts
  const subCategoryList = useMemo(() => {
    const map = new Map<string, number>();
    categoryRiddles.forEach((r) => {
      map.set(r.subCategory, (map.get(r.subCategory) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [categoryRiddles]);

  // Filtered by subCategory and local search
  const filteredRiddles = useMemo(() => {
    let result = categoryRiddles;
    if (activeSubCategory) {
      result = result.filter((r) => r.subCategory === activeSubCategory);
    }
    if (activeDifficulty !== 'all') {
      result = result.filter((r) => r.difficulty === activeDifficulty);
    }
    if (localSearch.trim()) {
      const q = sanitizeSearchQuery(localSearch).toLowerCase();
      result = result.filter(
        (r) =>
          r.question.toLowerCase().includes(q) ||
          r.answer.toLowerCase().includes(q) ||
          r.subCategory.toLowerCase().includes(q)
      );
    }
    return result;
  }, [categoryRiddles, activeSubCategory, activeDifficulty, localSearch]);

  const difficultyCounts = useMemo(() => {
    let pool = categoryRiddles;
    if (activeSubCategory) {
      pool = pool.filter((r) => r.subCategory === activeSubCategory);
    }
    return {
      all: pool.length,
      easy: pool.filter((r) => r.difficulty === 'easy').length,
      medium: pool.filter((r) => r.difficulty === 'medium').length,
      hard: pool.filter((r) => r.difficulty === 'hard').length,
    };
  }, [categoryRiddles, activeSubCategory]);

  const visibleRiddles = filteredRiddles.slice(0, displayLimit);
  const visibleIds = visibleRiddles.map((r) => r.id);
  const allRevealed = visibleIds.length > 0 && visibleIds.every((id) => !!revealedMap[id]);

  const handleToggleRevealAll = () => {
    if (allRevealed) {
      hideAll();
    } else {
      revealAll(visibleIds);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      
      {/* Category Horizontal Switcher */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 px-1 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === currentCategoryId;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveSubCategory(null);
                  setDisplayLimit(30);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all touch-press border flex items-center gap-1.5 ${
                  isActive
                    ? isCampfire
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-950/60'
                      : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : isCampfire
                      ? 'bg-stone-900 text-stone-300 border-campfire-border/60 hover:text-white'
                      : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-50'
                }`}
              >
                <span>{cat.title}</span>
                <span className="text-[10px] opacity-80 font-bold">({count})</span>
              </button>
            );
          })}

          {/* Quick Category Access: חידות בציורים */}
          {onNavigateVisual && (
            <button
              onClick={onNavigateVisual}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all touch-press border flex items-center gap-1.5 ${
                isCampfire
                  ? 'bg-stone-900 text-purple-300 border-purple-800/80 hover:bg-purple-950/60'
                  : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-purple-500" />
              <span>חידות בציורים</span>
              <span className="text-[10px] opacity-80 font-bold">({visualData.length})</span>
            </button>
          )}

          {/* Quick Category Access: משחק טאבו */}
          {onNavigateTaboo && (
            <button
              onClick={onNavigateTaboo}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all touch-press border flex items-center gap-1.5 ${
                isCampfire
                  ? 'bg-stone-900 text-orange-300 border-orange-800/80 hover:bg-orange-950/60'
                  : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-orange-500" />
              <span>טאבו שטח</span>
              <span className="text-[10px] opacity-80 font-bold">({tabooData.length})</span>
            </button>
          )}

          {/* Quick Category Access: משחק נכון / לא נכון */}
          {onNavigateTrueFalse && (
            <button
              onClick={onNavigateTrueFalse}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all touch-press border flex items-center gap-1.5 ${
                isCampfire
                  ? 'bg-stone-900 text-emerald-300 border-emerald-800/80 hover:bg-emerald-950/60'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>נכון / לא נכון</span>
              <span className="text-[10px] opacity-80 font-bold">({trueFalseData.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Info Header */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isCampfire 
          ? 'bg-campfire-card border-campfire-border/90 text-orange-100 shadow-fire' 
          : 'bg-white border-amber-200/90 text-stone-900 shadow-field'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black tracking-tight mb-1">
              {currentCategoryMeta.title}
            </h2>
            <p className="text-xs text-stone-400">
              {currentCategoryMeta.description}
            </p>
          </div>
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border shrink-0 ${
            isCampfire
              ? 'bg-stone-950 text-orange-400 border-stone-800'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {categoryRiddles.length} שאלות
          </span>
        </div>

        {/* Local Category Search Input */}
        <div className="mt-3 relative">
          <div className="absolute right-3 top-2.5 text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={`חפש בתוך ${currentCategoryMeta.title}...`}
            className={`w-full py-2 pr-9 pl-9 rounded-xl text-base sm:text-sm border focus:outline-none transition-all ${
              isCampfire
                ? 'bg-stone-950 border-stone-800 text-orange-100 focus:border-orange-500'
                : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-500 focus:bg-white'
            }`}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute left-3 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subcategory Pills */}
      <SubCategoryTabs
        subCategories={subCategoryList}
        activeSubCategory={activeSubCategory}
        onSelect={(sub) => {
          setActiveSubCategory(sub);
          setDisplayLimit(30);
        }}
        totalCount={categoryRiddles.length}
      />

      {/* Difficulty Level Filter */}
      <div className="px-1">
        <DifficultyFilter counts={difficultyCounts} />
      </div>

      {/* List Header & Anti-Peeking Global Toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs font-bold text-stone-500">
          מוצגות {visibleRiddles.length} מתוך {filteredRiddles.length}
        </div>

        {filteredRiddles.length > 0 && (
          <button
            onClick={handleToggleRevealAll}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 touch-press ${
              isCampfire
                ? 'bg-stone-900 border-campfire-border text-orange-300 hover:bg-stone-800'
                : 'bg-white border-amber-200 text-stone-700 hover:bg-amber-50 shadow-sm'
            }`}
          >
            {allRevealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>הסתר את כל הפתרונות</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span>חשוף הכל</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Riddle Cards List */}
      {visibleRiddles.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${
          isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200'
        }`}>
          <Layers className="w-10 h-10 mx-auto mb-2 text-stone-400" />
          <h3 className="font-extrabold text-base mb-1">לא נמצאו שאלות</h3>
          <p className="text-xs text-stone-500">נסה לבחור תת-נושא אחר או לנקות את החיפוש</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleRiddles.map((riddle, index) => (
            <RiddleCard key={riddle.id} riddle={riddle} index={index} />
          ))}

          {/* Load More Button */}
          {visibleRiddles.length < filteredRiddles.length && (
            <div className="text-center pt-2">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 40)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all touch-press inline-flex items-center gap-1.5 ${
                  isCampfire
                    ? 'bg-stone-900 border-stone-800 text-orange-400 hover:bg-stone-800'
                    : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50 shadow-sm'
                }`}
              >
                <span>טען עוד שאלות ({filteredRiddles.length - visibleRiddles.length} נותרו)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
