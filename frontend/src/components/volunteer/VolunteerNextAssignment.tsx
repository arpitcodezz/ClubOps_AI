'use client';

import React from 'react';
import { VolunteerAssignment } from '../../types/volunteer';

interface VolunteerNextAssignmentProps {
  assignment: VolunteerAssignment;
  onCheckIn?: () => void;
  isCheckedIn?: boolean;
  onViewEventDetails?: (eventId: string) => void;
}

export const VolunteerNextAssignment: React.FC<VolunteerNextAssignmentProps> = ({
  assignment,
  onCheckIn,
  isCheckedIn = false,
  onViewEventDetails,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-7 sm:p-9 shadow-xs">
      {/* Editorial Accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-950 via-zinc-800 to-stone-400" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="space-y-4 max-w-3xl">
          {/* Tag & Status Row */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Next Scheduled Assignment
            </span>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs font-medium text-zinc-600">
              {assignment.team}
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-inset ring-amber-200/60">
              {assignment.status}
            </span>
          </div>

          {/* Event Title */}
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-zinc-950 leading-snug">
              {assignment.eventName}
            </h2>
            <p className="mt-1.5 text-base font-semibold text-zinc-800">
              Role: <span className="font-normal text-zinc-900">{assignment.role}</span>
            </p>
          </div>

          {/* Logistics Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs text-zinc-600">
            <div className="rounded-xl border border-stone-200/70 bg-stone-50/60 p-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Date & Event Hours
              </span>
              <span className="mt-1 block font-medium text-zinc-900">
                {assignment.date}
              </span>
              <span className="block text-zinc-500 mt-0.5">
                {assignment.time}
              </span>
            </div>

            <div className="rounded-xl border border-stone-200/70 bg-stone-50/60 p-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Reporting Time & Venue
              </span>
              <span className="mt-1 block font-semibold text-emerald-800">
                {assignment.reportingTime}
              </span>
              <span className="block text-zinc-500 mt-0.5">
                {assignment.venue}
              </span>
            </div>

            <div className="rounded-xl border border-stone-200/70 bg-stone-50/60 p-3 sm:col-span-2 lg:col-span-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Coordinator Contact
              </span>
              <span className="mt-1 block font-medium text-zinc-900">
                {assignment.leadCoordinator}
              </span>
              <span className="block text-zinc-500 mt-0.5">
                Central Operations Command
              </span>
            </div>
          </div>

          {/* Role Instructions Note */}
          <div className="rounded-xl bg-stone-100/60 border border-stone-200/70 p-3 text-xs text-zinc-700">
            <span className="font-semibold text-zinc-900">Instructions: </span>
            {assignment.instructions}
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px] lg:border-l lg:border-stone-200 lg:pl-8 justify-center">
          <button
            type="button"
            onClick={onCheckIn}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              isCheckedIn
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-zinc-950 text-white hover:bg-zinc-800'
            }`}
          >
            <span>{isCheckedIn ? '✓ Check-in Confirmed' : 'Check In Now'}</span>
            {!isCheckedIn && <span aria-hidden="true">→</span>}
          </button>

          {onViewEventDetails && (
            <button
              type="button"
              onClick={() => onViewEventDetails(assignment.eventId)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs font-medium text-zinc-800 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>View Event Details</span>
              <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
