'use client';

import React from 'react';
import { VolunteerStat } from '../../types/volunteer';

interface VolunteerStatsProps {
  stats: VolunteerStat[];
}

export const VolunteerStats: React.FC<VolunteerStatsProps> = ({ stats }) => {
  return (
    <section className="border-y border-stone-200/80 bg-white/70 backdrop-blur-xs py-9">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col ${
                index !== 0 ? 'lg:border-l lg:border-stone-200 lg:pl-10' : ''
              }`}
            >
              {/* Large Editorial Serif Number */}
              <span className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-zinc-950 leading-none">
                {stat.value}
              </span>

              {/* Stat Label */}
              <span className="mt-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-900">
                {stat.label}
              </span>

              {/* Context / Supporting Note */}
              {stat.context && (
                <span className="mt-1 text-xs text-zinc-500 font-normal">
                  {stat.context}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
