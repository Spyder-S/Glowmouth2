/**
 * Contract tests for the waitlist server function.
 *
 * Runs against the local stand-in (scripts/waitlist-dev-server.mjs), which
 * implements the same contract as supabase/functions/waitlist-join. Point BASE
 * at the deployed function URL to run the same suite against production.
 *
 *   WAITLIST_DEV_DEBUG=1 WAITLIST_RATE_LIMIT=1000 node scripts/waitlist-dev-server.mjs
 *   node scripts/verify-api.mjs
 */

const BASE = process.env.WAITLIST_BASE ?? 'http://127.0.0.1:5181/api/waitlist'
const ROWS = `${BASE}/_rows`

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

async function post(body, headers = {}) {
  const response = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  let json = null
  try {
    json = await response.json()
  } catch {
    /* some responses legitimately have no body */
  }
  return { status: response.status, json }
}

async function rows() {
  const response = await fetch(ROWS)
  return response.json()
}

console.log('\nwaitlist server contract\n')

// Start from a known-empty table.
await fetch(ROWS, { method: 'DELETE' })

// ── rejection cases ─────────────────────────────────────────────────────────
{
  const r = await post({ email: '' })
  check('empty email is rejected', r.status === 400, `got ${r.status}`)
  check(
    'empty email message is the one the form shows',
    r.json?.error === 'Enter your email to join the waitlist.',
    JSON.stringify(r.json),
  )
}

{
  const r = await post({})
  check('missing email field is rejected', r.status === 400, `got ${r.status}`)
}

{
  const r = await post({ email: '   ' })
  check('whitespace-only email is rejected', r.status === 400, `got ${r.status}`)
}

for (const bad of [
  'notanemail',
  'missing@tld',
  '@nolocal.com',
  'two@@at.com',
  'spaces in@email.com',
  'trailing@dot.',
  'a@b.c',
]) {
  const r = await post({ email: bad })
  check(`invalid email rejected: ${bad}`, r.status === 400, `got ${r.status}`)
}

{
  const r = await post({ email: `${'a'.repeat(250)}@example.com` })
  check('over-length email is rejected', r.status === 400, `got ${r.status}`)
}

{
  const r = await post('{ not json')
  check('malformed JSON is rejected', r.status === 400, `got ${r.status}`)
}

{
  const response = await fetch(BASE, { method: 'GET' })
  const body = await response.json()
  check('GET returns a configuration report', response.status === 200, `got ${response.status}`)
  check(
    'health report names every dependency',
    ['ok', 'supabase_url_set', 'supabase_service_key_set', 'email_configured', 'table_reachable'].every(
      (key) => key in body,
    ),
    JSON.stringify(body),
  )
  check(
    'health report leaks no secrets or signups',
    !JSON.stringify(body).match(/eyJ|@|service_role/),
    JSON.stringify(body),
  )
}

{
  const response = await fetch(BASE, { method: 'PUT' })
  check('other methods are not allowed', response.status === 405, `got ${response.status}`)
}

// ── the happy path ──────────────────────────────────────────────────────────
{
  const r = await post({ email: 'vansh@example.com', first_name: 'Vansh', source: 'website' })
  check('valid email is accepted', r.status === 200, `got ${r.status}`)
  check('accepted response says created', r.json?.status === 'created', JSON.stringify(r.json))
}

{
  const state = await rows()
  const row = state.rows.find((entry) => entry.email === 'vansh@example.com')
  check('record persisted to the database', Boolean(row), `count=${state.count}`)
  check('first name stored', row?.first_name === 'Vansh', row?.first_name)
  check('source stored', row?.source === 'website', row?.source)
  check('status defaults to waitlist', row?.status === 'waitlist', row?.status)
  check('created_at populated', Boolean(row?.created_at), row?.created_at)
  check('id is a uuid', /^[0-9a-f-]{36}$/i.test(row?.id ?? ''), row?.id)
}

// ── duplicates ──────────────────────────────────────────────────────────────
{
  const r = await post({ email: 'vansh@example.com' })
  check('exact duplicate returns 409', r.status === 409, `got ${r.status}`)
  check('duplicate response says duplicate', r.json?.status === 'duplicate', JSON.stringify(r.json))
}

{
  const r = await post({ email: '  VANSH@Example.COM  ' })
  check('duplicate detected after trim and lowercase', r.status === 409, `got ${r.status}`)
  const state = await rows()
  const matches = state.rows.filter((entry) => entry.email.toLowerCase() === 'vansh@example.com')
  check('normalising did not create a second row', matches.length === 1, `found ${matches.length}`)
}

// ── input handling ──────────────────────────────────────────────────────────
{
  await post({ email: 'trimmed@example.com', first_name: '   Anhad   ' })
  const state = await rows()
  const row = state.rows.find((entry) => entry.email === 'trimmed@example.com')
  check('first name is trimmed', row?.first_name === 'Anhad', JSON.stringify(row?.first_name))
}

{
  await post({ email: 'blankname@example.com', first_name: '   ' })
  const state = await rows()
  const row = state.rows.find((entry) => entry.email === 'blankname@example.com')
  check('blank first name stored as null', row?.first_name === null, JSON.stringify(row?.first_name))
}

{
  await post({ email: 'longname@example.com', first_name: 'x'.repeat(200) })
  const state = await rows()
  const row = state.rows.find((entry) => entry.email === 'longname@example.com')
  check('first name capped at 80 characters', row?.first_name?.length === 80, String(row?.first_name?.length))
}

{
  await post({ email: 'badsource@example.com', source: 'https://evil.example/inject' })
  const state = await rows()
  const row = state.rows.find((entry) => entry.email === 'badsource@example.com')
  check('unknown source falls back to website', row?.source === 'website', row?.source)
}

// ── server failure ──────────────────────────────────────────────────────────
{
  const r = await post({ email: 'boom@example.com' }, { 'x-force-error': '500' })
  check('server error returns 500', r.status === 500, `got ${r.status}`)
  check(
    'server error message is not a database error',
    r.json?.error === 'Something went wrong on our end. Please try again in a moment.',
    JSON.stringify(r.json),
  )
  const state = await rows()
  check(
    'failed submission wrote nothing',
    !state.rows.some((entry) => entry.email === 'boom@example.com'),
    'row was written',
  )
}

// ── concurrent double submit ────────────────────────────────────────────────
{
  const [a, b] = await Promise.all([
    post({ email: 'race@example.com' }),
    post({ email: 'race@example.com' }),
  ])
  const codes = [a.status, b.status].sort()
  check('two simultaneous identical submits give 200 and 409', codes.join(',') === '200,409', codes.join(','))

  const state = await rows()
  const matches = state.rows.filter((entry) => entry.email === 'race@example.com')
  check('race produced exactly one row', matches.length === 1, `found ${matches.length}`)
}

const finalState = await rows()
console.log(`\n  ${finalState.count} rows in the database after the run`)
console.log(`\n${passed} passed, ${failed} failed\n`)

process.exit(failed === 0 ? 0 : 1)
