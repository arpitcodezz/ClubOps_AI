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
    <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50/50 py-16 sm:py-20 lg:py-24 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Subtle, slow-moving background ambient decoration */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[580px] sm:h-[440px] sm:w-[760px] rounded-full bg-gradient-to-tr from-zinc-200/40 via-zinc-100/30 to-emerald-100/20 blur-3xl opacity-35 dark:from-zinc-800/25 dark:via-zinc-900/20 dark:to-emerald-950/15 dark:opacity-20 animate-subtle-drift will-change-transform" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Floating Operational Signal Card 1: Volunteer assigned */}
        <div className="pointer-events-none absolute left-2 top-6 z-20 hidden lg:flex xl:left-6 xl:top-10 animate-card-entrance-1">
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/90 bg-white/95 px-3 py-2 shadow-xs backdrop-blur-sm dark:border-zinc-800/90 dark:bg-zinc-900/95 animate-float-1">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-800/40">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Volunteer assigned</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Audio/Visual Crew • Hall 1</p>
            </div>
          </div>
        </div>

        {/* Floating Operational Signal Card 2: 3 tasks due today */}
        <div className="pointer-events-none absolute right-2 top-12 z-20 hidden lg:flex xl:right-6 xl:top-16 animate-card-entrance-2">
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/90 bg-white/95 px-3 py-2 shadow-xs backdrop-blur-sm dark:border-zinc-800/90 dark:bg-zinc-900/95 animate-float-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-600 ring-1 ring-sky-600/20 dark:bg-sky-950/60 dark:text-sky-400 dark:ring-sky-800/40">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">3 tasks due today</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Stage Setup & Mic Check</p>
            </div>
          </div>
        </div>

        {/* Floating Operational Signal Card 3: Event risk detected */}
        <div className="pointer-events-none absolute left-2 bottom-12 z-20 hidden lg:flex xl:left-8 xl:bottom-16 animate-card-entrance-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/90 bg-white/95 px-3 py-2 shadow-xs backdrop-blur-sm dark:border-zinc-800/90 dark:bg-zinc-900/95 animate-float-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-800/40">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Event risk detected</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Capacity threshold at 94%</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-2xs animate-hero-badge dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Campus Event Operations Platform</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl animate-hero-heading dark:text-zinc-50">
            Discover & Experience Every Event on Campus
          </h1>

          {/* Supporting Text */}
          <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg animate-hero-description dark:text-zinc-400">
            Your centralized portal for technical hackathons, cultural festivals, sports tournaments, and professional student workshops across all university clubs.
          </p>

          {/* Search bar inside Hero */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-hero-search">
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
            <div className="px-3 animate-hero-stat-1">
              <p className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                9
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Demo Events
              </p>
            </div>
            <div className="px-3 animate-hero-stat-2">
              <p className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                5
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Event Categories
              </p>
            </div>
            <div className="px-3 animate-hero-stat-3">
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
