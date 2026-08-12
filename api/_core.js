/**
 * Waitlist rules, shared by every server that accepts a signup.
 *
 * api/waitlist.js (production, Vercel) and scripts/waitlist-dev-server.mjs
 * (local) both import this, so the validation the tests exercise locally is
 * literally the validation that runs in production. Only the datastore differs.
 *
 * Pure functions only: no I/O, no environment, no framework.
 */

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

/**
 * Deliberately pragmatic. It rejects the mistakes people actually make
 * (missing @, missing TLD, stray spaces) without bouncing valid odd addresses.
 */
export const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

export const ALLOWED_SOURCES = new Set(['website', 'referral', 'event'])

export const MESSAGES = {
  missing: 'Enter your email to join the waitlist.',
  malformed: 'That email address does not look right. Check it and try again.',
  badJson: 'Expected a JSON body.',
  throttled: 'Too many attempts. Please wait a moment and try again.',
  server: 'Something went wrong on our end. Please try again in a moment.',
}

export function normalizeEmail(raw) {
  return String(raw).trim().toLowerCase()
}

/**
 * Turns an untrusted request body into either a clean row or a refusal.
 * Returns { ok: true, value } or { ok: false, status, error }.
 */
export function parseSignup(payload) {
  if (payload === null || typeof payload !== 'object') {
    return { ok: false, status: 400, error: MESSAGES.badJson }
  }

  if (typeof payload.email !== 'string') {
    return { ok: false, status: 400, error: MESSAGES.missing }
  }

  const email = normalizeEmail(payload.email)

  if (email.length === 0) {
    return { ok: false, status: 400, error: MESSAGES.missing }
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, status: 400, error: MESSAGES.malformed }
  }

  // Optional, and never trusted: control characters stripped, trimmed, capped.
  let firstName = null
  if (typeof payload.first_name === 'string') {
    const cleaned = payload.first_name.replace(CONTROL_CHARS, '').trim().slice(0, 80)
    firstName = cleaned.length > 0 ? cleaned : null
  }

  const source =
    typeof payload.source === 'string' && ALLOWED_SOURCES.has(payload.source)
      ? payload.source
      : 'website'

  return { ok: true, value: { email, firstName, source, status: 'waitlist' } }
}

/**
 * Best-effort per-IP throttle. Serverless instances are ephemeral and there may
 * be several, so treat this as friction rather than a guarantee.
 */
export function createThrottle({ limit = 8, windowMs = 60_000 } = {}) {
  const hits = new Map()

  return function throttled(key) {
    const now = Date.now()
    const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs)
    recent.push(now)
    hits.set(key, recent)

    if (hits.size > 5000) hits.clear()
    return recent.length > limit
  }
}

export const CORS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN ?? '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
}
