import { cn } from '../../lib/cn';
import type { StrengthLabel } from '../../types';

const COLORS: Record<StrengthLabel, { bar: string; text: string; segments: number }> = {
  'Very weak': { bar: 'bg-red-500', text: 'text-red-300', segments: 1 },
  Weak: { bar: 'bg-orange-500', text: 'text-orange-300', segments: 2 },
  Fair: { bar: 'bg-amber-400', text: 'text-amber-300', segments: 3 },
  Strong: { bar: 'bg-emerald-400', text: 'text-emerald-300', segments: 4 },
  'Very strong': { bar: 'bg-neon-cyan', text: 'text-cyan-200', segments: 5 },
};

export function StrengthMeter({ score, label }: { score: number; label: StrengthLabel }) {
  const c = COLORS[label];
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-300">Estimated strength</span>
        <span className={cn('text-sm font-semibold', c.text)}>
          {label} ({score}/100)
        </span>
      </div>
      <div
        role="meter"
        aria-label="Estimated password strength"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${label}, ${score} out of 100`}
        className="grid grid-cols-5 gap-1.5"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={cn('h-2.5 rounded-full transition-colors', n <= c.segments ? c.bar : 'bg-white/10')} />
        ))}
      </div>
    </div>
  );
}
