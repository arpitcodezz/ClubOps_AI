import React from 'react';
import { OperationalRisk, RiskSeverity } from '../../types/coordinator';

interface OperationalRisksProps {
  risks: OperationalRisk[];
}

const severityConfig: Record<
  RiskSeverity,
  { bg: string; text: string; dot: string; label: string }
> = {
  risk: {
    bg: 'bg-rose-50 ring-rose-600/20',
    text: 'text-rose-800',
    dot: 'bg-rose-600',
    label: 'Action Required',
  },
  attention: {
    bg: 'bg-amber-50 ring-amber-600/20',
    text: 'text-amber-800',
    dot: 'bg-amber-600',
    label: 'Attention',
  },
  healthy: {
    bg: 'bg-emerald-50 ring-emerald-600/20',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
    label: 'Resolved',
  },
};

export const OperationalRisks: React.FC<OperationalRisksProps> = ({ risks }) => {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="border-b border-stone-200/80 pb-3">
        <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
          • BOTTLENECK MONITOR
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-zinc-950 mt-1">
          Risks &amp; Operational Attention
        </h2>
      </div>

      {/* Risks List */}
      <div className="space-y-3">
        {risks.map((risk) => {
          const config = severityConfig[risk.severity];

          return (
            <div
              key={risk.id}
              className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-2xs space-y-2 hover:border-stone-300 transition-colors"
            >
              {/* Header: Title & Severity Pill */}
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium text-zinc-950 leading-snug">
                  {risk.title}
                </h4>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset shrink-0 ${config.bg} ${config.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                  {config.label}
                </span>
              </div>

              {/* Context Description */}
              <p className="text-xs leading-relaxed text-stone-600 font-sans">
                {risk.context}
              </p>

              {/* Metric Tag */}
              {risk.metric && (
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 uppercase tracking-wider">Metric Threshold</span>
                  <span className="font-semibold text-zinc-900 bg-stone-100 px-2 py-0.5 rounded-md">
                    {risk.metric}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
