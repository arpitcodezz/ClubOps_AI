'use client';

import React from 'react';
import { Event } from '../types/event';
import { EventCard } from './EventCard';

interface EventGridProps {
  events: Event[];
  onViewDetails: (event: Event) => void;
  onRegister: (event: Event) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  onViewDetails,
  onRegister,
  onResetFilters,
  isFiltered,
}) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-16 px-6 text-center dark:border-zinc-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          No events found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          We couldn&apos;t find any events matching your current search or category filter.
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-800 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          index={index}
          onViewDetails={onViewDetails}
          onRegister={onRegister}
        />
      ))}
    </div>
  );
};
