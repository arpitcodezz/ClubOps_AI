import React from 'react';
import Link from 'next/link';

interface HeroOverviewProps {
  campus?: string;
  dateStr?: string;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  campus = 'Apex Tech University',
  dateStr = 'Today, 24 Oct',
}) => {
  return (
    <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          {/* Editorial Section Label */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
            <span className="text-zinc-400">•</span>
            <span>OVERVIEW</span>
            <span className="text-stone-300">/</span>
            <span className="font-normal text-zinc-400">{campus}</span>
            <span className="hidden text-stone-300 sm:inline">/</span>
            <span className="hidden font-normal text-zinc-400 sm:inline">{dateStr}</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
            Everything happening across your clubs.
          </h1>

          {/* Supporting Text */}
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            A single operational view of events, volunteers, tasks and risks.
          </p>
        </div>

        {/* Create Event Action */}
        <div className="shrink-0 pb-1">
          <Link
            href="/dashboard/president/events/new"
            className="group inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-xs sm:text-sm font-medium text-white shadow-xs transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-zinc-900"
          >
            <span>Create event</span>
            <span className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
