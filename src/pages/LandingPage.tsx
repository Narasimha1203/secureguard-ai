import {
  ArrowDownRight, ArrowRight, Activity, CheckCircle2, CircleDot,
  FileText, Fingerprint, KeyRound, LayoutDashboard, LockKeyhole, ShieldCheck,
  Sparkles, Waves, Zap,
} from 'lucide-react';
import { GlobePanel } from '../components/globe/GlobePanel';
import { ModuleList } from '../components/dashboard/ModuleList';
import { Badge } from '../components/ui/Badge';
import { LinkButton } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';

const FEATURES = [
  {
    icon: <KeyRound className="h-5 w-5" aria-hidden="true" />,
    number: '01',
    title: 'Password intelligence',
    text: 'Understand strength, spot predictable patterns, and get clear next steps without sending your password away.',
    status: 'READY',
  },
  {
    icon: <Fingerprint className="h-5 w-5" aria-hidden="true" />,
    number: '02',
    title: 'Exposure check',
    text: 'Check known compromised passwords using a privacy-preserving k-anonymity lookup that you start yourself.',
    status: 'READY',
  },
  {
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
    number: '03',
    title: 'Explainable reports',
    text: 'See what was checked, what was found, and what the results can—and cannot—tell you.',
    status: 'READY',
  },
];

const STEPS = [
  { title: 'Hash on your device', text: 'Your browser creates a one-way hash. Your password stays local.' },
  { title: 'Share a tiny prefix', text: 'Only the first five hash characters are sent to the range service.' },
  { title: 'Compare privately', text: 'The remaining characters are matched locally in your browser.' },
];

export function LandingPage() {
  return (
    <div className="sg-home">
      <section className="sg-hero relative overflow-hidden">
        <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="sg-orb sg-orb-cyan" />
        <div aria-hidden="true" className="sg-orb sg-orb-violet" />
        <div className="sg-hero-inner relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:gap-2 lg:pb-16 lg:pt-16">
          <div className="relative z-10 max-w-2xl">
            <div className="sg-eyebrow"><span className="sg-live-dot" /> PERSONAL SECURITY INTELLIGENCE <span className="sg-eyebrow-divider" /> V 1.0</div>
            <Badge tone="cyan">Privacy-first security toolkit</Badge>
            <h1 className="sg-headline mt-6">
              Your digital life.
              <br />
              <span>Better protected.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Take control of your password security with clear, explainable checks—designed to keep your credentials on your device.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton route="analyzer" icon={<KeyRound className="h-4 w-4" aria-hidden="true" />}>
                Analyze a password
              </LinkButton>
              <LinkButton route="dashboard" variant="secondary" icon={<LayoutDashboard className="h-4 w-4" aria-hidden="true" />}>
                Open dashboard
              </LinkButton>
            </div>
            <div className="sg-trust-row mt-8">
              <span><LockKeyhole className="h-4 w-4" /> Password stays local</span>
              <span><CheckCircle2 className="h-4 w-4" /> You control every check</span>
            </div>
          </div>

          <div className="sg-visual-wrap relative mx-auto w-full max-w-[570px]">
            <div className="sg-visual-label"><span className="sg-live-dot" /> SECURITY VISUALIZATION <span className="ml-auto">ILLUSTRATION</span></div>
            <div className="sg-globe-shell">
              <div className="sg-globe-halo" />
              <GlobePanel />
              <div className="sg-float-card sg-float-card-top">
                <div className="sg-mini-icon cyan"><Activity className="h-4 w-4" /></div>
                <div><div className="sg-card-kicker">SECURITY STATUS</div><div className="sg-card-value">Privacy-first</div></div>
                <span className="sg-card-check"><CheckCircle2 className="h-4 w-4" /></span>
              </div>
              <div className="sg-float-card sg-float-card-bottom">
                <div className="sg-mini-icon violet"><Fingerprint className="h-4 w-4" /></div>
                <div><div className="sg-card-kicker">CREDENTIALS</div><div className="sg-card-value">Never stored</div></div>
                <span className="sg-card-check"><ShieldCheck className="h-4 w-4" /></span>
              </div>
              <div className="sg-orbit-tag"><Waves className="h-3.5 w-3.5" /> ENCRYPTED BY DESIGN</div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="sg-metrics-grid">
            <div className="sg-metric"><span className="sg-metric-icon"><LockKeyhole /></span><div><strong>Local-first</strong><small>Your password stays in your browser</small></div></div>
            <div className="sg-metric"><span className="sg-metric-icon purple"><Zap /></span><div><strong>On-demand checks</strong><small>You choose when to run a check</small></div></div>
            <div className="sg-metric"><span className="sg-metric-icon"><ShieldCheck /></span><div><strong>Clear explanations</strong><small>Results with transparent limitations</small></div></div>
          </div>
        </div>
      </section>

      <section className="sg-section mx-auto max-w-7xl px-4 pt-20 sm:px-6" aria-labelledby="features-title">
        <div className="sg-section-heading">
          <div><div className="sg-section-kicker"><Sparkles className="h-4 w-4" /> CORE CAPABILITIES</div><h2 id="features-title">Security that makes sense.</h2><p>Practical tools that help you make a more informed decision about your credentials.</p></div>
          <span className="sg-section-index">01 <span>/ 03</span></span>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="h-full">
              <GlassPanel className="sg-feature-card h-full">
                <div className="flex items-center justify-between"><span className="sg-feature-icon">{f.icon}</span><span className="sg-feature-number">{f.number}</span></div>
                <div className="sg-feature-status"><span className="sg-live-dot" /> {f.status}</div>
                <h3 className="mt-3 text-xl font-semibold text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{f.text}</p>
                <div className="sg-feature-bottom"><span>EXPLORE CAPABILITY</span><ArrowRight className="h-4 w-4" /></div>
              </GlassPanel>
            </li>
          ))}
        </ul>
      </section>

      <section className="sg-section mx-auto max-w-7xl px-4 pt-20 sm:px-6" aria-labelledby="how-title">
        <div className="sg-section-heading">
          <div><div className="sg-section-kicker"><Fingerprint className="h-4 w-4" /> PRIVACY WORKFLOW</div><h2 id="how-title">Your secret stays yours.</h2><p>Learn how the compromised-password check limits what leaves your browser.</p></div>
          <span className="sg-section-index">02 <span>/ 03</span></span>
        </div>
        <div className="sg-privacy-panel mt-8">
          <div className="sg-privacy-intro"><div className="sg-privacy-symbol"><ShieldCheck className="h-7 w-7" /></div><div><h3>Built around privacy</h3><p>Three steps. No full password transmission.</p></div></div>
          <ol className="sg-steps-grid">
            {STEPS.map((s, i) => <li key={s.title} className="sg-step"><div className="sg-step-top"><span>STEP 0{i + 1}</span><ArrowDownRight className="h-4 w-4" /></div><h4>{s.title}</h4><p>{s.text}</p></li>)}
          </ol>
          <p className="sg-disclaimer"><CircleDot className="h-4 w-4 shrink-0" /> This check identifies known compromised passwords only. It does not check email addresses or detect every possible breach.</p>
        </div>
      </section>

      <section className="sg-section mx-auto max-w-7xl px-4 pt-20 sm:px-6" aria-labelledby="planned-title">
        <div className="sg-section-heading"><div><div className="sg-section-kicker"><LayoutDashboard className="h-4 w-4" /> PRODUCT ROADMAP</div><h2 id="planned-title">The next layer of protection.</h2><p>Planned monitoring features are clearly marked until a backend is connected.</p></div><span className="sg-section-index">03 <span>/ 03</span></span></div>
        <div className="mt-8"><ModuleList /></div>
        <div className="sg-bottom-cta mt-10"><div><div className="sg-section-kicker"><ShieldCheck className="h-4 w-4" /> TAKE THE FIRST STEP</div><h3>Know where you stand.</h3><p>Run a password analysis and get clear next steps in seconds.</p></div><LinkButton route="analyzer" icon={<ArrowRight className="h-4 w-4" />}>Start password check</LinkButton></div>
      </section>
    </div>
  );
}
