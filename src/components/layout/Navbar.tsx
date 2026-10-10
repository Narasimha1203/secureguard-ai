
import { Menu, ShieldCheck, X, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { routeHref } from '../../hooks/useHashRoute';
import type { Route } from '../../hooks/useHashRoute';
import { cn } from '../../lib/cn';

const ITEMS: Array<{ route: Route; label: string }> = [
  { route: 'home', label: 'Home' },
  { route: 'dashboard', label: 'Dashboard' },
  { route: 'analyzer', label: 'Analyzer' },
  { route: 'report', label: 'Risk Report' },
  { route: 'privacy', label: 'Privacy Tips' },
];

export function Navbar({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const linkClass = (active: boolean) =>
    cn(
      'sg-nav-link relative rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
      active
        ? 'sg-nav-link-active text-neon-cyan'
        : 'text-slate-300 hover:bg-white/[0.045] hover:text-white',
    );

  return (
    <header className="sg-navbar sticky top-0 z-40">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <a
          href={routeHref('home')}
          className="sg-brand flex shrink-0 items-center gap-3 rounded-xl"
          aria-label="SecureGuard AI home"
        >
          <span className="sg-brand-icon">
            <ShieldCheck
              className="h-5 w-5"
              strokeWidth={2.1}
              aria-hidden="true"
            />
            <span className="sg-brand-spark" />
          </span>

          <span className="flex flex-col">
            <span className="sg-brand-title">
              SecureGuard <span>AI</span>
            </span>
            <span className="sg-brand-caption">PERSONAL SECURITY CENTER</span>
          </span>
        </a>

        <ul className="sg-nav-links hidden items-center gap-1 md:flex">
          {ITEMS.map((item) => {
            const active = route === item.route;

            return (
              <li key={item.route}>
                <a
                  href={routeHref(item.route)}
                  aria-current={active ? 'page' : undefined}
                  className={linkClass(active)}
                >
                  {item.label}
                  {active && <span className="sg-nav-active-line" />}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="sg-nav-status hidden items-center gap-2 lg:flex">
          <span className="sg-nav-status-icon">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="sg-nav-status-dot" />
          <span>SECURITY HUB</span>
        </div>

        <button
          type="button"
          className="sg-mobile-menu-button rounded-xl p-2.5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {open && (
        <div className="sg-mobile-menu md:hidden">
          <div className="sg-mobile-menu-heading">
            <span>Navigation</span>
            <span className="sg-mobile-menu-label">SECUREGUARD AI</span>
          </div>

          <ul id="mobile-menu" className="space-y-1.5">
            {ITEMS.map((item, index) => {
              const active = route === item.route;

              return (
                <li key={item.route}>
                  <a
                    href={routeHref(item.route)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'sg-mobile-nav-link',
                      active && 'sg-mobile-nav-link-active',
                    )}
                  >
                    <span className="sg-mobile-nav-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item.label}</span>
                    {active && <span className="sg-mobile-nav-indicator" />}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="sg-mobile-menu-footer">
            <span className="sg-nav-status-dot" />
            <span>PERSONAL SECURITY CENTER</span>
          </div>
        </div>
      )}
    </header>
  );
}
