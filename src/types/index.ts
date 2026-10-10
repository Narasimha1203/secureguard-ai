// Shared types. NOTE: none of these types ever contain a raw password.

export type Severity = 'low' | 'medium' | 'high';

export interface Finding {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
}

export type StrengthLabel = 'Very weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong';

export interface PasswordAnalysis {
  /** 0-100 heuristic score (an estimate, not a guarantee). */
  score: number;
  label: StrengthLabel;
  length: number;
  /** Rough entropy estimate in bits after pattern penalties. */
  entropyBits: number;
  charClasses: { lower: boolean; upper: boolean; digit: boolean; symbol: boolean };
  findings: Finding[];
  recommendations: string[];
  analyzedAt: string;
}

export type BreachCheckState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'found'; count: number; prefix: string; checkedAt: string }
  | { status: 'not-found'; prefix: string; checkedAt: string }
  | { status: 'error'; message: string };

export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'unknown';

export interface RiskReasonItem {
  source: 'Local analysis' | 'Pwned Passwords check' | 'Combined';
  text: string;
}

export interface RiskReport {
  level: RiskLevel;
  headline: string;
  summary: string;
  reasons: RiskReasonItem[];
  limits: string[];
  nextSteps: string[];
}

export interface BackendModule {
  id: 'email-monitoring' | 'ai-explanations' | 'alerts' | 'history';
  name: string;
  description: string;
  /** Always false in Phase 1. Flip only when the feature is truly integrated. */
  connected: boolean;
}
