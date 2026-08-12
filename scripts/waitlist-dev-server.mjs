/**
 * Local stand-in for api/waitlist.js.
 *
 * Imports the same validation core the production function uses, so the rules
 * the test suite exercises are literally the production rules. The only
 * difference is storage: SQLite here, Supabase there. SQLite enforces the same
 * UNIQUE constraint, so duplicate detection is a real database refusal rather
 * than an application-level guess.
 *
 * Development and verification only. Never deployed.
 *
 *   WAITLIST_DEV_DEBUG=1 node scripts/waitlist-dev-server.mjs
 */

import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { CORS, MESSAGES, createThrottle, parseSignup } from '../api/_core.js'
import { emailConfigured, sendConfirmation } from '../api/_email.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dbPath = resolve(root, '.local/waitlist.db')
mkdirSync(dirname(dbPath), { recursive: true })

const db = new DatabaseSync(dbPath)
db.exec(`
  create table if not exists waitlist (
    id          text primary key,
    email       text not null collate nocase unique,
    first_name  text,
    created_at  text not null default (datetime('now')),
    source      text not null default 'website',
    status      text not null default 'waitlist'
  );
`)

const PORT = Number(process.env.WAITLIST_DEV_PORT ?? 5181)
const DEBUG = process.env.WAITLIST_DEV_DEBUG === '1'
const throttled = createThrottle({ limit: Number(process.env.WAITLIST_RATE_LIMIT ?? 8) })

function send(res, status, body) {
  res.writeHead(status, { ...CORS, 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((done, fail) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 8192) fail(new Error('too large'))
    })
    req.on('end', () => done(raw))
    req.on('error', fail)
  })
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { ...CORS, 'Access-Control-Allow-Headers': 'content-type, x-force-error' })
    res.end()
    return
  }

  if (DEBUG && url.pathname === '/api/waitlist/_rows') {
    if (req.method === 'GET') {
      const rows = db.prepare('select * from waitlist order by created_at desc').all()
      send(res, 200, { count: rows.length, rows })
      return
    }
    if (req.method === 'DELETE') {
      db.exec('delete from waitlist')
      send(res, 200, { status: 'cleared' })
      return
    }
  }

  if (url.pathname !== '/api/waitlist') {
    send(res, 404, { error: 'Not found.' })
    return
  }

  // Mirrors the health check in api/waitlist.js so the shape can be tested.
  if (req.method === 'GET') {
    send(res, 200, {
      ok: true,
      supabase_url_set: false,
      supabase_service_key_set: false,
      email_configured: emailConfigured(),
      table_reachable: true,
      note: 'Local stand-in server: signups go to SQLite, not Supabase.',
    })
    return
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed.' })
    return
  }

  // Lets the verification run exercise the 500 branch without breaking anything.
  if (DEBUG && req.headers['x-force-error'] === '500') {
    send(res, 500, { error: MESSAGES.server })
    return
  }

  if (throttled(req.socket.remoteAddress ?? 'unknown')) {
    send(res, 429, { error: MESSAGES.throttled })
    return
  }

  let payload
  try {
    payload = JSON.parse(await readBody(req))
  } catch {
    send(res, 400, { error: MESSAGES.badJson })
    return
  }

  const parsed = parseSignup(payload)
  if (!parsed.ok) {
    send(res, parsed.status, { error: parsed.error })
    return
  }

  const { email, firstName, source, status } = parsed.value

  try {
    db.prepare(
      'insert into waitlist (id, email, first_name, source, status) values (?, ?, ?, ?, ?)',
    ).run(randomUUID(), email, firstName, source, status)
  } catch (error) {
    if (String(error?.message ?? '').includes('UNIQUE constraint failed')) {
      send(res, 409, { status: 'duplicate' })
      return
    }
    console.error('insert failed:', error)
    send(res, 500, { error: MESSAGES.server })
    return
  }

  const delivery = await sendConfirmation({ email, firstName })
  if (!delivery.sent && delivery.reason !== 'not configured') {
    console.error('confirmation email not sent:', delivery.reason)
  }

  send(res, 200, { status: 'created' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`waitlist dev server on http://127.0.0.1:${PORT}/api/waitlist`)
  console.log(`store: ${dbPath}${DEBUG ? '  (debug endpoints on)' : ''}`)
  console.log(`email: ${emailConfigured() ? 'EmailJS configured, will send' : 'not configured, skipping'}`)
})
