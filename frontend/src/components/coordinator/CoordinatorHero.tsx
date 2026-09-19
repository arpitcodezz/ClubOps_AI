import React from 'react';
import Link from 'next/link';

interface CoordinatorHeroProps {
  campus?: string;
  dateStr?: string;
  onScrollToTasks?: () => void;
  onScrollToVolunteers?: () => void;
  onScrollToEvents?: () => void;
}

export const CoordinatorHero: React.FC<CoordinatorHeroProps> = ({
  campus = 'Apex Tech University',
  dateStr = 'Today, 24 Oct',
  onScrollToTasks,
  onScrollToVolunteers,
  onScrollToEvents,
}) => {
  return (
    <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          {/* Editorial Section Label */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
            <span className="text-zinc-400">•</span>
            <span>OPERATIONS</span>
            <span className="text-stone-300">/</span>
            <span className="font-normal text-zinc-400">{campus}</span>
            <span className="hidden text-stone-300 sm:inline">/</span>
            <span className="hidden font-normal text-zinc-400 sm:inline">{dateStr}</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="mt-2 text-3xl font-serif font-normal tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl leading-[1.08]">
            Keep every event moving.
          </h1>

          {/* Supporting Text */}
          <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-stone-600">
            Coordinate day-to-day execution across schedules, setup tasks, volunteer assignments, venue clearances, and operational risks.
          </p>

          {/* Quick Actions Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onScrollToTasks}
              className="inline-flex items-center rounded-lg border border-stone-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-2xs hover:bg-stone-50 transition-colors"
            >
              <span>Manage Tasks</span>
              <span className="ml-1 text-stone-400">↓</span>
            </button>
            <button
              type="button"
              onClick={onScrollToVolunteers}
              className="inline-flex items-center rounded-lg border border-stone-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-2xs hover:bg-stone-50 transition-colors"
            >
              <span>Manage Volunteers</span>
              <span className="ml-1 text-stone-400">↓</span>
            </button>
            <button
              type="button"
              onClick={onScrollToEvents}
              className="inline-flex items-center rounded-lg border border-stone-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-2xs hover:bg-stone-50 transition-colors"
            >
              <span>View Events</span>
              <span className="ml-1 text-stone-400">↓</span>
            </button>
          </div>
        </div>

        {/* Primary Action */}
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
