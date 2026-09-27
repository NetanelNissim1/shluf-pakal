import React from 'react';
import { usePakalStore } from '../../store/usePakalStore';

interface SubCategoryTabsProps {
  subCategories: { name: string; count: number }[];
  activeSubCategory: string | null;
  onSelect: (sub: string | null) => void;
  totalCount: number;
}

export const SubCategoryTabs: React.FC<SubCategoryTabsProps> = ({
  subCategories,
  activeSubCategory,
  onSelect,
  totalCount,
}) => {
  const { themeMode } = usePakalStore();
  const isCampfire = themeMode === 'campfire';

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1.5 px-1 min-w-max">
        {/* All Pill */}
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-press flex items-center gap-1.5 border ${
            activeSubCategory === null
              ? isCampfire
                ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                : 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : isCampfire
                ? 'bg-stone-950 text-orange-200/70 border-campfire-border/60 hover:text-orange-200'
                : 'bg-white text-stone-600 border-amber-200/80 hover:bg-amber-50'
          }`}
        >
          <span>הכל</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
            activeSubCategory === null
              ? 'bg-white/20 text-white'
              : isCampfire ? 'bg-orange-950 text-orange-400' : 'bg-stone-100 text-stone-600'
          }`}>
            {totalCount}
          </span>
        </button>

        {/* Subcategory Pills */}
        {subCategories.map((sub) => {
          const isActive = activeSubCategory === sub.name;
          return (
            <button
              key={sub.name}
              onClick={() => onSelect(sub.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-press flex items-center gap-1.5 border ${
                isActive
                  ? isCampfire
                    ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                    : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : isCampfire
                    ? 'bg-stone-950 text-orange-200/70 border-campfire-border/60 hover:text-orange-200'
                    : 'bg-white text-stone-600 border-amber-200/80 hover:bg-amber-50'
              }`}
            >
              <span>{sub.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : isCampfire ? 'bg-orange-950 text-orange-400' : 'bg-stone-100 text-stone-600'
              }`}>
                {sub.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
