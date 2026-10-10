
import { ShieldCheck, ArrowUpRight, LockKeyhole } from 'lucide-react';
import { routeHref } from '../../hooks/useHashRoute';

export function Footer() {
  return (
    <footer className="sg-footer mt-20">
      <div className="sg-footer-glow" aria-hidden="true" />

      <div className="sg-footer-inner mx-auto max-w-7xl px-4 sm:px-6">
        <div className="sg-footer-main">
          <a
            href={routeHref('home')}
            className="sg-footer-brand"
            aria-label="SecureGuard AI home"
          >
            <span className="sg-footer-logo">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <strong>SecureGuard <span>AI</span></strong>
              <small>PERSONAL SECURITY CENTER</small>
            </span>
          </a>

          <p className="sg-footer-description">
            Understand your password security, identify common risks, and
            build safer digital habits.
          </p>

          <div className="sg-footer-project-status">
            <span className="sg-footer-status-dot" />
            <span>FRONTEND DEMO</span>
            <span className="sg-footer-status-divider" />
            <span>No backend connected</span>
          </div>
        </div>

        <div className="sg-footer-links">
          <h2>EXPLORE</h2>
          <a href={routeHref('analyzer')}>
            Password Analyzer
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a href={routeHref('dashboard')}>Security Dashboard</a>
          <a href={routeHref('report')}>Risk Report</a>
          <a href={routeHref('privacy')}>Privacy Tips</a>
        </div>

        <div className="sg-footer-trust">
          <span className="sg-footer-trust-icon">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2>Security starts with awareness.</h2>
          <p>
            Learn what makes a password safer and how to protect your
            accounts online.
          </p>
          <a href={routeHref('privacy')}>Explore security practices →</a>
        </div>

        <div className="sg-footer-bottom">
          <p>© {new Date().getFullYear()} SecureGuard AI</p>
          <p className="sg-footer-disclaimer">
            Educational demo · Not a substitute for a security audit
          </p>
          <a href={routeHref('home')} className="sg-footer-back-top">
            Back to home ↑
          </a>
        </div>
      </div>
    </footer>
  );
}