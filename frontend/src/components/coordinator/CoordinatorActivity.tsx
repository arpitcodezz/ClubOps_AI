import React from 'react';
import { CoordinatorActivity as CoordinatorActivityType } from '../../types/coordinator';

interface CoordinatorActivityProps {
  activities: CoordinatorActivityType[];
}

const typeIcons: Record<CoordinatorActivityType['type'], string> = {
  venue: '📍',
  volunteer: '👥',
  task: '✓',
  event: '📅',
};

export const CoordinatorActivityList: React.FC<CoordinatorActivityProps> = ({ activities }) => {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="border-b border-stone-200/80 pb-3">
        <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
          • LOGS &amp; AUDIT
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-zinc-950 mt-1">
          Recent Activity
        </h2>
      </div>

      {/* Activity Timeline Card */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-2xs divide-y divide-stone-100">
        {activities.map((act) => (
          <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs text-zinc-700">
              {typeIcons[act.type]}
            </span>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-medium text-zinc-950">
                  {act.title}
                </h4>
                <span className="text-[11px] text-stone-400 shrink-0 tabular-nums">
                  {act.timestamp}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-sans leading-relaxed">
                {act.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
