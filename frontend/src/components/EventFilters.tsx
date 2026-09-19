'use client';

import React from 'react';
import { EventCategory } from '../types/event';

export type FilterCategory = 'All' | EventCategory;

interface EventFiltersProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  categoryCounts: Record<FilterCategory, number>;
}

const CATEGORIES: FilterCategory[] = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Competition',
];

export const EventFilters: React.FC<EventFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Event Categories">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        const count = categoryCounts[category] ?? 0;

        return (
          <button
            key={category}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(category)}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
              isSelected
                ? 'bg-zinc-950 text-white shadow-2xs'
                : 'border border-stone-200/90 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50 hover:text-zinc-950'
            }`}
          >
            <span>{category}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                isSelected
                  ? 'bg-zinc-800 text-stone-200'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
