
import { KeyRound, ShieldCheck, ScanSearch, Sparkles, Activity, LockKeyhole } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BreachCheckPanel } from '../components/analyzer/BreachCheckPanel';
import { FindingsList } from '../components/analyzer/FindingsList';
import { PasswordInput } from '../components/analyzer/PasswordInput';
import { RecommendationsList } from '../components/analyzer/RecommendationsList';
import { StrengthMeter } from '../components/analyzer/StrengthMeter';
import { LinkButton } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { PageHeader } from '../components/ui/PageHeader';
import { LocalBadge } from '../components/ui/Badge';
import { StateBlock } from '../components/ui/StateBlock';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzePassword } from '../lib/passwordAnalysis';
import { ApiError, checkPwnedPassword } from '../services/api';

export function AnalyzerPage() {
  const { breach, setAnalysis, setBreach } = useAnalysis();
  const [password, setPassword] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);

  const analysis = useMemo(
    () => (password ? analyzePassword(password) : null),
    [password],
  );

  useEffect(() => {
    if (!analysis) return;
    abortRef.current?.abort();
    inFlightRef.current = false;
    setAnalysis(analysis);
    setBreach({ status: 'idle' });
  }, [analysis, setAnalysis, setBreach]);

  const clearPassword = useCallback(() => {
    if (inFlightRef.current) {
      abortRef.current?.abort();
      inFlightRef.current = false;
      setBreach({ status: 'idle' });
    }
    setPassword('');
  }, [setBreach]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) clearPassword();
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      abortRef.current?.abort();
    };
  }, [clearPassword]);

  const runCheck = async () => {
    if (!password) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    inFlightRef.current = true;
    setBreach({ status: 'checking' });

    try {
      const result = await checkPwnedPassword(password, controller.signal);
      if (controller.signal.aborted) return;

      inFlightRef.current = false;
      const checkedAt = new Date().toISOString();

      setBreach(
        result.found
          ? {
              status: 'found',
              count: result.count,
              prefix: result.prefix,
              checkedAt,
            }
          : {
              status: 'not-found',
              prefix: result.prefix,
              checkedAt,
            },
      );
    } catch (err) {
      if (controller.signal.aborted) return;

      inFlightRef.current = false;
      const message =
        err instanceof ApiError
          ? err.userMessage
          : 'Something went wrong. Please try again.';

      setBreach({ status: 'error', message });
    }
  };

  const characterTypes = analysis
    ? [
        analysis.charClasses.lower && 'Lowercase',
        analysis.charClasses.upper && 'Uppercase',
        analysis.charClasses.digit && 'Numbers',
        analysis.charClasses.symbol && 'Symbols',
      ].filter(Boolean)
    : [];

  return (
    <main className="sg-analyzer-page mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="sg-analyzer-icon flex h-12 w-12 items-center justify-center rounded-2xl">
            <ScanSearch className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              SecureGuard AI / Security tools
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Password security workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs text-cyan-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          Local analysis
        </div>
      </div>

      <PageHeader
        title="Password analyzer"
        description="Evaluate password strength, identify risky patterns, and optionally check compromised-password data."
        badge={<LocalBadge />}
      />

      <div className="sg-analyzer-banner mb-8 overflow-hidden rounded-3xl border border-cyan-400/20 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                Your security, made easier to understand
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Analysis runs in your browser. Your raw password is not saved
                to the shared analysis context.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <LockKeyhole className="h-4 w-4 text-cyan-300" />
            Password stays local
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="space-y-6">
          <div className="sg-analyzer-section-heading">
            <span className="sg-analyzer-step">01</span>
            <div>
              <h2 className="font-semibold text-white">Test a password</h2>
              <p className="text-sm text-slate-400">
                Enter a password to begin your analysis.
              </p>
            </div>
          </div>

          <GlassPanel>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Password input</h2>
                <p className="text-xs text-slate-400">
                  Results update as you type
                </p>
              </div>
            </div>

            <PasswordInput
              id="password-field"
              label="Password to analyze"
              value={password}
              onChange={setPassword}
              onClear={clearPassword}
            />

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-700/70 bg-slate-950/40 p-3">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              <p className="text-xs leading-5 text-slate-400">
                Never enter a password you currently use for an important
                account. Use a sample password for demonstrations.
              </p>
            </div>
          </GlassPanel>

          <GlassPanel>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  Compromised-password check
                </h2>
                <p className="text-xs text-slate-400">
                  Optional online breach-data lookup
                </p>
              </div>
            </div>

            <BreachCheckPanel
              state={breach}
              hasPassword={password.length > 0}
              onCheck={runCheck}
            />
          </GlassPanel>
        </section>

        <section className="space-y-6">
          <div className="sg-analyzer-section-heading">
            <span className="sg-analyzer-step">02</span>
            <div>
              <h2 className="font-semibold text-white">Security results</h2>
              <p className="text-sm text-slate-400">
                Understand the strength and risks detected.
              </p>
            </div>
          </div>

          {!analysis ? (
            <GlassPanel>
              <div className="py-8">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
                  <Sparkles className="h-8 w-8" />
                </div>
                <StateBlock
                  kind="empty"
                  title="Ready for analysis"
                  description="Enter a sample password in the input panel. Strength, findings, and recommendations will appear here."
                />
              </div>
            </GlassPanel>
          ) : (
            <>
              <GlassPanel>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      Security overview
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                      Password strength
                    </h2>
                  </div>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-200">
                    Rule-based estimate
                  </span>
                </div>

                <StrengthMeter score={analysis.score} label={analysis.label} />

                <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/35 p-4">
                    <dt className="text-xs text-slate-400">Length</dt>
                    <dd className="mt-2 text-lg font-semibold text-white">
                      {analysis.length}
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        chars
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/35 p-4">
                    <dt className="text-xs text-slate-400">Entropy estimate</dt>
                    <dd className="mt-2 text-lg font-semibold text-white">
                      {analysis.entropyBits}
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        bits
                      </span>
                    </dd>
                  </div>
                  <div className="col-span-2 rounded-2xl border border-slate-700/70 bg-slate-950/35 p-4 sm:col-span-1">
                    <dt className="text-xs text-slate-400">Character types</dt>
                    <dd className="mt-2 text-sm font-medium leading-5 text-white">
                      {characterTypes.join(', ') || 'None detected'}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  This is a rule-based estimate, not an AI prediction or a
                  guarantee of real-world security.
                </p>
              </GlassPanel>

              <GlassPanel>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
                    <ScanSearch className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">
                      Weak patterns found
                    </h2>
                    <p className="text-xs text-slate-400">
                      Patterns that may make guessing easier
                    </p>
                  </div>
                </div>
                <FindingsList findings={analysis.findings} />
              </GlassPanel>

              <GlassPanel>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">
                      Recommended improvements
                    </h2>
                    <p className="text-xs text-slate-400">
                      Practical next steps for stronger security
                    </p>
                  </div>
                </div>
                <RecommendationsList items={analysis.recommendations} />
              </GlassPanel>

              <div className="flex flex-wrap gap-3">
                <LinkButton
                  route="report"
                  icon={
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  }
                >
                  View risk report
                </LinkButton>
                <LinkButton route="dashboard" variant="ghost">
                  Go to dashboard
                </LinkButton>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
