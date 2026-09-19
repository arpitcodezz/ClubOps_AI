'use client';

import React from 'react';
import Image from 'next/image';
import { Event } from '../types/event';

interface FeaturedEventProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onRegister: (event: Event) => void;
}

export const FeaturedEvent: React.FC<FeaturedEventProps> = ({
  event,
  onViewDetails,
  onRegister,
}) => {
  const isClosed = event.registrationStatus === 'Closed';

  return (
    <section>
      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fdfcfb] p-6 sm:p-8 lg:p-9 shadow-2xs">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] lg:gap-10 lg:items-center">
          {/* IMAGE: On mobile: order-1 (top); on desktop: lg:order-2 (RIGHT) */}
          <div className="w-full order-1 lg:order-2 flex items-center justify-center">
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-stone-100 shadow-2xs">
              <Image
                src={event.bannerUrl}
                alt={event.title}
                fill
                unoptimized
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-60" />

              {event.bannerConfig && (
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="inline-block rounded-md bg-zinc-950/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-xs">
                    {event.bannerConfig.theme}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CONTENT: On mobile: order-2 (below image); on desktop: lg:order-1 (LEFT) */}
          <div className="flex flex-col justify-between order-2 lg:order-1">
            <div>
              {/* FEATURED EVENT & Category / Status */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
                    • FEATURED EVENT
                  </span>
                  <span className="text-stone-300 font-light">/</span>
                  <span className="text-[11px] font-semibold tracking-widest text-stone-700 uppercase">
                    {event.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`h-1.5 w-1.5 rounded-full ${isClosed ? 'bg-stone-400' : 'bg-emerald-500'}`} />
                  <span className={`text-[11px] font-medium ${isClosed ? 'text-stone-500' : 'text-emerald-800'}`}>
                    {event.registrationStatus}
                  </span>
                </div>
              </div>

              {/* Club Name */}
              <p className="mt-3 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                {event.clubName}
              </p>

              {/* Event Title */}
              <h2 className="mt-1 text-2xl sm:text-3xl lg:text-[34px] font-serif font-normal tracking-tight text-zinc-950 leading-[1.12]">
                {event.title}
              </h2>

              {/* AI Headline if present */}
              {event.headline && (
                <p className="mt-2 text-xs sm:text-sm italic font-serif text-stone-600">
                  &ldquo;{event.headline}&rdquo;
                </p>
              )}

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-stone-600 max-w-xl">
                {event.shortDescription || event.description}
              </p>
            </div>

            {/* Date / Time / Venue & Action Buttons */}
            <div className="mt-6 border-t border-stone-200/70 pt-4">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-stone-600">
                <div>
                  <span className="font-semibold text-zinc-900">Date:</span>{' '}
                  <span className="text-stone-800">{event.date}</span>
                </div>
                <span className="text-stone-300 hidden sm:inline">/</span>
                <div>
                  <span className="font-semibold text-zinc-900">Time:</span>{' '}
                  <span className="text-stone-800">{event.time}</span>
                </div>
                <span className="text-stone-300 hidden sm:inline">/</span>
                <div>
                  <span className="font-semibold text-zinc-900">Venue:</span>{' '}
                  <span className="text-stone-800">{event.venue}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
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
          </div>
        </div>
      </div>
    </section>
  );
};
