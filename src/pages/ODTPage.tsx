import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Search, 
  X, 
  Sparkles, 
  Shuffle, 
  Compass, 
  Layers,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { odtData } from '../data/content';
import { ODTActivity } from '../types';
import { ODTCard } from '../components/odt/ODTCard';
import { ODTFilters, ODTFilterState } from '../components/odt/ODTFilters';
import { ODTInstructionsModal } from '../components/odt/ODTInstructionsModal';
import { usePakalStore } from '../store/usePakalStore';
import { sanitizeSearchQuery } from '../lib/security';
import { playShuffle } from '../lib/sound';
import { triggerHaptic } from '../lib/haptics';

export const ODTPage: React.FC = () => {
  const { themeMode, soundEnabled, hapticsEnabled } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  const allActivities = odtData as ODTActivity[];

  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(25);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [filters, setFilters] = useState<ODTFilterState>({
    equipmentFilter: 'all',
    durationFilter: 'all',
    environmentFilter: 'all',
    categoryFilter: 'all'
  });

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allActivities.forEach(a => set.add(a.category));
    return Array.from(set);
  }, [allActivities]);

  // Filtering Logic
  const filteredActivities = useMemo(() => {
    let result = allActivities;

    // Category
    if (filters.categoryFilter !== 'all') {
      result = result.filter(a => a.category === filters.categoryFilter);
    }

    // Equipment
    if (filters.equipmentFilter !== 'all') {
      if (filters.equipmentFilter === 'none') {
        result = result.filter(a => a.equipment.some(eq => eq.includes('אין') || eq.includes('ללא')));
      } else if (filters.equipmentFilter === 'rope') {
        result = result.filter(a => a.equipment.some(eq => eq.includes('חבל')));
      } else if (filters.equipmentFilter === 'blindfold') {
        result = result.filter(a => a.equipment.some(eq => eq.includes('עיניים') || eq.includes('כיסוי')));
      } else if (filters.equipmentFilter === 'wood') {
        result = result.filter(a => a.equipment.some(eq => eq.includes('קרש') || eq.includes('עץ') || eq.includes('לוח')));
      } else if (filters.equipmentFilter === 'water') {
        result = result.filter(a => a.equipment.some(eq => eq.includes('מים') || eq.includes('דלי') || eq.includes('כוס')));
      }
    }

    // Duration
    if (filters.durationFilter !== 'all') {
      if (filters.durationFilter === 'short') {
        result = result.filter(a => (a.durationMinutes || 15) <= 10);
      } else if (filters.durationFilter === 'medium') {
        result = result.filter(a => (a.durationMinutes || 15) === 15);
      } else if (filters.durationFilter === 'deep') {
        result = result.filter(a => (a.durationMinutes || 15) >= 20);
      } else if (filters.durationFilter === 'night') {
        result = result.filter(a => a.environment === 'night');
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = sanitizeSearchQuery(searchQuery).toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.instructions.toLowerCase().includes(q) ||
        a.groupValue.toLowerCase().includes(q) ||
        a.equipment.some(eq => eq.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allActivities, filters, searchQuery]);

  const visibleActivities = filteredActivities.slice(0, displayLimit);

  // Random Activity Shuffler
  const handleRandomActivity = () => {
    if (soundEnabled) playShuffle();
    if (hapticsEnabled) triggerHaptic([40, 50]);
    if (filteredActivities.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredActivities.length);
      const chosen = filteredActivities[randomIndex];
      // Search for this chosen activity
      setSearchQuery(chosen.title);
    }
  };

  // Find next activity suggestion for each card
  const getNextActivity = (current: ODTActivity): ODTActivity | undefined => {
    const sameCat = allActivities.filter(a => a.category === current.category && a.id !== current.id);
    if (sameCat.length > 0) {
      return sameCat[Math.floor(Math.random() * sameCat.length)];
    }
    return undefined;
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
              isCampfire ? 'bg-orange-600 text-white' : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md'
            }`}>
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-black tracking-tight">אימוני שטח ו-ODT</h2>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isCampfire ? 'bg-orange-950 text-orange-400' : 'bg-amber-100 text-amber-800'
                }`}>
                  101 מתודות
                </span>
              </div>
              <p className="text-xs text-stone-400">
                פיתוח צוות, מנהיגות, שיווי משקל ואמון הדדי בשטח
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              title="איך מפעילים מתודת ODT?"
              className={`p-2.5 rounded-xl border transition-all touch-press flex items-center gap-1.5 text-xs font-bold ${
                isCampfire
                  ? 'bg-stone-900 border-stone-800 text-orange-400 hover:bg-stone-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span className="hidden sm:inline">איך מפעילים?</span>
            </button>

            <button
              onClick={handleRandomActivity}
              title="שלוף פעילות אקראית"
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
            placeholder="חיפוש לפי שם משחק, ציוד (חבל, מים...) או ערך..."
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

      {/* Situational Filters */}
      <ODTFilters
        categories={categories}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setDisplayLimit(25);
        }}
        totalActivitiesCount={allActivities.length}
        filteredCount={filteredActivities.length}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-stone-400">
          מוצגות {visibleActivities.length} מתוך {filteredActivities.length} פעילויות ODT
        </span>
      </div>

      {/* Activities List */}
      {visibleActivities.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${
          isCampfire ? 'bg-stone-950 border-stone-800' : 'bg-white border-amber-200'
        }`}>
          <Layers className="w-10 h-10 mx-auto mb-2 text-stone-400" />
          <h3 className="font-extrabold text-base mb-1">לא נמצאו פעילויות מתאימות</h3>
          <p className="text-xs text-stone-500">נסה להסיר את הסינון או לחפש מילות מפתח אחרות</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {visibleActivities.map((act, index) => (
            <ODTCard
              key={act.id}
              activity={act}
              index={index}
              nextActivitySuggestion={getNextActivity(act)}
              onSelectNextActivity={(nextAct) => {
                setSearchQuery(nextAct.title);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          ))}

          {/* Load More */}
          {visibleActivities.length < filteredActivities.length && (
            <div className="text-center pt-2">
              <button
                onClick={() => setDisplayLimit(prev => prev + 25)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all touch-press inline-flex items-center gap-1.5 ${
                  isCampfire
                    ? 'bg-stone-900 border-stone-800 text-orange-400 hover:bg-stone-800'
                    : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50 shadow-sm'
                }`}
              >
                <span>טען עוד פעילויות ({filteredActivities.length - visibleActivities.length} נותרו)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions Modal */}
      <ODTInstructionsModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />

    </div>
  );
};
