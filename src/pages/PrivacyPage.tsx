
import {
  ExternalLink,
  Fingerprint,
  KeyRound,
  Lock,
  Smartphone,
  UserX,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '../components/ui/Badge';
import { GlassPanel } from '../components/ui/GlassPanel';
import { PageHeader } from '../components/ui/PageHeader';

const TIPS: Array<{
  icon: ReactNode;
  title: string;
  text: string;
  tag: string;
}> = [
  {
    icon: <KeyRound className="h-5 w-5" aria-hidden="true" />,
    title: 'Use unique passwords',
    text: 'When one site is breached, attackers may try the same password on other sites. Unique passwords help prevent one leak from affecting multiple accounts.',
    tag: 'PASSWORD HYGIENE',
  },
  {
    icon: <Lock className="h-5 w-5" aria-hidden="true" />,
    title: 'Use a password manager',
    text: 'Create and store long, random passwords with a trusted password manager. You only need to remember your master passphrase.',
    tag: 'RECOMMENDED',
  },
  {
    icon: <Smartphone className="h-5 w-5" aria-hidden="true" />,
    title: 'Enable multi-factor authentication',
    text: 'Add another layer of protection if a password is exposed. When available, prefer an authenticator app or security key over SMS.',
    tag: 'ACCOUNT DEFENSE',
  },
  {
    icon: <Fingerprint className="h-5 w-5" aria-hidden="true" />,
    title: 'Switch to passkeys',
    text: 'Passkeys use cryptographic authentication and are designed to resist phishing. Enable them on important accounts that support them.',
    tag: 'MODERN SECURITY',
  },
  {
    icon: <UserX className="h-5 w-5" aria-hidden="true" />,
    title: 'Watch where you enter credentials',
    text: 'Check the website address before signing in. Avoid entering real passwords into unfamiliar websites or tools; use a test password when learning.',
    tag: 'ANTI-PHISHING',
  },
  {
    icon: <Mail className="h-5 w-5" aria-hidden="true" />,
    title: 'Check for email breaches',
    text: 'Password strength and email breach exposure are different checks. Use a reputable breach-notification service to check whether an email appears in known breaches.',
    tag: 'BREACH AWARENESS',
  },
];

const PRIVACY_POINTS = [
  'The password is held in memory while you use the Analyzer page.',
  'The app is designed not to save passwords in browser storage, include them in the page URL, or send them to analytics.',
  'The password can be cleared using the Clear control or by leaving the Analyzer page.',
  'Password strength analysis runs in your browser.',
  'The compromised-password check sends only the first five characters of a SHA-1 hash after you request the check.',
  'Dashboard results are temporary and are cleared when the page is reloaded.',
];

export function PrivacyPage() {
  return (
    <main className="sg-privacy-page mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="sg-privacy-hero">
        <div className="sg-privacy-orb sg-privacy-orb-one" aria-hidden="true" />
        <div className="sg-privacy-orb sg-privacy-orb-two" aria-hidden="true" />

        <div className="relative z-10">
          <div className="sg-privacy-eyebrow">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>SECURITY KNOWLEDGE CENTER</span>
          </div>

          <PageHeader
            title="Privacy & security"
            description="Build stronger digital habits, understand your security exposure, and learn how SecureGuard AI is designed to handle your data."
          />

          <div className="sg-privacy-hero-footer">
            <div className="flex items-center gap-2">
              <span className="sg-privacy-status-dot" />
              <span>Security awareness</span>
            </div>
            <span className="sg-privacy-hero-divider" />
            <span>6 essential practices</span>
          </div>
        </div>
      </div>

      <section className="sg-privacy-section" aria-labelledby="tips-title">
        <div className="sg-privacy-section-heading">
          <div>
            <p className="sg-privacy-kicker">YOUR SECURITY PLAYBOOK</p>
            <h2 id="tips-title">Build your defense</h2>
            <p>Small changes that make your accounts harder to compromise.</p>
          </div>
          <div className="sg-privacy-section-icon">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>

        <ul className="sg-privacy-grid">
          {TIPS.map((tip, index) => (
            <li key={tip.title} className="sg-privacy-card-wrap">
              <GlassPanel className="sg-privacy-card h-full">
                <div className="sg-privacy-card-top">
                  <span className="sg-privacy-card-icon">{tip.icon}</span>
                  <span className="sg-privacy-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <span className="sg-privacy-tag">{tip.tag}</span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>

                <div className="sg-privacy-card-bottom">
                  <span className="sg-privacy-card-line" />
                  <CheckCircle2
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </div>
              </GlassPanel>
            </li>
          ))}
        </ul>

        <a
          href="https://haveibeenpwned.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="sg-privacy-external-link"
        >
          <span className="sg-privacy-external-icon">
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="sg-privacy-external-copy">
            <strong>Have I Been Pwned</strong>
            <span>Visit the official website to check known email breach exposure.</span>
          </span>
          <ArrowUpRight className="sg-privacy-external-arrow h-5 w-5" aria-hidden="true" />
        </a>
      </section>

      <section
        className="sg-privacy-section sg-privacy-data-section"
        aria-labelledby="handling-title"
      >
        <div className="sg-privacy-section-heading">
          <div>
            <p className="sg-privacy-kicker">TRANSPARENCY BY DESIGN</p>
            <h2 id="handling-title">How your data is handled</h2>
            <p>Understand what happens when you analyze a password.</p>
          </div>
          <div className="sg-privacy-section-icon">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>

        <GlassPanel className="sg-privacy-data-panel">
          <div className="sg-privacy-data-header">
            <div className="sg-privacy-data-lock">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3>Analyzer privacy overview</h3>
              <p>Current intended app behavior</p>
            </div>
            <Badge tone="cyan">Privacy</Badge>
          </div>

          <ul className="sg-privacy-checklist">
            {PRIVACY_POINTS.map((point, index) => (
              <li key={point}>
                <span className="sg-privacy-check">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{point}</span>
                <span className="sg-privacy-data-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>

          <div className="sg-privacy-notice">
            <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p>
              <strong>Stay cautious with real credentials.</strong> Browser
              extensions, shared computers, and screen sharing may expose
              what you type. If you are unsure about a tool, use a test
              password instead of a real one.
            </p>
          </div>
        </GlassPanel>
      </section>

      <div className="sg-privacy-footer">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        <span>Stay informed. Stay protected. Stay in control.</span>
      </div>
    </main>
  );
}
