'use client';

import React from 'react';
import { VolunteerEventReadiness, OperationalStatus } from '../../types/volunteer';

interface VolunteerEventReadinessProps {
  readinessItems: VolunteerEventReadiness[];
  onViewEventDetails?: (eventId: string) => void;
}

export const VolunteerEventReadinessList: React.FC<VolunteerEventReadinessProps> = ({
  readinessItems,
  onViewEventDetails,
}) => {
  const getStatusBadge = (status: OperationalStatus) => {
    switch (status) {
      case 'Ready':
        return 'bg-emerald-50 text-emerald-800 ring-emerald-200/70';
      case 'On track':
        return 'bg-blue-50 text-blue-800 ring-blue-200/70';
      case 'Needs attention':
        return 'bg-amber-50 text-amber-800 ring-amber-200/70';
      case 'Delayed':
        return 'bg-rose-50 text-rose-800 ring-rose-200/70';
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/70 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            • OPERATIONAL READINESS
          </span>
          <h2 className="font-serif text-2xl font-normal text-zinc-950 tracking-tight mt-1">
            Assigned Events Readiness
          </h2>
        </div>
        <p className="text-xs text-zinc-500 font-normal">
          Real-time event execution benchmarks & volunteer staffing levels
        </p>
      </div>

      {/* Readiness Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {readinessItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs hover:border-stone-300 transition-all"
          >
            <div>
              {/* Top metadata */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-medium text-zinc-500 truncate">
                  {item.club}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${getStatusBadge(
                    item.operationalStatus
                  )}`}
                >
                  {item.operationalStatus}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-base font-medium text-zinc-950 leading-snug">
                {item.eventName}
              </h3>

              <div className="mt-1 text-xs text-zinc-500">
                {item.date} • {item.venue}
              </div>

              {/* Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-700">Setup Readiness</span>
                  <span className="font-semibold text-zinc-950">{item.progressPercent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-zinc-950 transition-all duration-500"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Staffing Ratio */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-stone-50 p-2.5 text-xs text-zinc-600 border border-stone-100">
                <span className="text-zinc-500">Volunteer Staffing:</span>
                <span className="font-semibold text-zinc-900">
                  {item.volunteersCheckedIn} / {item.volunteersTotal} assigned
                </span>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500 truncate max-w-[170px]">
                Lead: {item.keyContact}
              </span>
              {onViewEventDetails && (
                <button
                  type="button"
                  onClick={() => onViewEventDetails(item.eventId)}
                  className="font-semibold text-zinc-900 hover:text-zinc-700 transition-colors cursor-pointer"
                >
                  Details →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
