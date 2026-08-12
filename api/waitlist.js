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
import { sendConfirmation } from './_email.js'

const throttled = createThrottle({ limit: 8, windowMs: 60_000 })

function send(res, status, body) {
  for (const [header, value] of Object.entries(CORS)) res.setHeader(header, value)
  res.setHeader('Content-Type', 'application/json')
  res.status(status).json(body)
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    for (const [header, value] of Object.entries(CORS)) res.setHeader(header, value)
    return res.status(204).end()
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
    console.error('waitlist: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
    return send(res, 500, { error: MESSAGES.server })
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

    console.error('waitlist insert failed:', error.code, error.message)
    return send(res, 500, { error: MESSAGES.server })
  }

  // The signup is already saved. Email is a courtesy and can never undo it.
  const delivery = await sendConfirmation({ email, firstName })
  if (!delivery.sent && delivery.reason !== 'not configured') {
    console.error('waitlist: confirmation email not sent:', delivery.reason)
  }

  return send(res, 200, { status: 'created' })
}
