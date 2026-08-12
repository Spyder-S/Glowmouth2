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
