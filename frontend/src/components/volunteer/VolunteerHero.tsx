'use client';

import React from 'react';

interface VolunteerHeroProps {
  onScrollToTasks?: () => void;
  onScrollToAssignments?: () => void;
  onScrollToShifts?: () => void;
  onScrollToNotices?: () => void;
}

export const VolunteerHero: React.FC<VolunteerHeroProps> = ({
  onScrollToTasks,
  onScrollToAssignments,
  onScrollToShifts,
  onScrollToNotices,
}) => {
  return (
    <section className="relative border-b border-stone-200/80 bg-[#fcfbf9] pt-12 pb-14 sm:pt-16 sm:pb-18">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              • VOLUNTEER OPERATIONS
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-zinc-950 leading-[1.12]">
            Know what needs to happen next.
          </h1>

          {/* Concise Supporting Text */}
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl font-normal">
            Your active shift schedule, venue checkpoints, coordinator briefing updates, and real-time task checklist for seamless on-ground event execution.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {onScrollToTasks && (
              <button
                type="button"
                onClick={onScrollToTasks}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-900 shadow-2xs hover:bg-stone-50 hover:border-stone-400 transition-all cursor-pointer"
              >
                <span>View My Tasks</span>
                <span className="text-zinc-400">↓</span>
              </button>
            )}

            {onScrollToAssignments && (
              <button
                type="button"
                onClick={onScrollToAssignments}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-900 shadow-2xs hover:bg-stone-50 hover:border-stone-400 transition-all cursor-pointer"
              >
                <span>My Assignments</span>
                <span className="text-zinc-400">↓</span>
              </button>
            )}

            {onScrollToShifts && (
              <button
                type="button"
                onClick={onScrollToShifts}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-900 shadow-2xs hover:bg-stone-50 hover:border-stone-400 transition-all cursor-pointer"
              >
                <span>Check In / Shifts</span>
                <span className="text-zinc-400">↓</span>
              </button>
            )}

            {onScrollToNotices && (
              <button
                type="button"
                onClick={onScrollToNotices}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-100/70 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-stone-200/70 transition-all cursor-pointer"
              >
                <span>Notices & Briefings</span>
                <span className="text-zinc-500">↓</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
