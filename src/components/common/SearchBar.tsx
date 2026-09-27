import React from 'react';
import { Search, X } from 'lucide-react';
import { usePakalStore } from '../../store/usePakalStore';

interface SearchBarProps {
  placeholder?: string;
  totalMatches?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'חיפוש מהיר בכל החידות והתשובות...',
  totalMatches
}) => {
  const { searchQuery, setSearchQuery, themeMode } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  return (
    <div className="relative w-full">
      <div className={`relative flex items-center w-full rounded-2xl border transition-all duration-200 ${
        isCampfire
          ? 'bg-stone-950 border-campfire-border/80 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
          : 'bg-white border-amber-200/90 shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20'
      }`}>
        <div className="pr-3.5 pl-2 text-stone-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full py-3 pl-10 pr-1 text-base bg-transparent border-0 focus:outline-none placeholder:text-stone-400 ${
            isCampfire ? 'text-orange-100' : 'text-stone-900'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="נקה חיפוש"
            className="absolute left-3 p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {searchQuery && totalMatches !== undefined && (
        <div className={`mt-1.5 px-3 text-xs font-medium flex items-center justify-between ${
          isCampfire ? 'text-orange-400' : 'text-amber-800'
        }`}>
          <span>נמצאו {totalMatches} תוצאות עבור "{searchQuery}"</span>
          <button 
            onClick={() => setSearchQuery('')}
            className="underline opacity-80 hover:opacity-100"
          >
            איפוס
          </button>
        </div>
      )}
    </div>
  );
};
