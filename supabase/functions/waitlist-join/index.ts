/**
 * POST /functions/v1/waitlist-join
 *
 * The only write path to public.waitlist. Validation, duplicate detection and
 * (later) confirmation email all live here rather than in the browser, so the
 * schema stays off the wire and the rules cannot be skipped by editing a request.
 *
 * Request:  { email: string, first_name?: string | null, source?: string }
 * Response: 200 { status: "created" }
 *           409 { status: "duplicate" }
 *           400 { error: string }
 *           429 { error: string }
 *           500 { error: string }
 */

import { createClient } from 'npm:@supabase/supabase-js@2.45.4'

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*'
const ALLOWED_SOURCES = new Set(['website', 'referral', 'event'])

// Mirrors the client-side check in src/lib/waitlist.ts. Deliberately duplicated:
// the client copy is for fast feedback, this one is the rule.
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

const EMAIL_PATTERN = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
}

function reply(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

/**
 * Best-effort per-IP throttle. Edge instances are ephemeral and there may be
 * several of them, so treat this as friction rather than a guarantee. Move to a
 * shared store if abuse ever becomes real.
 */
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 8
const hits = new Map<string, number[]>()

function throttled(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  if (hits.size > 5000) hits.clear()
  return recent.length > RATE_LIMIT
}

/**
 * Confirmation email. Intentionally a no-op until a provider key is present, so
 * the database write is never blocked on email delivery. Drop in Resend (or any
 * other provider) here and the rest of the flow is unchanged.
 */
async function sendConfirmation(email: string, firstName: string | null): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('WAITLIST_FROM_EMAIL')
  if (!apiKey || !from) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "You're on the GlowMouth waitlist",
      text: [
        firstName ? `${firstName},` : 'Hello,',
        '',
        "You're on the list. We'll let you know as GlowMouth gets closer to launch.",
        '',
        'GlowMouth is under development and is not intended to diagnose, treat, cure,',
        'or prevent disease or replace professional dental care.',
      ].join('\n'),
    }),
  })
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }

  if (request.method !== 'POST') {
    return reply({ error: 'Method not allowed.' }, 405)
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('cf-connecting-ip') ??
    'unknown'

  if (throttled(ip)) {
    return reply({ error: 'Too many attempts. Please wait a moment and try again.' }, 429)
  }

  let payload: { email?: unknown; first_name?: unknown; source?: unknown }
  try {
    payload = await request.json()
  } catch {
    return reply({ error: 'Expected a JSON body.' }, 400)
  }

  if (typeof payload.email !== 'string') {
    return reply({ error: 'Enter your email to join the waitlist.' }, 400)
  }

  const email = payload.email.trim().toLowerCase()

  if (email.length === 0) {
    return reply({ error: 'Enter your email to join the waitlist.' }, 400)
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return reply({ error: 'That email address does not look right. Check it and try again.' }, 400)
  }

  // Optional, and never trusted: trimmed, length-capped, control characters removed.
  let firstName: string | null = null
  if (typeof payload.first_name === 'string') {
    const cleaned = payload.first_name.replace(CONTROL_CHARS, '').trim().slice(0, 80)
    firstName = cleaned.length > 0 ? cleaned : null
  }

  const source =
    typeof payload.source === 'string' && ALLOWED_SOURCES.has(payload.source)
      ? payload.source
      : 'website'

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceKey) {
    console.error('waitlist-join: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return reply({ error: 'Something went wrong on our end. Please try again in a moment.' }, 500)
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error } = await supabase
    .from('waitlist')
    .insert({ email, first_name: firstName, source, status: 'waitlist' })

  if (error) {
    // 23505 = unique_violation. Already on the list is a normal outcome, not a fault.
    if (error.code === '23505') {
      return reply({ status: 'duplicate' }, 409)
    }
    // 23514 = check_violation, i.e. the payload got past the shape checks above.
    if (error.code === '23514') {
      return reply({ error: 'That email address does not look right. Check it and try again.' }, 400)
    }

    console.error('waitlist-join insert failed:', error.code, error.message)
    return reply({ error: 'Something went wrong on our end. Please try again in a moment.' }, 500)
  }

  // Delivery problems must never turn a successful signup into an error.
  try {
    await sendConfirmation(email, firstName)
  } catch (cause) {
    console.error('waitlist-join: confirmation email failed', cause)
  }

  return reply({ status: 'created' }, 200)
})
