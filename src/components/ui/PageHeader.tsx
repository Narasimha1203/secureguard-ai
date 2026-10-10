import type { ReactNode } from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

export function PageHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: ReactNode;
}) {
  return (
    <header className="sg-page-header mb-8">
      <div className="sg-page-header-top">
        <div className="sg-page-header-eyebrow">
          <span className="sg-page-header-icon">
            <ShieldCheck size={15} />
          </span>
          <span>SECUREGUARD AI</span>
          <span className="sg-page-header-eyebrow-divider" />
          <span className="sg-page-header-eyebrow-label">
            SECURITY CENTER
          </span>
        </div>

        {badge && (
          <div className="sg-page-header-badge">
            {badge}
          </div>
        )}
      </div>

      <div className="sg-page-header-title-row">
        <h1 className="sg-page-header-title text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>

        <span className="sg-page-header-title-mark" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>

      <p className="sg-page-header-description mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
        {description}
      </p>

      <div className="sg-page-header-bottom" aria-hidden="true">
        <span className="sg-page-header-line" />
        <span className="sg-page-header-line-accent" />
        <span className="sg-page-header-line-dot" />
      </div>
    </header>
  );
}