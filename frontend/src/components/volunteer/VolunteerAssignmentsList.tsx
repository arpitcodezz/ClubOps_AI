'use client';

import React from 'react';
import { VolunteerAssignment } from '../../types/volunteer';

interface VolunteerAssignmentsListProps {
  assignments: VolunteerAssignment[];
  onSelectAssignment?: (assignment: VolunteerAssignment) => void;
  onViewEvent?: (eventId: string) => void;
}

export const VolunteerAssignmentsList: React.FC<VolunteerAssignmentsListProps> = ({
  assignments,
  onSelectAssignment,
  onViewEvent,
}) => {
  const getStatusBadge = (status: VolunteerAssignment['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 ring-emerald-200/60';
      case 'Reporting Soon':
        return 'bg-amber-50 text-amber-800 ring-amber-200/60';
      case 'Standby':
        return 'bg-stone-100 text-stone-700 ring-stone-200';
      case 'Completed':
        return 'bg-zinc-100 text-zinc-600 ring-zinc-200';
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/70 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            • RESPONSIBILITIES
          </span>
          <h2 className="font-serif text-2xl font-normal text-zinc-950 tracking-tight mt-1">
            My Event Assignments
          </h2>
        </div>
        <p className="text-xs text-zinc-500 font-normal">
          {assignments.length} confirmed campus roles
        </p>
      </div>

      {/* Assignments Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs hover:border-stone-300 hover:shadow-xs transition-all"
          >
            <div>
              {/* Status & Team header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-medium text-zinc-500 truncate">
                  {assignment.team}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${getStatusBadge(
                    assignment.status
                  )}`}
                >
                  {assignment.status}
                </span>
              </div>

              {/* Event Name */}
              <h3 className="font-serif text-lg font-medium text-zinc-950 leading-snug">
                {assignment.eventName}
              </h3>

              {/* Role Title */}
              <div className="mt-2 text-xs font-semibold text-zinc-800">
                <span className="text-zinc-500 font-normal">Role: </span>
                {assignment.role}
              </div>

              {/* Reporting Details */}
              <div className="mt-4 space-y-1.5 rounded-xl bg-stone-50/80 p-3 text-xs text-zinc-600 border border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Reporting:</span>
                  <span className="font-semibold text-emerald-800">{assignment.reportingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Date:</span>
                  <span className="text-zinc-800">{assignment.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Venue:</span>
                  <span className="text-zinc-800 truncate max-w-[150px]" title={assignment.venue}>
                    {assignment.venue}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-200/50">
                  <span className="text-zinc-400">Lead:</span>
                  <span className="text-zinc-700 truncate max-w-[160px] font-medium">
                    {assignment.leadCoordinator}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t border-stone-100">
              {onSelectAssignment && (
                <button
                  type="button"
                  onClick={() => onSelectAssignment(assignment)}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  View Briefing
                </button>
              )}

              {onViewEvent && (
                <button
                  type="button"
                  onClick={() => onViewEvent(assignment.eventId)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-zinc-700 transition-colors cursor-pointer"
                >
                  <span>Event Details</span>
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
