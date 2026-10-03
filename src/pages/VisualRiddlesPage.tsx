import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  Search, 
  X, 
  Sparkles, 
  Tv, 
  QrCode, 
  Layers, 
  CalendarDays, 
  Compass, 
  Shuffle, 
  Maximize2,
  HelpCircle,
  Play
} from 'lucide-react';
import { visualData } from '../data/content';
import { VisualRiddle, HolidayTag } from '../types';
import { VisualRiddleCard } from '../components/visual/VisualRiddleCard';
import { PresenterModal } from '../components/visual/PresenterModal';
import { CircleShareQR } from '../components/visual/CircleShareQR';
import { VisualInstructionsModal } from '../components/visual/VisualInstructionsModal';
import { usePakalStore } from '../store/usePakalStore';
import { sanitizeSearchQuery } from '../lib/security';
import { playShuffle } from '../lib/sound';
import { triggerHaptic } from '../lib/haptics';
import { seededShuffle, deriveTopicSeed } from '../lib/random';

export const VisualRiddlesPage: React.FC = () => {
  const { themeMode, soundEnabled, hapticsEnabled, uxMode, deviceShuffleSeed, randomOrderEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const allRiddles = visualData as VisualRiddle[];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainCat, setActiveMainCat] = useState<'all' | 'holidays' | 'general' | 'geography'>('all');
  const [activeHoliday, setActiveHoliday] = useState<HolidayTag | 'all'>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Modal states
  const [presenterRiddle, setPresenterRiddle] = useState<VisualRiddle | null>(null);
  const [qrRiddle, setQrRiddle] = useState<VisualRiddle | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const holidaysList: { id: HolidayTag | 'all'; label: string }[] = [
    { id: 'all', label: 'כל החגים' },
    { id: 'rosh-hashana', label: 'ראש השנה' },
    { id: 'yom-kippur', label: 'יום כיפור' },
    { id: 'sukkot', label: 'סוכות' },
    { id: 'chanukah', label: 'חנוכה' },
    { id: 'tu-bishvat', label: 'ט"ו בשבט' },
    { id: 'purim', label: 'פורים' },
    { id: 'pesach', label: 'פסח' },
    { id: 'independence-day', label: 'יום העצמאות' },
    { id: 'lag-baomer', label: 'ל"ג בעומר' },
    { id: 'jerusalem-day', label: 'יום ירושלים' },
    { id: 'shavuot', label: 'שבועות' },
  ];

  // Filtering Logic with Device-Based Seeded Shuffle within active category/holiday
  const filteredRiddles = useMemo(() => {
    let result = allRiddles;

    if (activeMainCat !== 'all') {
      result = result.filter(r => r.mainCategory === activeMainCat);
    }

    if (activeMainCat === 'holidays' && activeHoliday !== 'all') {
      result = result.filter(r => r.holidayTag === activeHoliday);
    }

    if (activeDifficulty !== 'all') {
      result = result.filter(r => r.difficulty === activeDifficulty);
    }

    if (searchQuery.trim()) {
      const q = sanitizeSearchQuery(searchQuery).toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.answer.toLowerCase().includes(q) ||
        r.rebusFormulaDescription.toLowerCase().includes(q) ||
        r.explanation.toLowerCase().includes(q)
      );
    }

    if (!randomOrderEnabled) return result;
    const topicKey = `vr_${activeMainCat}_${activeHoliday}_${activeDifficulty}`;
    const seed = deriveTopicSeed(deviceShuffleSeed, topicKey);
    return seededShuffle(result, seed);
  }, [allRiddles, activeMainCat, activeHoliday, activeDifficulty, searchQuery, randomOrderEnabled, deviceShuffleSeed]);

  // Dynamic Category and Holiday Counts
  const categoryCounts = useMemo(() => ({
    all: allRiddles.length,
    holidays: allRiddles.filter(r => r.mainCategory === 'holidays').length,
    general: allRiddles.filter(r => r.mainCategory === 'general').length,
    geography: allRiddles.filter(r => r.mainCategory === 'geography').length,
  }), [allRiddles]);

  const holidayCounts = useMemo(() => {
    const counts: Record<string, number> = { all: categoryCounts.holidays };
    allRiddles.filter(r => r.mainCategory === 'holidays').forEach(r => {
      if (r.holidayTag) {
        counts[r.holidayTag] = (counts[r.holidayTag] || 0) + 1;
      }
    });
    return counts;
  }, [allRiddles, categoryCounts.holidays]);

  // Shuffler
  const handleRandomRiddle = () => {
    if (soundEnabled) playShuffle();
    if (hapticsEnabled) triggerHaptic([30, 40]);
    if (filteredRiddles.length > 0) {
      const random = filteredRiddles[Math.floor(Math.random() * filteredRiddles.length)];
      setPresenterRiddle(random);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      
      {/* Header Banner */}
      <div className={`p-4.5 rounded-2xl border transition-all ${
        isCampfire 
          ? 'bg-campfire-card border-campfire-border/90 text-orange-100 shadow-fire' 
          : 'bg-white border-amber-200/90 text-stone-900 shadow-field'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isCampfire ? 'bg-orange-600 text-white' : 'bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-md'
            }`}>
              <Palette className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-black tracking-tight">חידות בציורים ורבוסים</h2>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isCampfire ? 'bg-orange-950 text-orange-400' : 'bg-amber-100 text-amber-800'
                }`}>
                  {allRiddles.length} חידות ויזואליות
                </span>
              </div>
              <p className="text-xs text-stone-400">
                מסך מלא למעגל, זום, שידור מקרן וקוד QR שטח לסמארטפונים
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Carousel / Presentation Launcher (UX 2.0) */}
            {uxMode === 'enhanced' && (
              <button
                onClick={() => setPresenterRiddle(filteredRiddles[0] || allRiddles[0])}
                title="הפעלת מצגת חידות במעגל במסך מלא"
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all touch-press"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">הפעל במעגל</span>
              </button>
            )}

            <button
              onClick={() => setIsHelpOpen(true)}
              title="איך פותרים ומפעילים חידות בציורים?"
              className={`p-2.5 rounded-xl border transition-all touch-press flex items-center gap-1.5 text-xs font-bold ${
                isCampfire
                  ? 'bg-stone-900 border-stone-800 text-orange-400 hover:bg-stone-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span className="hidden sm:inline">איך פותרים?</span>
            </button>

            <button
              onClick={handleRandomRiddle}
              title="שלוף חידה בציורים למסך מלא"
              className={`p-2.5 rounded-xl border transition-all touch-press ${
                isCampfire
                  ? 'bg-stone-900 border-stone-800 text-orange-400 hover:bg-stone-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="mt-3.5 relative">
          <div className="absolute right-3 top-2.5 text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חפש לפי שם חידה, פתרון או מילות רבוס..."
            className={`w-full py-2.5 pr-9 pl-9 rounded-xl text-base sm:text-sm border focus:outline-none transition-all ${
              isCampfire
                ? 'bg-stone-950 border-stone-800 text-orange-100 focus:border-orange-500'
                : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-500 focus:bg-white'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 px-1 min-w-max">
          <button
            onClick={() => {
              setActiveMainCat('all');
              setActiveHoliday('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all touch-press border flex items-center gap-1.5 ${
              activeMainCat === 'all'
                ? isCampfire
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                  : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : isCampfire
                  ? 'bg-stone-900 text-stone-300 border-campfire-border/60 hover:text-white'
                  : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            <span>כל הציורים</span>
            <span className="text-[10px] opacity-80 font-bold">({categoryCounts.all})</span>
          </button>

          <button
            onClick={() => {
              setActiveMainCat('holidays');
              setActiveHoliday('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-press border flex items-center gap-1.5 ${
              activeMainCat === 'holidays'
                ? isCampfire
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                  : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : isCampfire
                  ? 'bg-stone-900 text-stone-300 border-campfire-border/60 hover:text-white'
                  : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>חגי ישראל</span>
            <span className="text-[10px] opacity-80 font-bold">({categoryCounts.holidays})</span>
          </button>

          <button
            onClick={() => {
              setActiveMainCat('general');
              setActiveHoliday('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-press border flex items-center gap-1.5 ${
              activeMainCat === 'general'
                ? isCampfire
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                  : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : isCampfire
                  ? 'bg-stone-900 text-stone-300 border-campfire-border/60 hover:text-white'
                  : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>פתגמים וביטויים</span>
            <span className="text-[10px] opacity-80 font-bold">({categoryCounts.general})</span>
          </button>

          <button
            onClick={() => {
              setActiveMainCat('geography');
              setActiveHoliday('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-press border flex items-center gap-1.5 ${
              activeMainCat === 'geography'
                ? isCampfire
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                  : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : isCampfire
                  ? 'bg-stone-900 text-stone-300 border-campfire-border/60 hover:text-white'
                  : 'bg-white text-stone-700 border-amber-200/80 hover:bg-amber-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>אתרים ומקומות</span>
            <span className="text-[10px] opacity-80 font-bold">({categoryCounts.geography})</span>
          </button>
        </div>
      </div>

      {/* Holiday Sub-Tabs when Holidays is active */}
      {activeMainCat === 'holidays' && (
        <div className="w-full overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 px-1 min-w-max">
            {holidaysList.map((h) => {
              const isActive = activeHoliday === h.id;
              const count = holidayCounts[h.id] ?? 0;
              return (
                <button
                  key={h.id}
                  onClick={() => setActiveHoliday(h.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap border transition-all touch-press flex items-center gap-1 ${
                    isActive
                      ? isCampfire
                        ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                        : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : isCampfire
                        ? 'bg-stone-900 text-stone-300 border-stone-800 hover:text-white'
                        : 'bg-white text-stone-600 border-amber-200/80 hover:bg-amber-50'
                  }`}
                >
                  <span>{h.label}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-stone-400">
          {activeMainCat === 'holidays' && activeHoliday !== 'all' ? (
            <>מוצגות {filteredRiddles.length} מתוך {categoryCounts.holidays} חידות חגים ({holidaysList.find(h => h.id === activeHoliday)?.label})</>
          ) : activeMainCat === 'general' ? (
            <>מוצגות {filteredRiddles.length} מתוך {categoryCounts.general} חידות פתגמים וביטויים</>
          ) : activeMainCat === 'geography' ? (
            <>מוצגות {filteredRiddles.length} מתוך {categoryCounts.geography} חידות אתרים ומקומות</>
          ) : (
            <>מוצגות {filteredRiddles.length} מתוך {categoryCounts.all} חידות בציורים</>
          )}
        </span>
      </div>

      {/* Riddles Grid */}
      {filteredRiddles.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${
          isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200'
        }`}>
          <Layers className="w-10 h-10 mx-auto mb-2 text-stone-400" />
          <h3 className="font-extrabold text-base mb-1">לא נמצאו חידות מתאימות</h3>
          <p className="text-xs text-stone-500">נסה לבחור קטגוריה אחרת או לנקות את החיפוש</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRiddles.map((riddle, index) => (
            <VisualRiddleCard
              key={riddle.id}
              riddle={riddle}
              index={index}
              onOpenPresenter={(r) => setPresenterRiddle(r)}
              onOpenQR={(r) => setQrRiddle(r)}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Presenter Modal */}
      {presenterRiddle && (
        <PresenterModal
          riddle={presenterRiddle}
          allRiddles={filteredRiddles}
          onClose={() => setPresenterRiddle(null)}
          onNavigateRiddle={(r) => setPresenterRiddle(r)}
          onOpenQR={(r) => setQrRiddle(r)}
        />
      )}

      {/* Circle Share QR Modal */}
      {qrRiddle && (
        <CircleShareQR
          riddle={qrRiddle}
          onClose={() => setQrRiddle(null)}
        />
      )}

      {/* Visual Instructions Modal */}
      <VisualInstructionsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
};
