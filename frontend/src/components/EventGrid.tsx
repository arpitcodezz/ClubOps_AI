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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/60 py-16 px-6 text-center shadow-2xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-medium text-zinc-950">
          No campus events found
        </h3>
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-500">
          No events match your current search query or category filter. Try clearing filters to view all scheduled events.
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-medium text-zinc-900 shadow-2xs hover:bg-stone-50"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-7 lg:gap-8">
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
