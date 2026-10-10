
import {
  KeyRound,
  ShieldCheck,
  FileSearch,
  LockKeyhole,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { useMemo } from 'react';
import { RiskReportView } from '../components/report/RiskReportView';
import { Badge } from '../components/ui/Badge';
import { LinkButton } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { PageHeader } from '../components/ui/PageHeader';
import { StateBlock } from '../components/ui/StateBlock';
import { useAnalysis } from '../context/AnalysisContext';
import { buildRiskReport } from '../lib/riskReport';

export function ReportPage() {
  const { analysis, breach } = useAnalysis();

  const report = useMemo(
    () => (analysis ? buildRiskReport(analysis, breach) : null),
    [analysis, breach],
  );

  return (
    <main className="sg-report-page mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="sg-report-icon flex h-12 w-12 items-center justify-center rounded-2xl">
            <FileSearch className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
              SecureGuard AI / Intelligence
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Password security assessment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-3 py-2 text-xs text-violet-200">
          <Activity className="h-3.5 w-3.5" />
          Explainable assessment
        </div>
      </div>

      <PageHeader
        title="Explainable risk report"
        description="Understand password weakness and known breach exposure separately, with clear explanations of the risks and practical ways to reduce them."
        badge={<Badge tone="violet">Rule-based, no AI model</Badge>}
      />

      <section className="sg-report-banner mb-8 rounded-3xl border border-violet-400/20 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-violet-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Security findings you can understand
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Password strength estimates and breach-check results describe
              different security concerns. Review each finding and follow the
              recommendations relevant to your situation.
            </p>
          </div>
        </div>
      </section>

      {!report ? (
        <GlassPanel>
          <div className="py-6">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
              <KeyRound className="h-8 w-8" />
            </div>

            <StateBlock
              kind="empty"
              title="Your risk report is waiting"
              description="Analyze a sample password first. Your report will then display the available findings and explanations."
              action={
                <LinkButton
                  route="analyzer"
                  icon={
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  }
                >
                  Open password analyzer
                </LinkButton>
              }
            />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-700/60 bg-slate-950/30 p-4">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
            <p className="text-xs leading-5 text-slate-400">
              For demonstrations, use a sample password rather than a password
              that protects one of your real accounts.
            </p>
          </div>
        </GlassPanel>
      ) : (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="sg-report-step">01</span>
            <div>
              <h2 className="font-semibold text-white">Assessment results</h2>
              <p className="text-sm text-slate-400">
                Review the findings from your latest analysis.
              </p>
            </div>
          </div>

          <RiskReportView report={report} />
        </section>
      )}
    </main>
  );
}
