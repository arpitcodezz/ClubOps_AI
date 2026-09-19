'use client';

import React from 'react';
import { SearchBar } from './SearchBar';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExploreClick: () => void;
  totalEventsCount?: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onExploreClick,
  totalEventsCount = 8,
}) => {
  return (
    <section className="relative border-b border-stone-200/80 bg-[#fcfbf9] py-16 sm:py-20 lg:py-24 min-h-[520px] lg:min-h-[580px] flex items-center justify-center">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 text-center flex flex-col items-center w-full">
        {/* Eyebrow Centered */}
        <div className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
          <span className="text-stone-400">•</span>
          <span>CAMPUS EVENT DISCOVERY</span>
        </div>

        {/* Dominant Headline: 84–92px on desktop, tight line-height, max-width ~1000px */}
        <h1 className="mt-5 text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[92px] font-serif font-normal tracking-tight text-zinc-950 leading-[0.96] sm:leading-[1.0] max-w-[1000px] mx-auto">
          What&apos;s happening <br />
          <span className="italic font-normal text-stone-700">on campus.</span>
        </h1>

        {/* Description Centered */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-stone-600 max-w-2xl mx-auto">
          Explore workshops, hackathons, sports tournaments, and student-led experiences across campus.
        </p>

        {/* Centered Search + Browse Button */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-center gap-3 w-full max-w-xl mx-auto">
          <div className="w-full sm:w-[440px] text-left">
            <SearchBar
              id="hero-search-input"
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search events, clubs, venues..."
            />
          </div>
          <button
            type="button"
            onClick={onExploreClick}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-zinc-950 shrink-0"
          >
            <span>Browse upcoming events</span>
            <span className="ml-1.5" aria-hidden="true">↓</span>
          </button>
        </div>

        {/* Centered Understated Statistics Row */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 flex items-center justify-center gap-8 sm:gap-14 max-w-lg w-full mx-auto">
          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl font-light text-zinc-950 block leading-none">
              {String(totalEventsCount).padStart(2, '0')}
            </span>
            <p className="mt-2 text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              Active Events
            </p>
          </div>

          <span className="h-6 w-px bg-stone-200" aria-hidden="true" />

          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl font-light text-zinc-950 block leading-none">
              05
            </span>
            <p className="mt-2 text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              Categories
            </p>
          </div>

          <span className="h-6 w-px bg-stone-200" aria-hidden="true" />

          <div className="text-center">
            <span className="font-serif text-3xl sm:text-4xl font-light text-zinc-950 block leading-none">
              01
            </span>
            <p className="mt-2 text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              Unified Platform
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
