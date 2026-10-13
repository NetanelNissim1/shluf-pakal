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
            </button>
          );
        })}
      </div>
    </div>
  );
};
