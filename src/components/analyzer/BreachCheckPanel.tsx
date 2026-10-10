import { AlertTriangle, CheckCircle2, Database, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { StateBlock } from '../ui/StateBlock';
import type { BreachCheckState } from '../../types';

interface BreachCheckPanelProps {
  state: BreachCheckState;
  hasPassword: boolean;
  onCheck: () => void;
}

/** Interface for the known compromised-password check (Pwned Passwords, k-anonymity). */
export function BreachCheckPanel({ state, hasPassword, onCheck }: BreachCheckPanelProps) {
  return (
    <div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-400">
        <p>
          <span className="font-medium text-slate-200">How this works:</span> your browser hashes the password with
          SHA-1, sends <span className="font-medium text-slate-200">only the first 5 characters</span> of that hash to
          the Have I Been Pwned Pwned Passwords service, and compares the returned list locally. The password itself
          never leaves your device.
        </p>
        <p className="mt-2">
          <span className="font-medium text-slate-200">Limit:</span> this detects <em>known compromised passwords</em>{' '}
          only. It cannot detect every possible breach, and it does not check email addresses.
        </p>
      </div>

      <div className="mt-4">
        {state.status === 'idle' && (
          <div className="flex flex-col items-start gap-3">
            <Button
              icon={<Database className="h-4 w-4" aria-hidden="true" />}
              onClick={onCheck}
              disabled={!hasPassword}
            >
              Check known compromised passwords
            </Button>
            {!hasPassword && <p className="text-xs text-slate-500">Enter a password above to enable this check.</p>}
          </div>
        )}

        {state.status === 'checking' && (
          <StateBlock kind="loading" title="Checking..." description="Sending a 5-character hash prefix and comparing results locally." />
        )}

        {state.status === 'found' && (
          <div role="alert" className="rounded-xl border border-red-400/50 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
              <div>
                <p className="font-semibold text-red-100">Found in known compromised passwords</p>
                <p className="mt-1 text-sm text-red-100/80">
                  This password appears {state.count.toLocaleString()} time(s) in the Pwned Passwords dataset. Do not use
                  it, and change it anywhere you already do.
                </p>
                <p className="mt-2 text-xs text-red-100/60">Hash prefix sent: {state.prefix}</p>
              </div>
            </div>
          </div>
        )}

        {state.status === 'not-found' && (
          <div role="status" className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
              <div>
                <p className="font-semibold text-emerald-100">Not found in the Pwned Passwords dataset</p>
                <p className="mt-1 text-sm text-emerald-100/80">
                  That is good, but it is not proof of safety. It only means this password is not in the known
                  compromised list that was checked.
                </p>
                <p className="mt-2 text-xs text-emerald-100/60">Hash prefix sent: {state.prefix}</p>
              </div>
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <StateBlock
            kind="error"
            title="The check could not finish"
            description={state.message}
            action={
              <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" aria-hidden="true" />} onClick={onCheck} disabled={!hasPassword}>
                Try again
              </Button>
            }
          />
        )}

        {(state.status === 'found' || state.status === 'not-found') && (
          <div className="mt-3">
            <Button variant="ghost" icon={<RefreshCw className="h-4 w-4" aria-hidden="true" />} onClick={onCheck} disabled={!hasPassword}>
              Check again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
