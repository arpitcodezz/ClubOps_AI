import React from 'react';
import { AiInsightItem } from '../../types/dashboard';

interface AiOperationsProps {
  insights: AiInsightItem[];
}

export const AiOperations: React.FC<AiOperationsProps> = ({ insights }) => {
  return (
    <section className="my-8 rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
            <span className="text-zinc-400">•</span>
            <span>AI OPERATIONS</span>
          </div>
          <h3 className="text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl lg:text-3xl">
            ClubOps noticed 3 things that may need your attention.
          </h3>
        </div>

        <button
          type="button"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 transition-colors hover:text-zinc-600 self-start sm:self-auto"
        >
          <span>Review suggestions</span>
          <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* 3 Editorial Operational Insight Blocks */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 border-t border-stone-100 pt-8">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="flex flex-col justify-between space-y-3 rounded-xl bg-[#fafaf8] p-5 border border-stone-200/60"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-zinc-400">
                  {insight.indexStr}
                </span>
                {insight.tag && (
                  <span className="rounded bg-stone-200/60 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-wide">
                    {insight.tag}
                  </span>
                )}
              </div>

              <h4 className="mt-3 text-base font-medium text-zinc-950">
                {insight.title}
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-600">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
