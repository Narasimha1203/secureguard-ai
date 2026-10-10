import { AlertTriangle, CheckCircle2, Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Kind = 'loading' | 'empty' | 'error' | 'success';

const styles: Record<Kind, { ring: string; icon: ReactNode }> = {
  loading: {
    ring: 'border-neon-cyan/30 text-neon-cyan',
    icon: <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />,
  },
  empty: {
    ring: 'border-slate-500/40 text-slate-300',
    icon: <Inbox className="h-6 w-6" aria-hidden="true" />,
  },
  error: {
    ring: 'border-red-400/40 text-red-300',
    icon: <AlertTriangle className="h-6 w-6" aria-hidden="true" />,
  },
  success: {
    ring: 'border-emerald-400/40 text-emerald-300',
    icon: <CheckCircle2 className="h-6 w-6" aria-hidden="true" />,
  },
};

interface StateBlockProps {
  kind: Kind;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** One component for loading, empty, error and success states. */
export function StateBlock({ kind, title, description, action, className }: StateBlockProps) {
  const s = styles[kind];
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      aria-live={kind === 'error' ? 'assertive' : 'polite'}
      className={cn('flex flex-col items-center gap-3 px-4 py-8 text-center', className)}
    >
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-full border bg-white/5', s.ring)}>
        {s.icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="max-w-md text-sm leading-relaxed text-slate-400">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
