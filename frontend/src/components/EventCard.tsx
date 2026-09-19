'use client';

import React from 'react';
import Image from 'next/image';
import { Event, RegistrationStatus } from '../types/event';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onRegister: (event: Event) => void;
}

const statusBadgeStyles: Record<RegistrationStatus, { bg: string; text: string; dot: string; label: string }> = {
  Open: {
    bg: 'bg-emerald-50 ring-emerald-600/20 dark:bg-emerald-950/40 dark:ring-emerald-800/50',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    label: 'Open',
  },
  'Filling Fast': {
    bg: 'bg-amber-50 ring-amber-600/20 dark:bg-amber-950/40 dark:ring-amber-800/50',
    text: 'text-amber-800 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'Filling Fast',
  },
  Waitlist: {
    bg: 'bg-sky-50 ring-sky-600/20 dark:bg-sky-950/40 dark:ring-sky-800/50',
    text: 'text-sky-700 dark:text-sky-400',
    dot: 'bg-sky-500',
    label: 'Waitlist',
  },
  Closed: {
    bg: 'bg-zinc-100 ring-zinc-500/20 dark:bg-zinc-800 dark:ring-zinc-700',
    text: 'text-zinc-600 dark:text-zinc-400',
    dot: 'bg-zinc-400',
    label: 'Closed',
  },
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onViewDetails,
  onRegister,
}) => {
  const statusConfig = statusBadgeStyles[event.registrationStatus];
  const isClosed = event.registrationStatus === 'Closed';

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* Banner Image Container */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={event.bannerUrl}
          alt={event.title}
          fill
          unoptimized
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
        />

        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-md bg-zinc-900/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
            {event.category}
          </span>
        </div>

        {/* Registration Status Badge overlay */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset backdrop-blur-xs ${statusConfig.bg} ${statusConfig.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} aria-hidden="true" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Club Name */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {event.clubName}
          </p>
          {event.fee && (
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {event.fee}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-white">
          {event.title}
        </h3>

        {/* Short Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          {event.shortDescription}
        </p>

        {/* Metadata Details (Date, Time, Venue) */}
        <div className="mt-4 space-y-1.5 border-t border-zinc-100 pt-3 text-xs text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-300">
          {/* Date */}
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="truncate font-medium">{event.date}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="truncate">{event.time}</span>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate" title={event.venue}>
              {event.venue}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onViewDetails(event)}
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 py-2 text-center text-xs font-medium text-zinc-100 shadow-xs transition-colors duration-150 hover:border-zinc-600 hover:bg-zinc-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white dark:focus-visible:outline-zinc-300"
          >
            View Details
          </button>

          <button
            type="button"
            disabled={isClosed}
            onClick={() => onRegister(event)}
            className={`flex-1 rounded-lg py-2 text-center text-xs font-medium shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${
              isClosed
                ? 'cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'
                : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            }`}
          >
            {isClosed ? 'Closed' : 'Register'}
          </button>
        </div>
      </div>
    </article>
  );
};
