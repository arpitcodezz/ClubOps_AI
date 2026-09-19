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
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${
              isSelected
                ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
            }`}
          >
            <span>{category}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold tabular-nums ${
                isSelected
                  ? 'bg-zinc-750 text-white/90 dark:bg-zinc-200 dark:text-zinc-800'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
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
