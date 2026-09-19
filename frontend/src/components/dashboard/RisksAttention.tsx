import React from 'react';
import { RiskItem, RiskSeverity } from '../../types/dashboard';

interface RisksAttentionProps {
  risks: RiskItem[];
}

const severityConfig: Record<RiskSeverity, { bg: string; text: string; dot: string; label: string }> = {
  healthy: {
    bg: 'bg-emerald-50 ring-emerald-600/20',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
    label: 'Normal',
  },
  attention: {
    bg: 'bg-amber-50 ring-amber-600/20',
    text: 'text-amber-800',
    dot: 'bg-amber-600',
    label: 'Attention',
  },
  risk: {
    bg: 'bg-rose-50 ring-rose-600/20',
    text: 'text-rose-800',
    dot: 'bg-rose-600',
    label: 'Risk',
  },
};

export const RisksAttention: React.FC<RisksAttentionProps> = ({ risks }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          • RISKS & ATTENTION
        </h3>
        <span className="text-xs text-zinc-400">
          {risks.length} flagged items
        </span>
      </div>

      <div className="space-y-3">
        {risks.map((risk) => {
          const config = severityConfig[risk.severity];

          return (
            <div
              key={risk.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-stone-200/90 bg-white p-4 shadow-xs transition-colors hover:border-stone-300"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${config.dot}`} aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-zinc-950">
                    {risk.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-600 pl-4">
                  {risk.venueOrContext}
                </p>
              </div>

              {risk.metric ? (
                <div className="text-right">
                  <span className="font-mono text-base font-semibold text-zinc-950">
                    {risk.metric}
                  </span>
                  <span className={`block text-[10px] font-medium uppercase tracking-wider ${config.text}`}>
                    {config.label}
                  </span>
                </div>
              ) : (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${config.bg} ${config.text}`}
                >
                  {config.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
