import React from 'react';
import { OperationStat } from '../../types/dashboard';

interface OperationsStatsProps {
  stats: OperationStat[];
}

export const OperationsStats: React.FC<OperationsStatsProps> = ({ stats }) => {
  return (
    <section className="my-10 border-y border-stone-200/80 py-8 sm:py-12">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col justify-between ${
              i !== 0 ? 'lg:border-l lg:border-stone-200/80 lg:pl-8' : ''
            }`}
          >
            <div>
              {/* Oversized Editorial Number */}
              <span className="block font-sans text-5xl font-light tracking-tighter text-zinc-950 sm:text-6xl lg:text-7xl">
                {stat.value}
              </span>
              {/* Small Uppercase Section Label */}
              <span className="mt-2 block text-xs font-semibold tracking-wider text-zinc-600 uppercase">
                {stat.label}
              </span>
            </div>

            {stat.context && (
              <p className="mt-3 text-xs text-zinc-400">
                {stat.context}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
