import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { BreachCheckState, PasswordAnalysis } from '../types';

/**
 * Holds DERIVED, non-sensitive results for this browser tab only (React state).
 * It never holds the raw password, and nothing is written to browser storage.
 * Reloading the page clears everything.
 */
interface AnalysisContextValue {
  analysis: PasswordAnalysis | null;
  breach: BreachCheckState;
  setAnalysis: (value: PasswordAnalysis | null) => void;
  setBreach: (value: BreachCheckState) => void;
  resetAll: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [breach, setBreach] = useState<BreachCheckState>({ status: 'idle' });

  const resetAll = useCallback(() => {
    setAnalysis(null);
    setBreach({ status: 'idle' });
  }, []);

  const value = useMemo(
    () => ({ analysis, breach, setAnalysis, setBreach, resetAll }),
    [analysis, breach, resetAll],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used inside <AnalysisProvider>');
  return ctx;
}
