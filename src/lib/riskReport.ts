import type { BreachCheckState, PasswordAnalysis, RiskReport, RiskReasonItem } from '../types';

/**
 * Builds an explainable report from existing results.
 * Pure function: no network, no storage, no password access.
 * The report is RULE-BASED. No AI model is used or connected.
 */
export function buildRiskReport(analysis: PasswordAnalysis, breach: BreachCheckState): RiskReport {
  const reasons: RiskReasonItem[] = [];

  // ---- Weakness (local analysis) ----
  reasons.push({
    source: 'Local analysis',
    text: `Strength estimate: ${analysis.label} (${analysis.score}/100), ${analysis.length} characters, about ${analysis.entropyBits} bits after pattern penalties.`,
  });
  if (analysis.findings.length === 0) {
    reasons.push({ source: 'Local analysis', text: 'No weak patterns were detected by the built-in checks.' });
  } else {
    for (const f of analysis.findings) {
      reasons.push({ source: 'Local analysis', text: `${f.title}: ${f.detail}` });
    }
  }

  // ---- Exposure (known-compromised check) ----
  switch (breach.status) {
    case 'found':
      reasons.push({
        source: 'Pwned Passwords check',
        text: `This password appears ${breach.count.toLocaleString()} time(s) in known compromised-password data.`,
      });
      break;
    case 'not-found':
      reasons.push({
        source: 'Pwned Passwords check',
        text: 'No match was found in the Pwned Passwords dataset at the time of the check.',
      });
      break;
    case 'error':
      reasons.push({
        source: 'Pwned Passwords check',
        text: 'The check failed, so breach exposure is unknown.',
      });
      break;
    case 'checking':
      reasons.push({ source: 'Pwned Passwords check', text: 'The check is still running.' });
      break;
    default:
      reasons.push({
        source: 'Pwned Passwords check',
        text: 'Not run yet, so breach exposure is unknown.',
      });
  }

  const limits = [
    'A "not found" result only means this password was not in the Pwned Passwords dataset. It does not prove the password is safe or that your accounts were never breached.',
    'This check covers known compromised passwords only. It cannot tell you whether a specific email address or account appeared in a breach.',
    'Strength scores are heuristic estimates based on length, character variety and common patterns. They are not a guarantee.',
    'This report is rule-based. No AI model is trained, connected or used in Phase 1.',
  ];

  const baseSteps = [
    'Use a unique password for every account.',
    'Use a password manager and turn on multi-factor authentication or passkeys.',
  ];

  // ---- Combine ----
  if (breach.status === 'found') {
    return {
      level: 'critical',
      headline: 'Known compromised password: stop using it',
      summary:
        'Exposure matters more than strength here. Even a password that looks strong is unsafe once attackers have it in a list.',
      reasons: [...reasons, { source: 'Combined', text: 'Known breach exposure overrides the strength score.' }],
      limits,
      nextSteps: [
        'Change this password everywhere you used it, starting with email, banking and work accounts.',
        'Create a new, unique password that is not a variation of this one.',
        ...baseSteps,
      ],
    };
  }

  const weak = analysis.score < 40;
  const fair = analysis.score >= 40 && analysis.score < 60;

  if (weak) {
    const combined: RiskReasonItem[] =
      breach.status === 'not-found'
        ? [{ source: 'Combined', text: 'Not appearing in a breach list does not offset a weak password.' }]
        : [];
    const extra = breach.status === 'idle' ? ['Run the known-compromised check for the exposure side of the picture.'] : [];
    return {
      level: 'high',
      headline: 'Weak password: easy to guess',
      summary:
        breach.status === 'not-found'
          ? 'It was not found in the known compromised list, but its own weaknesses still make it risky.'
          : 'Weakness is the main risk. Breach exposure has not been confirmed either way.',
      reasons: [...reasons, ...combined],
      limits,
      nextSteps: [...analysis.recommendations.slice(0, 3), ...extra, ...baseSteps].slice(0, 6),
    };
  }

  if (fair) {
    return {
      level: 'moderate',
      headline: 'Fair password: room to improve',
      summary: 'Reasonable, but longer or less predictable would be better.',
      reasons,
      limits,
      nextSteps: [...analysis.recommendations.slice(0, 3), ...baseSteps].slice(0, 6),
    };
  }

  // Strong or very strong
  if (breach.status === 'not-found') {
    return {
      level: 'low',
      headline: 'No known exposure and no major weakness found',
      summary: 'This looks good on both checks. Keep it unique and protected.',
      reasons: [...reasons, { source: 'Combined', text: 'Both checks passed, within the limits listed below.' }],
      limits,
      nextSteps: baseSteps,
    };
  }

  return {
    level: 'unknown',
    headline: 'Strength looks good, but exposure is unknown',
    summary: 'Run the known-compromised check to complete the picture.',
    reasons,
    limits,
    nextSteps: ['Run the known-compromised check on the Analyzer page.', ...baseSteps],
  };
}
