import { CheckCircle2 } from 'lucide-react';

export function RecommendationsList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" aria-hidden="true" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
