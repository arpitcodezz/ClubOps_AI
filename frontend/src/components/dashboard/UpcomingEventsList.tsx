import React from 'react';
import { EventStatus, UpcomingEventItem } from '../../types/dashboard';

interface UpcomingEventsListProps {
  events: UpcomingEventItem[];
  onSelectEvent?: (event: UpcomingEventItem) => void;
}

const statusPillStyles: Record<EventStatus, { bg: string; text: string; dot: string }> = {
  'On track': {
    bg: 'bg-emerald-50 ring-emerald-600/20',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
  Attention: {
    bg: 'bg-amber-50 ring-amber-600/20',
    text: 'text-amber-800',
    dot: 'bg-amber-600',
  },
  Planning: {
    bg: 'bg-stone-100 ring-stone-300',
    text: 'text-zinc-700',
    dot: 'bg-stone-400',
  },
};

export const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({
  events,
  onSelectEvent,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          • UPCOMING EVENTS
        </h3>
        <span className="text-xs text-zinc-400">
          {events.length} scheduled
        </span>
      </div>

      <div className="rounded-2xl border border-stone-200/90 bg-white p-2 sm:p-4 shadow-xs">
        <div className="divide-y divide-stone-100">
          {events.map((event) => {
            const statusConfig = statusPillStyles[event.status] ?? statusPillStyles['Planning'];

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent?.(event)}
                className={`group flex flex-col justify-between gap-3 rounded-xl p-3.5 transition-colors hover:bg-stone-50/75 sm:flex-row sm:items-center sm:gap-6 ${
                  onSelectEvent ? 'cursor-pointer' : ''
                }`}
              >
                {/* Event Name & Category */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium text-zinc-950 group-hover:text-zinc-800">
                      {event.name}
                    </h4>
                    {onSelectEvent && (
                      <span className="opacity-0 transition-opacity group-hover:opacity-100 text-xs text-zinc-400">
                        →
                      </span>
                    )}
                  </div>
                  {event.category && (
                    <span className="text-xs text-zinc-400">
                      {event.category}
                    </span>
                  )}
                </div>

                {/* Date */}
                <div className="text-xs sm:text-sm font-mono text-zinc-600">
                  {event.date}
                </div>

                {/* Volunteers count */}
                <div className="text-xs sm:text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-900">{event.volunteers}</span> volunteers
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} aria-hidden="true" />
                    {event.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
