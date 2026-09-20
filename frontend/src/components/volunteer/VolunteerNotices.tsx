'use client';

import React from 'react';
import { VolunteerNotice, NoticePriority } from '../../types/volunteer';

interface VolunteerNoticesProps {
  notices: VolunteerNotice[];
}

export const VolunteerNotices: React.FC<VolunteerNoticesProps> = ({ notices }) => {
  const getPriorityBadge = (priority: NoticePriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-800 ring-rose-200/70';
      case 'notice':
        return 'bg-amber-50 text-amber-800 ring-amber-200/70';
      case 'info':
        return 'bg-stone-100 text-stone-700 ring-stone-200';
    }
  };

  const getTypeIcon = (type: VolunteerNotice['type']) => {
    switch (type) {
      case 'time_change':
        return '⏰';
      case 'venue_update':
        return '📍';
      case 'task_alert':
        return '⚠️';
      case 'coordinator_message':
        return '💬';
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/70 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            • OPERATIONAL DISPATCH
          </span>
          <h2 className="font-serif text-2xl font-normal text-zinc-950 tracking-tight mt-1">
            Important Notices & Coordinator Briefings
          </h2>
        </div>
        <p className="text-xs text-zinc-500 font-normal">
          Immediate updates from event leads and operations coordinators
        </p>
      </div>

      {/* Notices Stack */}
      <div className="space-y-3.5">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-2xl border p-5 transition-all ${
              notice.priority === 'urgent'
                ? 'border-rose-200/80 bg-rose-50/20'
                : 'border-stone-200/80 bg-white'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-base" aria-hidden="true">
                  {getTypeIcon(notice.type)}
                </span>
                <span className="text-xs font-semibold text-zinc-950">
                  {notice.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${getPriorityBadge(
                    notice.priority
                  )}`}
                >
                  {notice.priority}
                </span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs text-zinc-500">{notice.timestamp}</span>
              </div>
            </div>

            <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed pl-7">
              {notice.message}
            </p>

            <div className="mt-3.5 pl-7 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
              <span className="font-medium text-zinc-800">From: {notice.sender}</span>
              {notice.eventName && (
                <>
                  <span>•</span>
                  <span>Event: {notice.eventName}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
