import React from 'react';
import { EventOperation, OperationalStatus } from '../../types/coordinator';

interface EventOperationsListProps {
  operations: EventOperation[];
  onSelectEvent: (event: EventOperation) => void;
}

const statusBadgeStyles: Record<
  OperationalStatus,
  { bg: string; text: string; dot: string }
> = {
  Ready: {
    bg: 'bg-emerald-50 ring-emerald-600/20',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
  'On track': {
    bg: 'bg-emerald-50 ring-emerald-600/20',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
  'Needs attention': {
    bg: 'bg-amber-50 ring-amber-600/20',
    text: 'text-amber-800',
    dot: 'bg-amber-600',
  },
  Delayed: {
    bg: 'bg-rose-50 ring-rose-600/20',
    text: 'text-rose-800',
    dot: 'bg-rose-600',
  },
};

export const EventOperationsList: React.FC<EventOperationsListProps> = ({
  operations,
  onSelectEvent,
}) => {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
            • EXECUTION STATUS
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-zinc-950 mt-1">
            Event Operations
          </h2>
        </div>
        <p className="text-xs text-stone-500 font-sans">
          {operations.length} events scheduled for staging and execution
        </p>
      </div>

      {/* Operations List */}
      <div className="divide-y divide-stone-200/70 rounded-2xl border border-stone-200/90 bg-white shadow-2xs overflow-hidden">
        {operations.map((op) => {
          const statusStyle = statusBadgeStyles[op.operationalStatus];

          return (
            <div
              key={op.id}
              onClick={() => onSelectEvent(op)}
              className="group flex flex-col gap-4 p-5 sm:p-6 transition-colors hover:bg-stone-50/60 cursor-pointer"
            >
              {/* Top Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                    {op.category}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs font-medium text-stone-700">{op.date} at {op.time}</span>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                  {op.operationalStatus}
                </span>
              </div>

              {/* Title & Venue */}
              <div>
                <h3 className="text-base sm:text-lg font-serif font-normal text-zinc-950 group-hover:text-stone-700 transition-colors">
                  {op.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  📍 {op.venue}
                </p>
              </div>

              {/* Operational Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100 text-xs text-stone-600">
                {/* Readiness Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-stone-500">Readiness</span>
                    <span className="font-semibold text-zinc-950 tabular-nums">{op.preparationProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-zinc-900 transition-all duration-300"
                      style={{ width: `${op.preparationProgress}%` }}
                    />
                  </div>
                </div>

                {/* Tasks Summary */}
                <div>
                  <span className="text-stone-500 block">Task Status</span>
                  <span className="font-medium text-zinc-900 mt-0.5 block">
                    <span className="font-semibold text-zinc-950">{op.taskStatus.completed}</span> / {op.taskStatus.total} completed{' '}
                    {op.taskStatus.open > 0 && (
                      <span className="text-amber-700">({op.taskStatus.open} open)</span>
                    )}
                  </span>
                </div>

                {/* Volunteer Coverage */}
                <div>
                  <span className="text-stone-500 block">Volunteer Staffing</span>
                  <span className="font-medium text-zinc-900 mt-0.5 block">
                    <span className="font-semibold text-zinc-950">{op.volunteerStatus.assigned}</span> / {op.volunteerStatus.needed} assigned{' '}
                    {op.volunteerStatus.needed - op.volunteerStatus.assigned > 0 ? (
                      <span className="text-rose-700">({op.volunteerStatus.needed - op.volunteerStatus.assigned} needed)</span>
                    ) : (
                      <span className="text-emerald-700">(Staffed)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
