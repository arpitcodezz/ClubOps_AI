'use client';

import React from 'react';
import { SearchBar } from './SearchBar';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onExploreClick,
}) => {
  return (
    <section className="relative border-b border-zinc-200 bg-zinc-50/50 py-16 sm:py-20 lg:py-24 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Campus Event Operations Platform</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50">
            Discover & Experience Every Event on Campus
          </h1>

          {/* Supporting Text */}
          <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
            Your centralized portal for technical hackathons, cultural festivals, sports tournaments, and professional student workshops across all university clubs.
          </p>

          {/* Search bar inside Hero */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <div className="w-full sm:max-w-md">
              <SearchBar
                id="hero-search-input"
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search events, clubs, or venues..."
              />
            </div>
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Browse Events
            </button>
          </div>

          {/* Highlights / Metric Indicators */}
          <div className="mt-10 grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200 pt-8 dark:divide-zinc-800 dark:border-zinc-800">
            <div className="px-3">
              <p className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                9
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Demo Events
              </p>
            </div>
            <div className="px-3">
              <p className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                5
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Event Categories
              </p>
            </div>
            <div className="px-3">
              <p className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                1
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Unified Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
