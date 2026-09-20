'use client';

import React from 'react';
import { VolunteerShift } from '../../types/volunteer';

interface VolunteerShiftsProps {
  shifts: VolunteerShift[];
  onCheckInShift: (shiftId: string) => void;
}

export const VolunteerShifts: React.FC<VolunteerShiftsProps> = ({
  shifts,
  onCheckInShift,
}) => {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/70 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            • ATTENDANCE & SCHEDULE
          </span>
          <h2 className="font-serif text-2xl font-normal text-zinc-950 tracking-tight mt-1">
            Upcoming Shifts & Check-ins
          </h2>
        </div>
        <p className="text-xs text-zinc-500 font-normal">
          Check in on-site when you arrive at your designated station
        </p>
      </div>

      {/* Shifts Table / Card Stack */}
      <div className="divide-y divide-stone-200/80 rounded-2xl border border-stone-200/80 bg-white overflow-hidden shadow-2xs">
        {shifts.map((shift) => {
          const isCheckedIn = shift.status === 'Checked In';

          return (
            <div
              key={shift.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-stone-50/70 transition-colors"
            >
              {/* Left Column: Shift Info */}
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                    {shift.eventName}
                  </span>
                  <span className="text-xs text-zinc-300">•</span>
                  <span className="text-xs text-zinc-600 font-medium">
                    {shift.role}
                  </span>
                </div>

                <div className="text-sm font-semibold text-zinc-950">
                  {shift.shiftHours}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span>📅 {shift.date}</span>
                  <span>•</span>
                  <span>📍 {shift.location}</span>
                  <span>•</span>
                  <span>Supervisor: {shift.supervisor}</span>
                </div>
              </div>

              {/* Right Column: Reporting time & Check-in Action */}
              <div className="flex items-center gap-4 sm:border-l sm:border-stone-200 sm:pl-6 shrink-0 justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Report By
                  </div>
                  <div className="text-xs font-semibold text-emerald-800">
                    {shift.reportingTime}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onCheckInShift(shift.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                    isCheckedIn
                      ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300/80 hover:bg-emerald-100'
                      : 'bg-zinc-950 text-white hover:bg-zinc-800'
                  }`}
                >
                  {isCheckedIn ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>Checked In {shift.checkInTime ? `(${shift.checkInTime})` : ''}</span>
                    </>
                  ) : (
                    <>
                      <span>Check In</span>
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
