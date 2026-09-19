import React from 'react';
import { ActivityItem } from '../../types/dashboard';

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          • RECENT ACTIVITY
        </h3>
        <span className="text-xs text-zinc-400">Live operational log</span>
      </div>

      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="space-y-5">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative flex items-start gap-3">
              {/* Timeline line connector */}
              {index !== activities.length - 1 && (
                <div
                  className="absolute left-1.5 top-4 h-full w-px bg-stone-200"
                  aria-hidden="true"
                />
              )}

              {/* Timeline dot */}
              <div className="relative mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-stone-100 ring-2 ring-stone-300">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-zinc-950">
                    {activity.title}
                  </p>
                  <span className="font-mono text-[11px] text-zinc-400">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  {activity.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
