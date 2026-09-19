import React from 'react';
import Link from 'next/link';
import { NextEventData } from '../../types/dashboard';

interface NextEventCardProps {
  event: NextEventData;
  onViewEvent?: () => void;
}

export const NextEventCard: React.FC<NextEventCardProps> = ({ event, onViewEvent }) => {
  return (
    <section className="my-6">
      <div className="group relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs transition-all hover:border-stone-300">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          {/* Left Column: Context, Date & Title */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                • NEXT EVENT
              </span>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium tracking-wide text-zinc-700">
                {event.date}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {event.status}
              </span>
            </div>

            <h2 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-600 pt-1">
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-zinc-900">{event.venue}</span>
              </div>
              <span className="text-stone-300">•</span>
              <div>
                <span className="font-semibold text-zinc-900">{event.volunteers}</span> volunteers deployed
              </div>
              <span className="text-stone-300">•</span>
              <div>
                <span className="font-semibold text-zinc-900">{event.openTasks}</span> open tasks
              </div>
            </div>
          </div>

          {/* Right Column: Key metrics & CTA */}
          <div className="flex shrink-0 items-center justify-between border-t border-stone-100 pt-5 sm:justify-start lg:border-t-0 lg:pt-0">
            {onViewEvent ? (
              <button
                type="button"
                onClick={onViewEvent}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-xs sm:text-sm font-medium text-white shadow-xs transition-transform duration-150 hover:bg-zinc-800"
              >
                <span>View event</span>
                <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-xs sm:text-sm font-medium text-white shadow-xs transition-transform duration-150 hover:bg-zinc-800"
              >
                <span>View event</span>
                <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
