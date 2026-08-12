/**
 * POST /api/waitlist   (Vercel serverless function)
 *
 * The only write path to public.waitlist in production. Runs on the server, so
 * the Supabase service role key and the EmailJS private key stay in Vercel's
 * environment and never reach the browser.
 *
 * Response contract, matched exactly by the local dev server and by the client:
 *   200 { status: "created" }
 *   409 { status: "duplicate" }
 *   400 { error }   405 { error }   429 { error }   500 { error }
 */

import { createClient } from '@supabase/supabase-js'
import { CORS, MESSAGES, createThrottle, parseSignup } from './_core.js'
import { emailStatus, sendConfirmation } from './_email.js'

const throttled = createThrottle({ limit: 8, windowMs: 60_000 })

function send(res, status, body) {
  for (const [header, value] of Object.entries(CORS)) res.setHeader(header, value)
  res.setHeader('Content-Type', 'application/json')
  res.status(status).json(body)
}

/**
 * Maps a Supabase failure to something a maintainer can act on. Returns a
 * short code and a fix, never the underlying message, which can contain
 * connection details.
 */
export function diagnose(error) {
  const code = error?.code ?? ''
  const message = String(error?.message ?? '')

  if (code === '42P01' || code === 'PGRST205' || /could not find the table|relation .* does not exist/i.test(message)) {
    return {
      code: 'table_missing',
      fix: 'The waitlist table does not exist. Run supabase/migrations/20260812000000_waitlist.sql in the Supabase SQL editor.',
    }
  }
  if (code === '42501' || /permission denied/i.test(message)) {
    return {
      code: 'permission_denied',
      fix: 'The key used cannot write to the table. Confirm SUPABASE_SERVICE_ROLE_KEY is the service_role key, not the anon key.',
    }
  }
  if (/invalid api key|jwt|unauthorized/i.test(message)) {
    return {
      code: 'bad_key',
      fix: 'Supabase rejected the key. Re-copy SUPABASE_SERVICE_ROLE_KEY from Project Settings, API Keys.',
    }
  }
  if (/fetch failed|network|ENOTFOUND|getaddrinfo/i.test(message)) {
    return {
      code: 'unreachable',
      fix: 'Could not reach Supabase. Check SUPABASE_URL is the full https://<ref>.supabase.co origin.',
    }
  }
  return { code: 'db_error', fix: 'Check the function logs in Vercel for the underlying database error.' }
}

/**
 * GET /api/waitlist
 *
 * Configuration check. Reports whether each piece is wired up, and never
 * returns a key, a signup, or a row count. Safe to leave enabled: it tells an
 * operator what is broken and tells everyone else nothing useful.
 */
async function health(res) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const email = emailStatus()

  const report = {
    ok: false,
    supabase_url_set: Boolean(supabaseUrl),
    supabase_service_key_set: Boolean(serviceKey),
    email_configured: email.configured,
    table_reachable: false,
  }

  // Name the specific variables that are missing rather than one blanket false.
  if (!email.configured) {
    report.email_missing = email.missing
    report.email_note =
      email.missing.length === 4
        ? 'No EmailJS variables are set. Signups are saved; no confirmation email is sent.'
        : `Partially configured. EmailJS needs all four. Still missing: ${email.missing.join(', ')}.`
  }

  if (!supabaseUrl || !serviceKey) {
    report.fix =
      'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, tick Production/Preview/Development, then redeploy. Environment variables are only read at deploy time.'
    return send(res, 200, report)
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    // head:true asks for no rows at all, only whether the query is valid.
    const { error } = await supabase.from('waitlist').select('id', { head: true, count: 'exact' })

    if (error) {
      const detail = diagnose(error)
      report.code = detail.code
      report.fix = detail.fix
      return send(res, 200, report)
    }

    report.ok = true
    report.table_reachable = true
    return send(res, 200, report)
  } catch (cause) {
    const detail = diagnose(cause)
    report.code = detail.code
    report.fix = detail.fix
    return send(res, 200, report)
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    for (const [header, value] of Object.entries(CORS)) res.setHeader(header, value)
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    return health(res)
  }

  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed.' })
  }

  const ip =
    (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  if (throttled(ip)) {
    return send(res, 429, { error: MESSAGES.throttled })
  }

  // Vercel parses JSON bodies for us, but never assume it did.
  let payload = req.body
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return send(res, 400, { error: MESSAGES.badJson })
    }
  }

  const parsed = parseSignup(payload)
  if (!parsed.ok) {
    return send(res, parsed.status, { error: parsed.error })
  }

  const { email, firstName, source, status } = parsed.value

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error(
      'waitlist: not configured. SUPABASE_URL set:',
      Boolean(supabaseUrl),
      'SUPABASE_SERVICE_ROLE_KEY set:',
      Boolean(serviceKey),
      '- set both in Vercel and redeploy.',
    )
    return send(res, 500, { error: MESSAGES.server, code: 'not_configured' })
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error } = await supabase
    .from('waitlist')
    .insert({ email, first_name: firstName, source, status })

  if (error) {
    // 23505 = unique_violation. Already on the list is a normal outcome.
    if (error.code === '23505') {
      return send(res, 409, { status: 'duplicate' })
    }
    // 23514 = check_violation, i.e. something slipped past parseSignup.
    if (error.code === '23514') {
      return send(res, 400, { error: MESSAGES.malformed })
    }

    const detail = diagnose(error)
    console.error(`waitlist insert failed [${detail.code}] ${error.code}: ${error.message} - ${detail.fix}`)
    // The visitor sees the plain message; `code` is for whoever is debugging.
    return send(res, 500, { error: MESSAGES.server, code: detail.code })
  }

  // The signup is already saved. Email is a courtesy and can never undo it.
  const delivery = await sendConfirmation({ email, firstName })
  if (!delivery.sent && delivery.reason !== 'not configured') {
    console.error('waitlist: confirmation email not sent:', delivery.reason)
  }

  return send(res, 200, { status: 'created' })
}
