import { CheckCircle2, Info, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Badge } from '../ui/Badge';
import type { BadgeTone } from '../ui/Badge';
import { GlassPanel } from '../ui/GlassPanel';
import type { RiskLevel, RiskReport, RiskReasonItem } from '../../types';

const LEVEL: Record<RiskLevel, { label: string; tone: BadgeTone; border: string; icon: ReactNode }> = {
  critical: { label: 'Critical risk', tone: 'red', border: 'border-red-400/50', icon: <ShieldAlert className="h-7 w-7 text-red-300" aria-hidden="true" /> },
  high: { label: 'High risk', tone: 'red', border: 'border-orange-400/50', icon: <ShieldAlert className="h-7 w-7 text-orange-300" aria-hidden="true" /> },
  moderate: { label: 'Moderate risk', tone: 'amber', border: 'border-amber-400/50', icon: <ShieldQuestion className="h-7 w-7 text-amber-300" aria-hidden="true" /> },
  low: { label: 'Low risk', tone: 'green', border: 'border-emerald-400/50', icon: <ShieldCheck className="h-7 w-7 text-emerald-300" aria-hidden="true" /> },
  unknown: { label: 'Exposure unknown', tone: 'violet', border: 'border-neon-violet/50', icon: <ShieldQuestion className="h-7 w-7 text-violet-300" aria-hidden="true" /> },
};

function ReasonGroup({ title, description, items }: { title: string; description: string; items: RiskReasonItem[] }) {
  return (
    <GlassPanel>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      <ul className="mt-4 space-y-3">
        {items.map((r, i) => (
          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" aria-hidden="true" />
            <span>{r.text}</span>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

/** Presentation only: receives a finished report and renders it. */
export function RiskReportView({ report }: { report: RiskReport }) {
  const level = LEVEL[report.level];
  const weakness = report.reasons.filter((r) => r.source === 'Local analysis');
  const exposure = report.reasons.filter((r) => r.source === 'Pwned Passwords check');
  const combined = report.reasons.filter((r) => r.source === 'Combined');

  return (
    <div className="space-y-6">
      <GlassPanel className={cn('border-2', level.border)}>
        <div className="flex items-start gap-4">
          {level.icon}
          <div>
            <Badge tone={level.tone}>{level.label}</Badge>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{report.headline}</h2>
            <p className="mt-2 max-w-2xl text-slate-300">{report.summary}</p>
          </div>
        </div>
        {combined.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
            {combined.map((r, i) => (
              <li key={i} className="text-sm text-slate-300">
                <span className="font-medium text-white">How the two results combine: </span>
                {r.text}
              </li>
            ))}
          </ul>
        )}
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReasonGroup
          title="Password weakness"
          description="How easy this password is to guess. Computed locally in your browser."
          items={weakness}
        />
        <ReasonGroup
          title="Known breach exposure"
          description="Whether this password appears in known compromised-password data (Pwned Passwords)."
          items={exposure}
        />
      </div>

      <GlassPanel>
        <h3 className="text-lg font-semibold text-white">What to do next</h3>
        <ul className="mt-3 space-y-2.5">
          {report.nextSteps.map((s) => (
            <li key={s} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" aria-hidden="true" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </GlassPanel>

      <GlassPanel className="border-amber-400/30">
        <h3 className="text-lg font-semibold text-white">What this report cannot tell you</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400">
          {report.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
