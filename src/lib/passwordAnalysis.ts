import type { Finding, PasswordAnalysis, StrengthLabel } from '../types';

/**
 * LOCAL, rule-based password analysis. Runs entirely in the browser.
 *
 * - It is NOT an AI model and NOT a breach database.
 * - The built-in common-password list below is deliberately tiny. A password
 *   missing from it is not necessarily uncommon.
 * - The raw password is never stored, logged or returned by this module.
 */

const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '123456', '1234567', '12345678', '123456789',
  '1234567890', 'qwerty', 'qwerty123', 'qwertyuiop', 'abc123', '111111', '000000',
  'letmein', 'welcome', 'welcome1', 'admin', 'admin123', 'iloveyou', 'monkey', 'dragon',
  'football', 'baseball', 'sunshine', 'princess', 'login', 'passw0rd', 'master', 'shadow',
  'trustno1', 'superman', 'whatever', 'freedom', 'hello123', 'changeme', 'secret',
  'zaq12wsx', '1q2w3e4r', '1qaz2wsx', 'qazwsx', 'starwars', 'hunter2',
]);

const COMMON_WORDS = [
  'password', 'passwd', 'admin', 'welcome', 'letmein', 'qwerty', 'iloveyou', 'dragon',
  'monkey', 'football', 'baseball', 'sunshine', 'princess', 'login', 'master', 'shadow',
  'secret', 'freedom', 'superman', 'changeme', 'hello',
  'summer', 'winter', 'spring', 'autumn', 'january', 'february', 'april', 'august', 'october', 'november', 'december',
];

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

const LEET_MAP: Record<string, string> = {
  '@': 'a', '4': 'a', '3': 'e', '0': 'o', '$': 's', '5': 's', '7': 't', '!': 'i', '+': 't',
};

function normalizeLeet(input: string, oneAs: 'i' | 'l'): string {
  let out = '';
  for (const ch of input) {
    if (ch === '1') out += oneAs;
    else out += LEET_MAP[ch] ?? ch;
  }
  return out;
}

function longestSequentialRun(s: string): number {
  if (s.length === 0) return 0;
  let best = 1;
  let up = 1;
  let down = 1;
  for (let i = 1; i < s.length; i++) {
    const d = s.charCodeAt(i) - s.charCodeAt(i - 1);
    up = d === 1 ? up + 1 : 1;
    down = d === -1 ? down + 1 : 1;
    best = Math.max(best, up, down);
  }
  return best;
}

function hasKeyboardWalk(lower: string, minLen = 4): boolean {
  for (const row of KEYBOARD_ROWS) {
    const reversed = [...row].reverse().join('');
    for (const r of [row, reversed]) {
      for (let i = 0; i + minLen <= r.length; i++) {
        if (lower.includes(r.slice(i, i + minLen))) return true;
      }
    }
  }
  return false;
}

function labelFor(score: number): StrengthLabel {
  if (score < 20) return 'Very weak';
  if (score < 40) return 'Weak';
  if (score < 60) return 'Fair';
  if (score < 80) return 'Strong';
  return 'Very strong';
}

export function analyzePassword(password: string): PasswordAnalysis {
  const length = [...password].length;
  const lower = password.toLowerCase();

  const charClasses = {
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const classCount = Object.values(charClasses).filter(Boolean).length;

  const poolSize =
    (charClasses.lower ? 26 : 0) +
    (charClasses.upper ? 26 : 0) +
    (charClasses.digit ? 10 : 0) +
    (charClasses.symbol ? 33 : 0);
  const rawBits = poolSize > 0 ? length * Math.log2(poolSize) : 0;

  const findings: Finding[] = [];
  const recommendations = new Set<string>();
  let penaltyBits = 0;
  let scoreCap = 100;

  // --- Length ---
  if (length < 8) {
    findings.push({
      id: 'too-short',
      title: 'Very short password',
      detail: `Only ${length} character${length === 1 ? '' : 's'}. Short passwords can be guessed quickly.`,
      severity: 'high',
    });
    scoreCap = Math.min(scoreCap, 25);
  } else if (length < 12) {
    findings.push({
      id: 'short',
      title: 'Shorter than 12 characters',
      detail: 'Length is the biggest factor in resisting guessing attacks.',
      severity: 'medium',
    });
    scoreCap = Math.min(scoreCap, 59);
  }
  if (length < 14) {
    recommendations.add(
      'Make it longer: aim for 14 or more characters. A passphrase of four or more unrelated words is easier to remember and harder to guess.',
    );
  }

  // --- Common password / words ---
  const leetI = normalizeLeet(lower, 'i');
  const leetL = normalizeLeet(lower, 'l');
  if (COMMON_PASSWORDS.has(lower)) {
    findings.push({
      id: 'common-exact',
      title: 'Matches a very common password',
      detail: 'This exact password is on the small built-in list of widely used passwords.',
      severity: 'high',
    });
    penaltyBits += 60;
    scoreCap = Math.min(scoreCap, 3);
  } else if (COMMON_PASSWORDS.has(leetI) || COMMON_PASSWORDS.has(leetL)) {
    findings.push({
      id: 'common-leet',
      title: 'Common password with simple substitutions',
      detail: 'Swapping letters for look-alike symbols (like @ for a) is well known to attackers.',
      severity: 'high',
    });
    penaltyBits += 40;
    scoreCap = Math.min(scoreCap, 15);
  } else {
    const hit = COMMON_WORDS.find(
      (w) => lower.includes(w) || leetI.includes(w) || leetL.includes(w),
    );
    if (hit) {
      findings.push({
        id: 'common-word',
        title: 'Contains a very common word',
        detail: 'Passwords built around popular words are guessed early by cracking tools.',
        severity: 'medium',
      });
      penaltyBits += 20;
      scoreCap = Math.min(scoreCap, 45);
    }
  }
  if (findings.some((f) => f.id.startsWith('common'))) {
    recommendations.add(
      'Avoid common words and predictable substitutions such as @ for a or 0 for o.',
    );
  }

  // --- Sequences, keyboard walks, repeats ---
  const run = longestSequentialRun(lower);
  if (run >= 4) {
    findings.push({
      id: 'sequence',
      title: 'Sequential characters',
      detail: 'Runs like "abcd" or "4321" are among the first patterns tried.',
      severity: 'medium',
    });
    penaltyBits += 10;
  }
  if (hasKeyboardWalk(lower)) {
    findings.push({
      id: 'keyboard-walk',
      title: 'Keyboard pattern',
      detail: 'Neighboring keys such as "qwer" or "asdf" are a common habit.',
      severity: 'medium',
    });
    penaltyBits += 12;
  }
  if (/(.)\1{2,}/.test(password) || /^(.{1,4})\1+$/.test(password)) {
    findings.push({
      id: 'repeats',
      title: 'Repeated characters or blocks',
      detail: 'Repetition adds length without adding real unpredictability.',
      severity: 'medium',
    });
    penaltyBits += 8;
  }
  if (findings.some((f) => ['sequence', 'keyboard-walk', 'repeats'].includes(f.id))) {
    recommendations.add(
      'Avoid sequences, keyboard patterns and repeated characters. Random or unrelated words work better.',
    );
  }

  // --- Years and predictable structure ---
  if (/(?:19|20)\d{2}/.test(password)) {
    findings.push({
      id: 'year',
      title: 'Looks like it contains a year',
      detail: 'Birth years and recent years are easy for attackers to try.',
      severity: 'low',
    });
    penaltyBits += 6;
  }
  if (/^[A-Za-z]+[0-9]{1,4}[^A-Za-z0-9]?$/.test(password)) {
    findings.push({
      id: 'structure',
      title: 'Predictable "word + digits" structure',
      detail: 'A word followed by a few digits (and maybe one symbol) is a very common shape.',
      severity: 'medium',
    });
    penaltyBits += 10;
  }
  if (findings.some((f) => ['year', 'structure'].includes(f.id))) {
    recommendations.add(
      'Avoid birthdays, years and the "Word + number" shape. Do not use personal details.',
    );
  }

  // --- Character variety ---
  if (classCount === 1 && length > 0) {
    const kind = charClasses.digit
      ? 'digits'
      : charClasses.lower
        ? 'lowercase letters'
        : charClasses.upper
          ? 'uppercase letters'
          : 'symbols';
    findings.push({
      id: 'single-class',
      title: 'Only one kind of character',
      detail: `This password uses only ${kind}, which makes the search space much smaller.`,
      severity: 'medium',
    });
  }

  // --- Score ---
  const effectiveBits = Math.max(0, rawBits - penaltyBits);
  const rawScore = Math.min(100, Math.round((effectiveBits / 80) * 100));
  const score = Math.max(0, Math.min(rawScore, scoreCap));

  // Always-useful advice, regardless of the score.
  recommendations.add('Use a different password for every account.');
  recommendations.add('Store passwords in a reputable password manager.');
  recommendations.add('Turn on multi-factor authentication or passkeys wherever they are offered.');

  return {
    score,
    label: labelFor(score),
    length,
    entropyBits: Math.round(effectiveBits),
    charClasses,
    findings,
    recommendations: [...recommendations],
    analyzedAt: new Date().toISOString(),
  };
}
