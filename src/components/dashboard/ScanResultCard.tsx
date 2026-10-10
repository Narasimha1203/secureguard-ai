import type { ReactNode } from 'react';
import { Badge } from '../ui/Badge';
import type { BadgeTone } from '../ui/Badge';
import { GlassPanel } from '../ui/GlassPanel';

interface ScanResultCardProps {
  icon: ReactNode;
  title: string;
  /** Where this result comes from, so nothing looks fabricated. */
  source: string;
  value: string;
  valueTone?: BadgeTone;
  detail: string;
}

export function ScanResultCard({ icon, title, source, value, valueTone = 'slate', detail }: ScanResultCardProps) {
  return (
    <GlassPanel className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="text-neon-cyan">{icon}</span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div>
        <Badge tone={valueTone} className="text-sm">
          {value}
        </Badge>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{detail}</p>
      <p className="mt-auto text-xs text-slate-500">Source: {source}</p>
    </GlassPanel>
  );
}
