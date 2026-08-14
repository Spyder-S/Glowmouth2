/**
 * Exercises api/waitlist.js directly, the file Vercel actually runs.
 *
 * Covers the paths that only appear in production: missing configuration, and
 * the mapping from a Supabase failure to an actionable diagnosis. No Supabase
 * project is required.
 *
 *   node scripts/verify-function.mjs
 */

import handler, { diagnose } from '../api/waitlist.js'

let passed = 0
let failed = 0

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1
    console.log(`  pass  ${name}`)
  } else {
    failed += 1
    console.log(`  FAIL  ${name}${detail ? `  -> ${detail}` : ''}`)
  }
}

/** Minimal stand-in for Vercel's response object. */
function makeRes() {
  const res = {
    statusCode: 0,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key] = value
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
    end() {
      return this
    },
  }
  return res
}

async function call(req) {
  const res = makeRes()
  await handler({ headers: {}, socket: {}, ...req }, res)
  return res
}

console.log('\nproduction function\n')

// Ensure a clean slate: these tests are about configuration being absent.
delete process.env.SUPABASE_URL
delete process.env.VITE_SUPABASE_URL
delete process.env.SUPABASE_SERVICE_ROLE_KEY

// ── health check ────────────────────────────────────────────────────────────
{
  const res = await call({ method: 'GET' })
  check('health check answers', res.statusCode === 200, String(res.statusCode))
  check('health check reports not ok when unconfigured', res.body?.ok === false, JSON.stringify(res.body))
  check('health check flags the missing url', res.body?.supabase_url_set === false)
  check('health check flags the missing service key', res.body?.supabase_service_key_set === false)
  check(
    'health check says how to fix it',
    typeof res.body?.fix === 'string' && res.body.fix.includes('redeploy'),
    res.body?.fix,
  )
  // Naming the variable to set is the point. Printing its value would not be.
  check(
    'health check exposes no secret values',
    !JSON.stringify(res.body).match(/eyJ[A-Za-z0-9_-]{10,}|[A-Za-z0-9_-]{40,}/),
    JSON.stringify(res.body),
  )
  check(
    'health check reveals no signups',
    !JSON.stringify(res.body).match(/@|count|rows/i),
    JSON.stringify(res.body),
  )
}

// ── the failure the user actually hit ───────────────────────────────────────
{
  const res = await call({ method: 'POST', body: { email: 'someone@example.com' } })
  check('unconfigured signup returns 500', res.statusCode === 500, String(res.statusCode))
  check(
    'visitor still sees the plain message',
    res.body?.error === 'Something went wrong on our end. Please try again in a moment.',
    JSON.stringify(res.body),
  )
  check('response carries a debugging code', res.body?.code === 'not_configured', JSON.stringify(res.body))
}

// ── naming the missing EmailJS variables ────────────────────────────────────
{
  const res = await call({ method: 'GET' })
  check('all four EmailJS variables are reported missing', res.body?.email_missing?.length === 4, JSON.stringify(res.body?.email_missing))
  check(
    'the note says signups still work',
    res.body?.email_note?.includes('Signups are saved'),
    res.body?.email_note,
  )
}

{
  // The state a half-finished setup lands in: three of four filled.
  process.env.EMAILJS_SERVICE_ID = 'service_test'
  process.env.EMAILJS_TEMPLATE_ID = 'template_test'
  process.env.EMAILJS_PUBLIC_KEY = 'public_test'

  const res = await call({ method: 'GET' })
  check(
    'a partial setup names only what is left',
    JSON.stringify(res.body?.email_missing) === JSON.stringify(['EMAILJS_PRIVATE_KEY']),
    JSON.stringify(res.body?.email_missing),
  )
  check(
    'a partial setup says all four are needed',
    res.body?.email_note?.includes('all four'),
    res.body?.email_note,
  )
  check('a partial setup is still not configured', res.body?.email_configured === false)
  check(
    'no EmailJS values are echoed back',
    !JSON.stringify(res.body).includes('service_test') && !JSON.stringify(res.body).includes('public_test'),
    JSON.stringify(res.body),
  )

  process.env.EMAILJS_PRIVATE_KEY = 'private_test'
  const done = await call({ method: 'GET' })
  check('a complete setup reports configured', done.body?.email_configured === true)
  check('a complete setup lists nothing missing', done.body?.email_missing === undefined)

  for (const key of ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY', 'EMAILJS_PRIVATE_KEY']) {
    delete process.env[key]
  }
}

// ── telling "never added" apart from "typed wrong" ──────────────────────────
{
  const res = await call({ method: 'GET' })
  check(
    'a truly absent variable says so, and points at redeploy',
    res.body?.email_note?.includes('needs a redeploy'),
    res.body?.email_note,
  )
  check('no false near-match is reported', res.body?.email_misnamed === undefined)
}

{
  process.env.EMAILJS_SERVICE_ID = 'service_test'
  process.env.EMAILJS_TEMPLATE_ID = 'template_test'
  process.env.EMAILJS_PUBLIC_KEY = 'public_test'

  // The mistakes people actually make in a dashboard.
  const typos = [
    ['EMAIL_JS_PRIVATE_KEY', 'is spelled differently'],
    ['VITE_EMAILJS_PRIVATE_KEY', 'has an extra prefix'],
    ['emailjs_private_key', 'is spelled differently'],
    ['EMAILJS_PRIVATE_KEY ', 'has leading or trailing whitespace'],
  ]

  for (const [typo, reason] of typos) {
    process.env[typo] = 'value_that_must_not_leak'
    const res = await call({ method: 'GET' })
    check(
      `catches ${JSON.stringify(typo)}`,
      res.body?.email_misnamed?.[0]?.includes(typo.trim()) &&
        res.body.email_misnamed[0].includes(reason),
      JSON.stringify(res.body?.email_misnamed),
    )
    check(
      `does not leak the value of ${JSON.stringify(typo)}`,
      !JSON.stringify(res.body).includes('value_that_must_not_leak'),
    )
    delete process.env[typo]
  }

  // Set, but blank: shows as filled in the dashboard and behaves as absent.
  process.env.EMAILJS_PRIVATE_KEY = '   '
  const blank = await call({ method: 'GET' })
  check(
    'catches a variable that is set but empty',
    blank.body?.email_misnamed?.[0]?.includes('is set but empty'),
    JSON.stringify(blank.body?.email_misnamed),
  )
  delete process.env.EMAILJS_PRIVATE_KEY

  for (const key of ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY']) {
    delete process.env[key]
  }
}

{
  const res = await call({ method: 'GET' })
  check('health check reports which build answered', Boolean(res.body?.deployment?.commit), JSON.stringify(res.body?.deployment))
}

// ── validation still runs before any of that ────────────────────────────────
{
  const res = await call({ method: 'POST', body: { email: 'nonsense' } })
  check('a bad email is refused before touching the database', res.statusCode === 400, String(res.statusCode))
}

{
  const res = await call({ method: 'PUT' })
  check('unsupported methods are refused', res.statusCode === 405, String(res.statusCode))
}

{
  const res = await call({ method: 'OPTIONS' })
  check('preflight is answered', res.statusCode === 204, String(res.statusCode))
  check('preflight carries CORS headers', Boolean(res.headers['Access-Control-Allow-Origin']))
}

// ── a configured but unreachable database ───────────────────────────────────
// If the function throws instead of returning, Vercel emits its own 500 with no
// JSON body, and the visitor sees exactly the generic message. So the failure
// path has to be proven to return rather than crash.
{
  process.env.SUPABASE_URL = 'https://nonexistent-project-selftest.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'not-a-real-key'

  const res = await call({ method: 'POST', body: { email: 'unreachable@example.com' } })
  check('an unreachable database returns rather than throws', res.statusCode === 500, String(res.statusCode))
  check('and still carries a JSON body', typeof res.body?.error === 'string', JSON.stringify(res.body))
  check('and carries a diagnosis code', typeof res.body?.code === 'string', JSON.stringify(res.body))

  const health = await call({ method: 'GET' })
  check('health check survives an unreachable database', health.statusCode === 200, String(health.statusCode))
  check('health check reports it is not ok', health.body?.ok === false)

  const probed = await call({ method: 'GET', url: '/api/waitlist?probe=1' })
  check('probe survives an unreachable database', probed.statusCode === 200, String(probed.statusCode))
  check('probe reports the insert failed', probed.body?.insert_ok === false, JSON.stringify(probed.body))
  check('probe names a cause', typeof probed.body?.code === 'string', JSON.stringify(probed.body))

  delete process.env.SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
}

// ── the diagnosis table ─────────────────────────────────────────────────────
console.log('\ndiagnosis of database failures\n')

const cases = [
  [{ code: '42P01', message: 'relation "waitlist" does not exist' }, 'table_missing', 'migration not run'],
  [{ code: 'PGRST205', message: "Could not find the table 'public.waitlist'" }, 'table_missing', 'schema cache'],
  [{ code: '42501', message: 'permission denied for table waitlist' }, 'permission_denied', 'anon key used'],
  [{ message: 'Invalid API key' }, 'bad_key', 'wrong key'],
  [{ message: 'fetch failed' }, 'unreachable', 'bad url'],
  [{ code: '23502', message: 'null value in column' }, 'db_error', 'anything else'],
]

for (const [error, expected, why] of cases) {
  const result = diagnose(error)
  check(`${why} -> ${expected}`, result.code === expected, result.code)
  check(`${expected} comes with a fix`, result.fix.length > 20)
}

console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed === 0 ? 0 : 1)
