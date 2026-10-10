import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'cyan' | 'violet' | 'amber' | 'red' | 'green' | 'slate';

const tones: Record<BadgeTone, string> = {
  cyan: 'border-neon-cyan/40 bg-neon-cyan/10 text-cyan-200',
  violet: 'border-neon-violet/50 bg-neon-violet/15 text-violet-200',
  amber: 'border-amber-400/50 bg-amber-400/10 text-amber-200',
  red: 'border-red-400/50 bg-red-500/10 text-red-200',
  green: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200',
  slate: 'border-slate-500/50 bg-slate-500/10 text-slate-300',
};

export function Badge({ tone = 'slate', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Use this on every feature that needs a backend that is not integrated yet. */
export function NotConnectedBadge() {
  return <Badge tone="amber">NOT CONNECTED</Badge>;
}

export function LocalBadge() {
  return <Badge tone="cyan">Runs in your browser</Badge>;
}
