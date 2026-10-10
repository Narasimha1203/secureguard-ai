import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { BadgeTone } from '../ui/Badge';
import type { Finding, Severity } from '../../types';

const SEVERITY: Record<Severity, { tone: BadgeTone; label: string }> = {
  high: { tone: 'red', label: 'High impact' },
  medium: { tone: 'amber', label: 'Medium impact' },
  low: { tone: 'slate', label: 'Low impact' },
};

export function FindingsList({ findings }: { findings: Finding[] }) {
  if (findings.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4" role="status">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
        <p className="text-sm text-slate-300">
          No weak patterns were detected by the built-in checks. This does not prove the password is safe: run the
          known-compromised check too.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {findings.map((f) => {
        const sev = SEVERITY[f.severity];
        return (
          <li key={f.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            {f.severity === 'high' ? (
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-white">{f.title}</p>
                <Badge tone={sev.tone}>{sev.label}</Badge>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{f.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
