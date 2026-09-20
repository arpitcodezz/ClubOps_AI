'use client';

import React from 'react';
import Image from 'next/image';
import { Event, RegistrationStatus } from '../types/event';

interface EventCardProps {
  event: Event;
  index?: number;
  onViewDetails: (event: Event) => void;
  onRegister: (event: Event) => void;
}

const statusBadgeStyles: Record<
  RegistrationStatus,
  { text: string; dot: string; label: string }
> = {
  Open: {
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
    label: 'Registration Open',
  },
  'Filling Fast': {
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    label: 'Filling Fast',
  },
  Waitlist: {
    text: 'text-sky-800',
    dot: 'bg-sky-500',
    label: 'Waitlist',
  },
  Closed: {
    text: 'text-stone-500',
    dot: 'bg-stone-400',
    label: 'Closed',
  },
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  index = 0,
  onViewDetails,
  onRegister,
}) => {
  const statusConfig = statusBadgeStyles[event.registrationStatus];
  const isClosed = event.registrationStatus === 'Closed';
  
  return (
    <article
      className="group overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 lg:p-8 shadow-2xs hover:shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-400/80"
    >
      {/* Top Grid: TEXT LEFT (~62-65%), IMAGE RIGHT (~35-38%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] lg:gap-10 lg:items-center">
        {/* IMAGE: On mobile: order-1 (stacks on top); on desktop: lg:order-2 (fixed on RIGHT) */}
        <div className="w-full order-1 lg:order-2 flex items-center justify-center">
          <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-stone-100 shadow-2xs">
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              unoptimized
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

            {/* Banner Theme Tag Overlay */}
            {event.bannerConfig && (
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="inline-block rounded-md bg-zinc-950/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-xs">
                  {event.bannerConfig.theme}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT: On mobile: order-2 (under image); on desktop: lg:order-1 (strictly on LEFT) */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          {/* Top Row: CATEGORY • DATE & STATUS */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
                {event.category}
              </span>
              <span className="text-stone-300 font-light">•</span>
              <span className="text-stone-700 font-medium">{event.date}</span>
            </div>

            {/* Restrained Status Indicator */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} aria-hidden="true" />
              <span className={`text-[11px] font-medium ${statusConfig.text}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* CLUB NAME */}
          <p className="mt-2.5 text-xs font-semibold tracking-wider text-stone-500 uppercase">
            {event.clubName}
          </p>

          {/* EVENT TITLE (Editorial Serif, 34-38px desktop, wraps naturally) */}
          <h3 className="mt-1.5 text-2xl sm:text-3xl lg:text-[36px] font-serif font-normal text-zinc-950 leading-[1.12] tracking-tight group-hover:text-stone-700 transition-colors">
            {event.title}
          </h3>

          {/* AI Headline if present */}
          {event.headline && (
            <p className="mt-1 text-xs sm:text-sm italic font-serif text-stone-600">
              &ldquo;{event.headline}&rdquo;
            </p>
          )}

          {/* Short Description */}
          <p className="mt-2.5 text-sm text-stone-600 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3">
            {event.shortDescription || event.description}
          </p>
        </div>
      </div>

      {/* Subtle Divider across the card */}
      <div className="mt-6 pt-5 border-t border-stone-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Bottom Left: Venue • Time • Fee */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600">
          <div>
            <span className="font-semibold text-zinc-900">Venue:</span>{' '}
            <span className="text-stone-800">{event.venue}</span>
          </div>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <div>
            <span className="font-semibold text-zinc-900">Time:</span>{' '}
            <span className="text-stone-800">{event.time}</span>
          </div>
          {event.fee && (
            <>
              <span className="text-stone-300 hidden sm:inline">•</span>
              <div>
                <span className="font-semibold text-zinc-900">Fee:</span>{' '}
                <span className="text-stone-800">{event.fee}</span>
              </div>
            </>
          )}
        </div>

        {/* Bottom Right: View Details & Register */}
        <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={() => onViewDetails(event)}
            className="group/btn inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-medium text-zinc-900 shadow-2xs transition-colors hover:bg-stone-50 hover:border-stone-400 focus-visible:outline-2 focus-visible:outline-zinc-950"
          >
            <span>View Details</span>
            <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            disabled={isClosed}
            onClick={() => onRegister(event)}
            className={`rounded-xl px-4 py-2 text-xs font-medium shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-zinc-950 ${
              isClosed
                ? 'cursor-not-allowed bg-stone-100 text-stone-400'
                : 'bg-zinc-950 text-white hover:bg-zinc-800'
            }`}
          >
            {isClosed ? 'Closed' : 'Register'}
          </button>
        </div>
      </div>
    </article>
  );
};
