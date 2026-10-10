import { Activity, ArrowUpRight, Database, Fingerprint, Gauge, KeyRound, ListChecks, LockKeyhole, Radar, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { ModuleList } from '../components/dashboard/ModuleList';
import { ScanResultCard } from '../components/dashboard/ScanResultCard';
import { FindingsList } from '../components/analyzer/FindingsList';
import { Badge } from '../components/ui/Badge';
import type { BadgeTone } from '../components/ui/Badge';
import { Button, LinkButton } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { PageHeader } from '../components/ui/PageHeader';
import { useAnalysis } from '../context/AnalysisContext';
import type { BreachCheckState, StrengthLabel } from '../types';

const STRENGTH_TONE: Record<StrengthLabel, BadgeTone> = {
  'Very weak': 'red', Weak: 'red', Fair: 'amber', Strong: 'green', 'Very strong': 'green',
};
function breachSummary(b: BreachCheckState): { value: string; tone: BadgeTone; detail: string } {
  switch (b.status) {
    case 'found': return { value: 'Exposure found', tone: 'red', detail: `Appears ${b.count.toLocaleString()} time(s) in the Pwned Passwords dataset. Do not use this password.` };
    case 'not-found': return { value: 'Not found', tone: 'green', detail: 'Not found in the dataset at check time. This does not prove a password is safe.' };
    case 'checking': return { value: 'Checking…', tone: 'cyan', detail: 'The privacy-preserving range check is in progress.' };
    case 'error': return { value: 'Check failed', tone: 'red', detail: b.message };
    default: return { value: 'Not checked', tone: 'slate', detail: 'Run the compromised-password check from Analyzer to check known exposure.' };
  }
}

const modules = [
  { icon: <KeyRound className="h-4 w-4" />, title: 'Password intelligence', text: 'Strength, predictable patterns and practical recommendations.', status: 'AVAILABLE', tone: 'cyan' },
  { icon: <Fingerprint className="h-4 w-4" />, title: 'Known exposure check', text: 'Optional range lookup; only a short hash prefix is sent.', status: 'ON DEMAND', tone: 'violet' },
  { icon: <Radar className="h-4 w-4" />, title: 'Account monitoring', text: 'Email breach monitoring needs a secure backend connection.', status: 'NOT CONNECTED', tone: 'amber' },
];

export function DashboardPage() {
  const { analysis, breach, resetAll } = useAnalysis();
  const b = breachSummary(breach);
  return (
    <div className="sg-dashboard mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="sg-dashboard-topline"><span><span className="sg-live-dot" /> SECURITY OPERATIONS CENTER</span><span className="sg-dashboard-session"><LockKeyhole className="h-3.5 w-3.5" /> LOCAL SESSION</span></div>
      <PageHeader title="Security command center" description="A clear view of your password checks, findings and privacy status. Results are calculated in your browser and are not stored." badge={<Badge tone="cyan">Privacy-first</Badge>} />

      <div className="sg-dashboard-banner glass">
        <div className="sg-dashboard-banner-copy">
          <div className="sg-eyebrow"><span className="sg-live-dot" /> PERSONAL SECURITY OVERVIEW</div>
          <h2>{analysis ? 'Your analysis is ready.' : 'Your security starts here.'}</h2>
          <p>{analysis ? 'Review the findings below, then use the report to understand what they mean.' : 'Run a password analysis to populate this command center with real results. No demo metrics or invented alerts.'}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <LinkButton route="analyzer" icon={<KeyRound className="h-4 w-4" aria-hidden="true" />}>{analysis ? 'Analyze another password' : 'Start password analysis'}</LinkButton>
            {analysis && <LinkButton route="report" variant="secondary" icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}>View risk report</LinkButton>}
          </div>
        </div>
        <div className="sg-dashboard-radar" aria-hidden="true">
          <div className="sg-radar-ring sg-radar-ring-1" /><div className="sg-radar-ring sg-radar-ring-2" /><div className="sg-radar-ring sg-radar-ring-3" />
          <div className="sg-radar-core"><ShieldCheck className="h-10 w-10" /></div><span className="sg-radar-point sg-radar-point-a" /><span className="sg-radar-point sg-radar-point-b" /><span className="sg-radar-point sg-radar-point-c" />
          <div className="sg-radar-caption"><Activity className="h-3.5 w-3.5" /> {analysis ? 'ANALYSIS COMPLETE' : 'READY FOR ANALYSIS'}</div>
        </div>
      </div>

      <section className="mt-8" aria-labelledby="snapshot-title">
        <div className="sg-section-heading"><div><div className="sg-section-kicker">LIVE SNAPSHOT</div><h2 id="snapshot-title">Security overview</h2></div><span className="sg-section-note">{analysis ? 'Based on your current analysis' : 'Waiting for your first scan'}</span></div>
        {analysis ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ScanResultCard icon={<Gauge className="h-5 w-5" aria-hidden="true" />} title="Password strength" source="Local browser analysis" value={`${analysis.label} · ${analysis.score}/100`} valueTone={STRENGTH_TONE[analysis.label]} detail="A heuristic estimate of how guessable the password is." />
          <ScanResultCard icon={<Database className="h-5 w-5" aria-hidden="true" />} title="Known exposure" source="Pwned Passwords range API, on demand" value={b.value} valueTone={b.tone} detail={b.detail} />
          <ScanResultCard icon={<ListChecks className="h-5 w-5" aria-hidden="true" />} title="Weak patterns" source="Local browser analysis" value={`${analysis.findings.length} finding${analysis.findings.length === 1 ? '' : 's'}`} valueTone={analysis.findings.length === 0 ? 'green' : 'amber'} detail="Rule-based checks for predictable patterns and common weaknesses." />
          <ScanResultCard icon={<Activity className="h-5 w-5" aria-hidden="true" />} title="Entropy estimate" source="Local estimate" value={`~${analysis.entropyBits} bits`} valueTone="cyan" detail="An approximate unpredictability estimate, not a guarantee of safety." />
        </div> : <div className="sg-empty-grid">
          <div className="sg-empty-tile"><span className="sg-empty-icon"><Gauge className="h-5 w-5" /></span><span className="sg-empty-label">PASSWORD STRENGTH</span><strong>Awaiting scan</strong><small>Strength score appears here</small></div>
          <div className="sg-empty-tile"><span className="sg-empty-icon violet"><Database className="h-5 w-5" /></span><span className="sg-empty-label">KNOWN EXPOSURE</span><strong>Not checked</strong><small>Only checked when you request it</small></div>
          <div className="sg-empty-tile"><span className="sg-empty-icon amber"><ListChecks className="h-5 w-5" /></span><span className="sg-empty-label">WEAK PATTERNS</span><strong>Awaiting scan</strong><small>Findings are never fabricated</small></div>
          <div className="sg-empty-tile"><span className="sg-empty-icon violet"><Sparkles className="h-5 w-5" /></span><span className="sg-empty-label">RISK REPORT</span><strong>Not generated</strong><small>Generated from analysis findings</small></div>
        </div>}
      </section>

      {analysis && <section className="mt-8" aria-labelledby="findings-title"><div className="sg-section-heading"><div><div className="sg-section-kicker">EXPLAINABLE SIGNALS</div><h2 id="findings-title">Weak patterns detected</h2></div></div><GlassPanel><FindingsList findings={analysis.findings} /></GlassPanel><div className="mt-5 flex flex-wrap gap-3"><LinkButton route="report">Open risk report</LinkButton><Button variant="danger" icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />} onClick={resetAll}>Clear session results</Button></div></section>}

      <section className="mt-10" aria-labelledby="modules-title">
        <div className="sg-section-heading"><div><div className="sg-section-kicker">CAPABILITIES & STATUS</div><h2 id="modules-title">Security modules</h2></div><span className="sg-section-note">Status shown honestly</span></div>
        <div className="sg-module-grid">{modules.map((m) => <article className="sg-module-card glass" key={m.title}><span className={`sg-module-icon ${m.tone}`}>{m.icon}</span><span className={`sg-module-status ${m.tone}`}>{m.status}</span><h3>{m.title}</h3><p>{m.text}</p></article>)}</div>
        <div className="mt-5"><ModuleList /></div>
      </section>
    </div>
  );
}
