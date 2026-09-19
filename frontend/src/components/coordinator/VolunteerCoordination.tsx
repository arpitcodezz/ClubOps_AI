import React from 'react';
import { VolunteerCoordinationItem, VolunteerRecruitmentStatus } from '../../types/coordinator';

interface VolunteerCoordinationProps {
  volunteers: VolunteerCoordinationItem[];
}

const statusStyles: Record<
  VolunteerRecruitmentStatus,
  { bg: string; text: string; dot: string }
> = {
  Full: {
    bg: 'bg-emerald-50 ring-emerald-600/20',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
  Recruiting: {
    bg: 'bg-amber-50 ring-amber-600/20',
    text: 'text-amber-800',
    dot: 'bg-amber-600',
  },
  Critical: {
    bg: 'bg-rose-50 ring-rose-600/20',
    text: 'text-rose-800',
    dot: 'bg-rose-600',
  },
};

export const VolunteerCoordination: React.FC<VolunteerCoordinationProps> = ({ volunteers }) => {
  const totalNeeded = volunteers.reduce((acc, v) => acc + v.needed, 0);
  const totalAssigned = volunteers.reduce((acc, v) => acc + v.assigned, 0);
  const totalRemaining = totalNeeded - totalAssigned;

  return (
    <section id="volunteers-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
            • CREW &amp; STAFFING
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-zinc-950 mt-1">
            Volunteer Coordination
          </h2>
        </div>
        <div className="text-xs text-stone-600 font-sans">
          <span className="font-semibold text-zinc-950">{totalAssigned}</span> / {totalNeeded} assigned{' '}
          <span className="text-stone-400">({totalRemaining} remaining slots)</span>
        </div>
      </div>

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {volunteers.map((item) => {
          const status = statusStyles[item.status];
          const progressPercent = Math.min(Math.round((item.assigned / item.needed) * 100), 100);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-2xs space-y-3.5"
            >
              {/* Top Row: Event Name & Status */}
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-medium text-zinc-950 truncate" title={item.eventName}>
                  {item.eventName}
                </h4>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset shrink-0 ${status.bg} ${status.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {item.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                  <span>Coverage</span>
                  <span className="font-semibold text-zinc-950 tabular-nums">
                    {item.assigned} of {item.needed} filled
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.status === 'Critical'
                        ? 'bg-rose-600'
                        : item.status === 'Recruiting'
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Bottom Meta: Remaining Slots & Lead Contact */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span>
                  {item.remaining === 0 ? (
                    <strong className="text-emerald-700 font-semibold">Fully staffed</strong>
                  ) : (
                    <>
                      <strong className="text-zinc-900 font-semibold">{item.remaining}</strong> slots open
                    </>
                  )}
                </span>
                <span className="truncate max-w-[170px] text-stone-600" title={item.leadContact}>
                  👤 {item.leadContact}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
