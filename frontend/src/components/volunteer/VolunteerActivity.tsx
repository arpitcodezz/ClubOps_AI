'use client';

import React from 'react';
import { VolunteerActivity } from '../../types/volunteer';

interface VolunteerActivityProps {
  activities: VolunteerActivity[];
}

export const VolunteerActivityList: React.FC<VolunteerActivityProps> = ({ activities }) => {
  const getIcon = (type: VolunteerActivity['type']) => {
    switch (type) {
      case 'check_in':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'task':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'assignment':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'notice':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-700 ring-1 ring-stone-300">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/70 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            • TIMELINE
          </span>
          <h2 className="font-serif text-2xl font-normal text-zinc-950 tracking-tight mt-1">
            Recent Volunteer Log
          </h2>
        </div>
        <p className="text-xs text-zinc-500 font-normal">
          Recorded audit trail of check-ins, tasks, and role briefings
        </p>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs divide-y divide-stone-100">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            {getIcon(activity.type)}

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-semibold text-zinc-900">
                  {activity.title}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {activity.timestamp}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                {activity.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
