import React from 'react';
import { 
  Link2, 
  Trees, 
  Compass, 
  Brain, 
  Music, 
  Trophy, 
  ChevronLeft, 
  Flame, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CalendarDays,
  Palette,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { riddlesData, tabooData, visualData, hesheData, trueFalseData, allCombinedRiddles } from '../data/content';
import { CATEGORIES } from '../data/categories';
import { RiddleItem, CategoryId } from '../types';
import { SearchBar } from '../components/common/SearchBar';
import { SituationChips } from '../components/common/SituationChips';
import { DifficultyFilter } from '../components/common/DifficultyFilter';
import { RiddleCard } from '../components/riddles/RiddleCard';
import { usePakalStore } from '../store/usePakalStore';
import { sanitizeSearchQuery } from '../lib/security';
import { seededShuffle, deriveTopicSeed } from '../lib/random';

interface HomePageProps {
  onNavigateCategory: (catId: CategoryId) => void;
  onNavigateTaboo: () => void;
  onNavigatePakal: () => void;
  onNavigateODT?: () => void;
  onNavigateVisual?: () => void;
  onNavigateTrueFalse?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Link: Link2,
  Trees: Trees,
  Compass: Compass,
  Brain: Brain,
  Music: Music,
  CalendarDays: CalendarDays,
  Sparkles: Sparkles,
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateCategory,
  onNavigateTaboo,
  onNavigatePakal,
  onNavigateODT,
  onNavigateVisual,
  onNavigateTrueFalse,
}) => {
  const { 
    themeMode, 
    searchQuery, 
    activeSituation, 
    activeDifficulty,
    favorites,
    revealedMap,
    revealAll,
    hideAll,
    openFeedbackDrawer,
    deviceShuffleSeed,
    randomOrderEnabled
  } = usePakalStore();

  const isCampfire = themeMode === 'campfire';
  const allRiddles = allCombinedRiddles as RiddleItem[];

  // Filter logic
  let filteredRiddles = allRiddles;

  // Situation Filter
  if (activeSituation === 'pakal') {
    filteredRiddles = filteredRiddles.filter((r) => favorites.includes(r.id));
  } else if (activeSituation === 'bus') {
    filteredRiddles = filteredRiddles.filter((r) => r.tags.includes('אוטובוס'));
  } else if (activeSituation === 'walking') {
    filteredRiddles = filteredRiddles.filter((r) => r.tags.includes('הליכה'));
  } else if (activeSituation === 'campfire') {
    filteredRiddles = filteredRiddles.filter((r) => r.tags.includes('מדורה'));
  } else if (activeSituation === 'icebreaker') {
    filteredRiddles = filteredRiddles.filter((r) => r.tags.includes('שבירת-קרח'));
  } else if (activeSituation === 'holidays') {
    filteredRiddles = filteredRiddles.filter((r) => r.categoryId === 'israeli-holidays');
  }

  // Difficulty Filter
  if (activeDifficulty !== 'all') {
    filteredRiddles = filteredRiddles.filter((r) => r.difficulty === activeDifficulty);
  }

  // Search Query Filter
  if (searchQuery.trim()) {
    const q = sanitizeSearchQuery(searchQuery).toLowerCase();
    filteredRiddles = filteredRiddles.filter(
      (r) =>
        r.question.toLowerCase().includes(q) ||
        r.answer.toLowerCase().includes(q) ||
        r.subCategory.toLowerCase().includes(q)
    );
  }

  const isFiltering = searchQuery.trim().length > 0 || activeSituation !== 'all' || activeDifficulty !== 'all';

  if (isFiltering && randomOrderEnabled) {
    const seed = deriveTopicSeed(deviceShuffleSeed, `home_${activeSituation}_${activeDifficulty}`);
    filteredRiddles = seededShuffle(filteredRiddles, seed);
  }

  const displayedRiddles = filteredRiddles.slice(0, 40); // Fast initial rendering

  // Counts by category
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = allRiddles.filter((r) => r.categoryId === cat.id).length;
    return acc;
  }, {} as Record<string, number>);

  const displayedIds = displayedRiddles.map((r) => r.id);
  const allShownAreRevealed = displayedIds.length > 0 && displayedIds.every((id) => !!revealedMap[id]);

  return (
    <div className="space-y-5 pb-24">
      
      {/* Search Input Bar */}
      <div>
        <SearchBar totalMatches={isFiltering ? filteredRiddles.length : undefined} />
      </div>

      {/* Field Situation Chips */}
      <div data-tour="tour-situations">
        <SituationChips />
      </div>

      {/* Difficulty Filter */}
      <div className="px-1">
        <DifficultyFilter />
      </div>

      {/* When filtering or searching: Show filtered results */}
      {isFiltering ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-extrabold flex items-center gap-1.5">
              <span>תוצאות סינון</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 dark:text-orange-400">
                {filteredRiddles.length} חידות
              </span>
            </h2>

            {filteredRiddles.length > 0 && (
              <button
                onClick={() => allShownAreRevealed ? hideAll() : revealAll(displayedIds)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                  isCampfire 
                    ? 'border-campfire-border bg-stone-900 text-orange-300' 
                    : 'border-amber-200 bg-white text-stone-700 shadow-sm'
                }`}
              >
                {allShownAreRevealed ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>הסתר הכל</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>חשוף הכל</span>
                  </>
                )}
              </button>
            )}
          </div>

          {filteredRiddles.length === 0 ? (
            <div className={`p-8 text-center rounded-2xl border ${
              isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200'
            }`}>
              <Sparkles className="w-10 h-10 mx-auto mb-2 text-stone-400" />
              <h3 className="font-extrabold text-base mb-1">לא נמצאו חידות מתאימות</h3>
              <p className="text-xs text-stone-500">נסה לחפש מילים אחרות או להסיר את הסינון</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedRiddles.map((riddle, index) => (
                <RiddleCard key={riddle.id} riddle={riddle} index={index} />
              ))}
              {filteredRiddles.length > 40 && (
                <p className="text-center text-xs text-stone-400 py-2">
                  מוצגות 40 מתוך {filteredRiddles.length} חידות. צמצם את החיפוש לתוצאות מדויקות יותר.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Default Dashboard View */
        <>
          {/* Quick Field Modules Banners Grid */}
          <div className="grid grid-cols-1 gap-2.5" data-tour="tour-games">
            {/* 1. ODT Activities Banner */}
            <div 
              onClick={onNavigateODT}
              className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer touch-press relative overflow-hidden group ${
                isCampfire
                  ? 'bg-gradient-to-r from-emerald-950 via-campfire-card to-stone-950 border-emerald-600/70 shadow-fire'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-400 shadow-md shadow-emerald-600/20'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isCampfire ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 shadow-md'
                  }`}>
                    <Compass className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-base sm:text-lg">אימוני שטח ו-ODT</span>
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                        101 מתודות
                      </span>
                    </div>
                    <p className={`text-xs ${isCampfire ? 'text-emerald-200/80' : 'text-emerald-100'}`}>
                      פיתוח צוות, טיימר שטח משולב ופילטור לפי ציוד
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>

            {/* 2. Visual Riddles Banner */}
            <div 
              onClick={onNavigateVisual}
              data-tour="tour-visual"
              className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer touch-press relative overflow-hidden group ${
                isCampfire
                  ? 'bg-gradient-to-r from-purple-950 via-campfire-card to-stone-950 border-purple-600/70 shadow-fire'
                  : 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 text-white border-rose-400 shadow-md shadow-rose-500/20'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isCampfire ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 shadow-md'
                  }`}>
                    <Palette className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-base sm:text-lg">חידות בציורים ורבוסים</span>
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                        {visualData.length} חידות בציורים
                      </span>
                    </div>
                    <p className={`text-xs ${isCampfire ? 'text-rose-200/80' : 'text-rose-100'}`}>
                      הפעלה מהירה במעגל, שידור מקרן וסריקת QR לשטח
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>

            {/* 3. Taboo Game Banner */}
            <div 
              onClick={onNavigateTaboo}
              className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer touch-press relative overflow-hidden group ${
                isCampfire
                  ? 'bg-gradient-to-r from-red-950 via-campfire-card to-stone-950 border-orange-600/70 shadow-fire'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-amber-400 shadow-md shadow-amber-500/20'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isCampfire ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 shadow-md'
                  }`}>
                    <Trophy className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-base sm:text-lg">משחק טאבו שטח</span>
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                        {tabooData.length} כרטיסים
                      </span>
                    </div>
                    <p className={`text-xs ${isCampfire ? 'text-orange-200/80' : 'text-amber-100'}`}>
                      מסך זינוק והסתרה, השתקה מהירה, טיימר מונפש ותחרות קבוצות
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>

            {/* 4. True or False Game Banner */}
            <div 
              onClick={onNavigateTrueFalse}
              className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer touch-press relative overflow-hidden group ${
                isCampfire
                  ? 'bg-gradient-to-r from-emerald-950 via-campfire-card to-stone-950 border-emerald-600/70 shadow-fire'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isCampfire ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 shadow-md'
                  }`}>
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-base sm:text-lg">משחק נכון / לא נכון</span>
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                        {trueFalseData.length} טענות
                      </span>
                    </div>
                    <p className={`text-xs ${isCampfire ? 'text-emerald-200/80' : 'text-emerald-100'}`}>
                      סרגל התקדמות, כפתור ענק לאגודל וטיפים מתחלפים להפעלה בשטח
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </div>

          {/* 5 Main Content Categories */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h2 className="text-lg font-black tracking-tight">קטגוריות תוכן שטח</h2>
                <p className="text-xs text-stone-500">בחירה לפי נושא הטיול או הפעילות</p>
              </div>
              <span className="text-xs font-bold text-stone-400">
                {allRiddles.length} חידות
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const IconComponent = ICON_MAP[cat.iconName] || Flame;
                const count = categoryCounts[cat.id] || 0;

                return (
                  <div
                    key={cat.id}
                    onClick={() => onNavigateCategory(cat.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer touch-press group relative overflow-hidden ${
                      isCampfire
                        ? 'bg-campfire-card border-campfire-border hover:border-orange-500/80 hover:bg-stone-900 shadow-fire'
                        : 'bg-white border-amber-200/90 hover:border-amber-400 hover:shadow-md shadow-field'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${cat.color} shadow-md shrink-0`}>
                          <IconComponent className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base leading-tight mb-1 group-hover:text-amber-600 dark:group-hover:text-orange-400 transition-colors">
                            {cat.title}
                          </h3>
                          <p className="text-xs text-stone-400 line-clamp-1 mb-2">
                            {cat.subtitle}
                          </p>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                            isCampfire 
                              ? 'bg-stone-950 text-orange-400 border-stone-800' 
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {count} שאלות
                          </span>
                        </div>
                      </div>

                      <ChevronLeft className="w-5 h-5 text-stone-400 group-hover:text-amber-600 dark:group-hover:text-orange-400 group-hover:-translate-x-1 transition-all shrink-0 mt-2" />
                    </div>
                  </div>
                );
              })}

              {/* Category Card: חידות בציורים ורבוסים */}
              <div
                onClick={onNavigateVisual}
                className={`p-5 rounded-2xl border transition-all cursor-pointer touch-press group relative overflow-hidden ${
                  isCampfire
                    ? 'bg-campfire-card border-campfire-border hover:border-purple-500/80 hover:bg-stone-900 shadow-fire'
                    : 'bg-white border-amber-200/90 hover:border-purple-400 hover:shadow-md shadow-field'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-amber-600 via-rose-600 to-purple-600 shadow-md shrink-0">
                      <Palette className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base leading-tight mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        חידות בציורים ורבוסים
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-1 mb-2">
                        חגים (108), פתגמים (25) ואתרים (21)
                      </p>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                        isCampfire 
                          ? 'bg-stone-950 text-purple-400 border-stone-800' 
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}>
                        {visualData.length} חידות בציורים
                      </span>
                    </div>
                  </div>

                  <ChevronLeft className="w-5 h-5 text-stone-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:-translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              </div>

              {/* Category Card: משחק טאבו שטח */}
              <div
                onClick={onNavigateTaboo}
                className={`p-5 rounded-2xl border transition-all cursor-pointer touch-press group relative overflow-hidden ${
                  isCampfire
                    ? 'bg-campfire-card border-campfire-border hover:border-orange-500/80 hover:bg-stone-900 shadow-fire'
                    : 'bg-white border-amber-200/90 hover:border-amber-400 hover:shadow-md shadow-field'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 shadow-md shrink-0">
                      <Trophy className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base leading-tight mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        משחק טאבו שטח
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-1 mb-2">
                        מילים אסורות, טיימר שטח ותחרות קבוצות
                      </p>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                        isCampfire 
                          ? 'bg-stone-950 text-orange-400 border-stone-800' 
                          : 'bg-orange-50 text-orange-800 border-orange-200'
                      }`}>
                        {tabooData.length} כרטיסים
                      </span>
                    </div>
                  </div>

                  <ChevronLeft className="w-5 h-5 text-stone-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:-translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              </div>

              {/* Category Card: משחק נכון / לא נכון */}
              <div
                onClick={onNavigateTrueFalse}
                className={`p-5 rounded-2xl border transition-all cursor-pointer touch-press group relative overflow-hidden ${
                  isCampfire
                    ? 'bg-campfire-card border-campfire-border hover:border-emerald-500/80 hover:bg-stone-900 shadow-fire'
                    : 'bg-white border-amber-200/90 hover:border-emerald-400 hover:shadow-md shadow-field'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 shadow-md shrink-0">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        משחק "נכון / לא נכון"
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-1 mb-2">
                        חבלי ארץ (84) ומועדי ישראל (68)
                      </p>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                        isCampfire 
                          ? 'bg-stone-950 text-emerald-400 border-stone-800' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {trueFalseData.length} שאלות שטח
                      </span>
                    </div>
                  </div>

                  <ChevronLeft className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:-translate-x-1 transition-all shrink-0 mt-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guide Tips Card */}
          <div className={`p-5 rounded-2xl border text-xs leading-relaxed ${
            isCampfire 
              ? 'bg-stone-950 border-campfire-border/60 text-stone-400' 
              : 'bg-amber-100/50 border-amber-200 text-stone-700'
          }`}>
            <div className="font-bold flex items-center gap-1.5 mb-1 text-sm text-stone-900 dark:text-orange-200">
              <span>🏕️ טיפ למדריך בשטח:</span>
            </div>
            <p>
              לחץ על כפתור <strong>"🎲 שלוף!"</strong> בתחתית המסך לשליפה מהירה של שאלה אקראית בכל שלב בהליכה או בהפסקת קפה. סמן שאלות בכוכב (★) להכנת פק"ל הדרכה אישי מראש!
            </p>
          </div>

          {/* Feedback & Suggestions Banner */}
          <div className={`p-5 rounded-2xl border text-xs leading-relaxed flex items-center justify-between gap-3 ${
            isCampfire 
              ? 'bg-stone-950 border-stone-800 text-stone-300' 
              : 'bg-emerald-50/70 border-emerald-200 text-stone-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                isCampfire ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-100 text-emerald-700'
              }`}>
                <Lightbulb className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-0.5">
                  יש לך רעיון לחידה או הצעה לייעול?
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  נשמח לשמוע! אנחנו קוראים כל הצעה של מדריכים ומעדכנים את הפק"ל באופן שוטף.
                </p>
              </div>
            </div>
            <button
              onClick={openFeedbackDrawer}
              className={`px-3 py-2 rounded-xl font-bold text-xs shrink-0 transition-all shadow-sm ${
                isCampfire
                  ? 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
              }`}
            >
              הצעת שיפור 💡
            </button>
          </div>
        </>
      )}
    </div>
  );
};
