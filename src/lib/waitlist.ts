/**
 * Waitlist client.
 *
 * Posts to /api/waitlist and nothing else. In development Vite proxies that
 * path to scripts/waitlist-dev-server.mjs; in production Vercel routes it to
 * api/waitlist.js. Same path, same contract, both environments.
 *
 * No keys of any kind are shipped to the browser. Validation, duplicate
 * detection, rate limiting and email all happen on the server, where they
 * cannot be skipped by editing a request.
 */

export const WAITLIST_ENDPOINT =
  (import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined) ?? '/api/waitlist'

/**
 * Deliberately pragmatic, and a mirror of EMAIL_PATTERN in api/_core.js. This
 * copy exists for fast feedback in the field; the server copy is the rule.
 */
const EMAIL_PATTERN = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidEmail(raw: string): boolean {
  const email = normalizeEmail(raw)
  return email.length > 0 && email.length <= 254 && EMAIL_PATTERN.test(email)
}

export type WaitlistOutcome =
  | { kind: 'success' }
  | { kind: 'duplicate' }
  | { kind: 'error'; message: string }

type ServerPayload = {
  status?: 'created' | 'duplicate'
  error?: string
}

const GENERIC_ERROR = 'Something went wrong on our end. Please try again in a moment.'

export async function joinWaitlist(input: {
  email: string
  firstName?: string
  signal?: AbortSignal
}): Promise<WaitlistOutcome> {
  const email = normalizeEmail(input.email)
  const firstName = input.firstName?.trim() ?? ''

  let response: Response
  try {
    response = await fetch(WAITLIST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        first_name: firstName.length > 0 ? firstName : null,
        source: 'website',
      }),
      signal: input.signal,
    })
  } catch {
    return { kind: 'error', message: 'No connection. Check your network and try again.' }
  }

  let payload: ServerPayload = {}
  try {
    payload = (await response.json()) as ServerPayload
  } catch {
    // Fall through to status-code handling below.
  }

  if (response.status === 409 || payload.status === 'duplicate') {
    return { kind: 'duplicate' }
  }

  if (response.ok && payload.status === 'created') {
    return { kind: 'success' }
  }

  if (response.status === 400 && payload.error) {
    return { kind: 'error', message: payload.error }
  }

  if (response.status === 429) {
    return { kind: 'error', message: 'That is a lot of requests. Please wait a moment and retry.' }
  }

  return { kind: 'error', message: payload.error ?? GENERIC_ERROR }
}
