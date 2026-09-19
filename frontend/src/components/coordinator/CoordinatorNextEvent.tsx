import React from 'react';
import { CoordinatorNextEvent as CoordinatorNextEventType } from '../../types/coordinator';

interface CoordinatorNextEventProps {
  event: CoordinatorNextEventType;
  onManageEvent: () => void;
}

export const CoordinatorNextEventCard: React.FC<CoordinatorNextEventProps> = ({
  event,
  onManageEvent,
}) => {
  return (
    <section className="my-6">
      <div className="group relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-2xs transition-all hover:border-stone-300">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          {/* Left Column: Context, Title, Venue, Prep Progress */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                • NEXT UPCOMING EVENT
              </span>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium tracking-wide text-zinc-700">
                {event.date}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {event.preparationStatus}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal tracking-tight text-zinc-950 leading-tight">
              {event.title}
            </h2>

            {/* Preparation Progress Bar */}
            <div className="max-w-md pt-1">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
                <span className="font-medium">Operational Readiness</span>
                <span className="font-semibold text-zinc-950 tabular-nums">{event.progressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100 border border-stone-200/60">
                <div
                  className="h-full rounded-full bg-zinc-950 transition-all duration-500"
                  style={{ width: `${event.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Metadata Badges & Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">📍</span>
                <span className="font-medium text-zinc-900">{event.venue}</span>
              </div>
              <span className="text-stone-300">•</span>
              <div>
                <span className="text-stone-400">🕒</span>{' '}
                <span className="text-stone-700">{event.time}</span>
              </div>
              <span className="text-stone-300">•</span>
              <div>
                <span className="font-semibold text-zinc-900">{event.volunteersAssigned}</span> / {event.volunteersNeeded} volunteers
              </div>
              <span className="text-stone-300">•</span>
              <div>
                <span className="font-semibold text-zinc-900">{event.openTasks}</span> open tasks
              </div>
            </div>
          </div>

          {/* Right Column: CTA */}
          <div className="flex shrink-0 items-center justify-between border-t border-stone-100 pt-5 sm:justify-start lg:border-t-0 lg:pt-0">
            <button
              type="button"
              onClick={onManageEvent}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-xs sm:text-sm font-medium text-white shadow-xs transition-colors hover:bg-zinc-800"
            >
              <span>Manage event</span>
              <span className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
