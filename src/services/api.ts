
import type { BackendModule } from '../types';
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '');

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
    });

    return response.ok;
  } catch {
    return false;
  }
}
/**
 * SecureGuard AI frontend API service.
 *
 * Everything that talks to the network lives here, away from the UI.
 *
 * SECURITY RULES for this file:
 *  - The raw password is hashed locally and never sent anywhere.
 *  - Only the FIRST 5 characters of the SHA-1 hash leave the browser (k-anonymity).
 *  - The password and hash are never logged, stored, or placed in error messages.
 *  - No analytics, no browser storage.
 */

const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range/';

export type ApiErrorCode = 'unsupported' | 'network' | 'rate-limited' | 'server' | 'aborted';

export class ApiError extends Error {
  code: ApiErrorCode;
  /** Safe, human-readable message that is shown in the UI. Never contains secrets. */
  userMessage: string;

  constructor(code: ApiErrorCode, userMessage: string) {
    super(code); // Only the code goes into Error.message.
    this.name = 'ApiError';
    this.code = code;
    this.userMessage = userMessage;
  }
}

/** SHA-1 of the text as an uppercase hex string, using the browser's built-in crypto. */
export async function sha1Hex(text: string): Promise<string> {
  if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
    throw new ApiError(
      'unsupported',
      'This browser cannot compute hashes here. Use a current browser on localhost or https.',
    );
  }
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest('SHA-1', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

export interface PwnedResult {
  found: boolean;
  /** How many times the password appears in the dataset (0 when not found). */
  count: number;
  /** The 5-character hash prefix that was sent. Shown to the user for transparency. */
  prefix: string;
}

/**
 * Known compromised-password check using the Have I Been Pwned "Pwned Passwords"
 * range API with k-anonymity:
 *   1. SHA-1 hash the password locally.
 *   2. Send ONLY the first 5 hex characters to the range endpoint.
 *   3. Receive every hash suffix that shares that prefix.
 *   4. Compare the remaining 35 characters locally.
 *
 * This is called directly from the browser to the public HIBP range endpoint
 * (no SecureGuard backend is involved). It only detects KNOWN compromised passwords.
 */
export async function checkPwnedPassword(password: string, signal?: AbortSignal): Promise<PwnedResult> {
  const hash = await sha1Hex(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  let response: Response;
  try {
    response = await fetch(`${HIBP_RANGE_URL}${prefix}`, {
      method: 'GET',
      signal,
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
  } catch {
    if (signal?.aborted) {
      throw new ApiError('aborted', 'The check was cancelled.');
    }
    throw new ApiError(
      'network',
      'Could not reach the Pwned Passwords service. Check your internet connection and try again.',
    );
  }

  if (response.status === 429) {
    throw new ApiError('rate-limited', 'Too many requests. Wait a minute and try again.');
  }
  if (!response.ok) {
    throw new ApiError('server', 'The Pwned Passwords service returned an error. Try again later.');
  }

  const body = await response.text();
  for (const line of body.split(/\r?\n/)) {
    const [lineSuffix, rawCount] = line.split(':');
    if (!lineSuffix) continue;
    if (lineSuffix.trim().toUpperCase() === suffix) {
      const count = parseInt((rawCount ?? '0').trim(), 10);
      // Padded decoy entries have a count of 0 and must be ignored.
      if (count > 0) return { found: true, count, prefix };
    }
  }
  return { found: false, count: 0, prefix };
}

/**
 * Backend-dependent features. Every entry is NOT CONNECTED in Phase 1.
 * Do not set `connected: true` until the feature genuinely works end to end.
 */
export function getBackendModules(): BackendModule[] {
  return [
    {
      id: 'email-monitoring',
      name: 'Email & account breach monitoring',
      description: 'Check whether an email address appears in known data breaches. Requires a backend and a Have I Been Pwned API key.',
      connected: false,
    },
    {
      id: 'ai-explanations',
      name: 'AI-generated risk explanations',
      description: 'Natural-language explanations from an AI model. No model is trained or connected. Reports in Phase 1 are rule-based.',
      connected: false,
    },
    {
      id: 'alerts',
      name: 'Alerts & notifications',
      description: 'Notify you when new exposure is detected. Requires accounts, a backend and scheduled jobs.',
      connected: false,
    },
    {
      id: 'history',
      name: 'Scan history',
      description: 'Saved scan history across sessions. Nothing is stored in Phase 1; results disappear on reload.',
      connected: false,
    },
  ];
}
