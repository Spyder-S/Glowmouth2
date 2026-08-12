/**
 * End-to-end verification.
 *
 *   node scripts/waitlist-dev-server.mjs   (with WAITLIST_DEV_DEBUG=1)
 *   npm run dev
 *   node scripts/verify.mjs
 *
 * Covers the ten waitlist cases, responsive behaviour, console health and
 * horizontal overflow, and writes screenshots to .screenshots/.
 */

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const SITE = process.env.SITE ?? 'http://localhost:5180'
const API = 'http://127.0.0.1:5181/api/waitlist'
const SHOTS = '.screenshots'
mkdirSync(SHOTS, { recursive: true })

let passed = 0
let failed = 0
const failures = []

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1
    console.log(`  pass  ${name}`)
  } else {
    failed += 1
    failures.push(name)
    console.log(`  FAIL  ${name}${detail ? `  -> ${detail}` : ''}`)
  }
}

async function dbRows() {
  const response = await fetch(`${API}/_rows`)
  return response.json()
}

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})

/** Fresh page with console/error capture attached. */
async function openPage(viewport, options = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, ...options })
  const page = await context.newPage()
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  return { context, page, errors }
}

/** Screenshots are evidence, not assertions: never let one fail the run. */
async function shoot(page, name, options = {}) {
  try {
    await page.screenshot({ path: `${SHOTS}/${name}.png`, ...options })
  } catch (error) {
    console.log(`  note  screenshot ${name} skipped: ${String(error.message).slice(0, 70)}`)
  }
}

/** The page is far taller than Chromium will capture in one pass. */
async function shootSections(page, prefix, marks) {
  for (const [name, selector] of Object.entries(marks)) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (el) el.scrollIntoView({ block: 'start' })
    }, selector)
    await page.waitForTimeout(900)
    await shoot(page, `${prefix}-${name}`)
  }
}

async function fillAndSubmit(page, email, firstName = '') {
  await page.fill('#waitlist-email', email)
  if (firstName) await page.fill('#waitlist-first-name', firstName)
  await page.click('button[type="submit"]')
}

async function gotoWaitlist(page) {
  await page.goto(SITE, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.getElementById('waitlist')?.scrollIntoView())
  await page.waitForSelector('#waitlist-email', { state: 'visible' })
  await page.waitForTimeout(400)
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\npage health\n')

{
  const { context, page, errors } = await openPage({ width: 1440, height: 900 })
  await page.goto(SITE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2200)

  const hero = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    const span = h1.querySelector('span')
    return {
      visibility: document.visibilityState,
      h1Text: h1.innerText.replace(/\n/g, ' | '),
      h1Opacity: getComputedStyle(span).opacity,
      h1Lines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).fontSize)),
      h1Count: document.querySelectorAll('h1').length,
      webgl: (() => {
        const c = document.createElement('canvas')
        return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
      })(),
    }
  })

  check('page renders in a visible tab', hero.visibility === 'visible', hero.visibility)
  check('hero entrance animation completes', Number(hero.h1Opacity) > 0.99, hero.h1Opacity)
  check('exactly one h1', hero.h1Count === 1, String(hero.h1Count))
  check(
    'hero headline sets on two lines',
    hero.h1Text === 'See what happens | between visits.',
    hero.h1Text,
  )
  check('WebGL available in this run', hero.webgl, 'falls back to the static device otherwise')

  // Scroll the whole page so every lazy scene, observer and canvas is exercised.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1200)

  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    offenders: [...document.querySelectorAll('*')]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 5)
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 40)}`),
  }))
  check(
    'no horizontal overflow at 1440',
    overflow.scrollW <= overflow.innerW,
    `${overflow.scrollW} > ${overflow.innerW}: ${overflow.offenders.join(', ')}`,
  )

  const realErrors = errors.filter((e) => !e.includes('favicon') && !e.includes('apple-touch-icon'))
  check('no console errors at 1440', realErrors.length === 0, realErrors.slice(0, 3).join(' | '))

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
  await shoot(page, 'desktop-hero')
  await shootSections(page, 'desktop', {
    between: '#between-heading',
    scale: 'main section:nth-of-type(2)',
    technology: '#technology-heading',
    thinking: '#thinking-heading',
    story: '#story-heading',
    prelaunch: '#prelaunch-heading',
    waitlist: '#waitlist',
    final: '#final-heading',
  })
  await context.close()
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nwaitlist, ten cases\n')

await fetch(`${API}/_rows`, { method: 'DELETE' })

// 4. Empty email
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await gotoWaitlist(page)

  let posted = 0
  page.on('request', (r) => {
    if (r.url().includes('/api/waitlist') && r.method() === 'POST') posted += 1
  })

  await page.click('button[type="submit"]')
  await page.waitForTimeout(500)

  const state = await page.evaluate(() => ({
    error: document.querySelector('#waitlist-error')?.textContent ?? null,
    invalid: document.querySelector('#waitlist-email')?.getAttribute('aria-invalid'),
    focused: document.activeElement?.id,
    described: document.querySelector('#waitlist-email')?.getAttribute('aria-describedby'),
  }))

  check('4. empty email is caught before any request', posted === 0, `${posted} requests sent`)
  check('4. empty email shows the prompt', state.error === 'Enter your email to join the waitlist.', String(state.error))
  check('4. field is marked invalid', state.invalid === 'true', String(state.invalid))
  check('4. field is described by the error', state.described === 'waitlist-error', String(state.described))
  check('4. focus returns to the email field', state.focused === 'waitlist-email', String(state.focused))

  await context.close()
}

// 2. Invalid email
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await gotoWaitlist(page)

  let posted = 0
  page.on('request', (r) => {
    if (r.url().includes('/api/waitlist') && r.method() === 'POST') posted += 1
  })

  await fillAndSubmit(page, 'not-an-email')
  await page.waitForTimeout(500)

  const error = await page.textContent('#waitlist-error').catch(() => null)
  check('2. invalid email never reaches the server', posted === 0, `${posted} requests sent`)
  check(
    '2. invalid email explains itself',
    error === 'That email address does not look right. Check it and try again.',
    String(error),
  )

  // Typing again clears the error rather than leaving it stale.
  await page.fill('#waitlist-email', 'nowvalid@example.com')
  await page.waitForTimeout(250)
  const cleared = await page.evaluate(
    () => document.querySelector('#waitlist-email').getAttribute('aria-invalid') !== 'true',
  )
  check('2. error clears as soon as the field is corrected', cleared)

  await context.close()
}

// 1 + 6. Valid email, and it reaches the database
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await gotoWaitlist(page)
  await fillAndSubmit(page, 'Verify.User@Example.COM ', '  Vansh  ')
  await page.waitForSelector('text=You\'re on the list.', { timeout: 5000 })

  const body = await page.textContent('#waitlist')
  check('1. valid email reaches the success state', body.includes("You're on the list."))
  check(
    '1. success copy matches the brief',
    body.includes("We'll let you know as GlowMouth gets closer to launch."),
  )

  const announced = await page.evaluate(
    () => document.querySelector('#waitlist [role="status"]')?.textContent ?? '',
  )
  check('1. outcome announced to assistive tech', announced.includes("You're on the list."), announced)

  const { rows } = await dbRows()
  const row = rows.find((r) => r.email === 'verify.user@example.com')
  check('6. record exists in the database', Boolean(row), `rows: ${rows.map((r) => r.email).join(', ')}`)
  check('6. email normalised to lowercase and trimmed', row?.email === 'verify.user@example.com', row?.email)
  check('6. first name trimmed', row?.first_name === 'Vansh', JSON.stringify(row?.first_name))

  await shoot(page, 'waitlist-success')
  await context.close()
}

// 3. Duplicate email
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await gotoWaitlist(page)
  await fillAndSubmit(page, 'verify.user@example.com')
  await page.waitForSelector("text=You're already with us.", { timeout: 5000 })

  const body = await page.textContent('#waitlist')
  check('3. duplicate reaches the duplicate state', body.includes("You're already with us."))
  check('3. duplicate copy matches the brief', body.includes('This email is already on the GlowMouth waitlist.'))
  check(
    '3. duplicate never shows a database error',
    !/constraint|23505|duplicate key|violat/i.test(body),
    body.slice(0, 120),
  )

  // The offer to try another address returns the form to a usable state.
  await page.click('text=Use a different email')
  // AnimatePresence mode="wait": the settled block exits before the form enters.
  const backToForm = await page
    .waitForSelector('#waitlist-email', { state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false)
  check('3. "use a different email" restores the form', backToForm)

  const { rows } = await dbRows()
  const dupes = rows.filter((r) => r.email === 'verify.user@example.com')
  check('3. duplicate did not create a second row', dupes.length === 1, `found ${dupes.length}`)

  await shoot(page, 'waitlist-duplicate')
  await context.close()
}

// 5. Loading state
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await page.route('**/api/waitlist', async (route) => {
    await new Promise((r) => setTimeout(r, 1200))
    await route.continue()
  })
  await gotoWaitlist(page)

  await page.fill('#waitlist-email', 'slow@example.com')
  await page.click('button[type="submit"]')
  await page.waitForTimeout(350)

  const during = await page.evaluate(() => {
    const button = document.querySelector('#waitlist button[type="submit"]')
    return { label: button?.textContent?.trim(), disabled: button?.disabled }
  })
  check('5. button shows progress while submitting', during.label === 'Joining…', String(during.label))
  check('5. button is disabled while submitting', during.disabled === true, String(during.disabled))

  await page.waitForSelector("text=You're on the list.", { timeout: 6000 })
  check('5. resolves to success after the delay', true)

  await context.close()
}

// 8. Double click / repeated submission
{
  const { context, page } = await openPage({ width: 1440, height: 900 })

  let posted = 0
  await page.route('**/api/waitlist', async (route) => {
    if (route.request().method() === 'POST') posted += 1
    await new Promise((r) => setTimeout(r, 700))
    await route.continue()
  })
  await gotoWaitlist(page)

  await page.fill('#waitlist-email', 'doubleclick@example.com')
  const button = page.locator('#waitlist button[type="submit"]')
  await button.click()
  await button.click({ force: true, timeout: 1500 }).catch(() => {})
  await button.click({ force: true, timeout: 1500 }).catch(() => {})

  await page.waitForSelector("text=You're on the list.", { timeout: 8000 })
  await page.waitForTimeout(400)

  check('8. three rapid clicks send exactly one request', posted === 1, `${posted} requests`)

  const { rows } = await dbRows()
  const written = rows.filter((r) => r.email === 'doubleclick@example.com')
  check('8. only one row written', written.length === 1, `found ${written.length}`)

  await context.close()
}

// 10. Keyboard submission
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await gotoWaitlist(page)

  await page.focus('#waitlist-email')
  await page.keyboard.type('keyboard@example.com')
  await page.keyboard.press('Enter')
  await page.waitForSelector("text=You're on the list.", { timeout: 5000 })
  check('10. Enter in the email field submits the form', true)

  const { rows } = await dbRows()
  check('10. keyboard submission persisted', rows.some((r) => r.email === 'keyboard@example.com'))

  await context.close()
}

// 7. Server error state
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await page.route('**/api/waitlist', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Something went wrong on our end. Please try again in a moment.' }),
    }),
  )
  await gotoWaitlist(page)
  await fillAndSubmit(page, 'servererror@example.com')
  await page.waitForSelector('#waitlist-error', { state: 'visible', timeout: 5000 }).catch(() => {})

  const state = await page.evaluate(() => ({
    error: document.querySelector('#waitlist-error')?.textContent ?? null,
    formStillThere: Boolean(document.querySelector('#waitlist-email')),
    buttonEnabled: !document.querySelector('#waitlist button[type="submit"]')?.disabled,
    claimsSuccess: document.querySelector('#waitlist').textContent.includes("You're on the list."),
  }))

  check(
    '7. server error is shown plainly',
    state.error === 'Something went wrong on our end. Please try again in a moment.',
    String(state.error),
  )
  check('7. never fakes success on a server error', state.claimsSuccess === false)
  check('7. the form stays available to retry', state.formStillThere && state.buttonEnabled)

  await shoot(page, 'waitlist-error')
  await context.close()
}

// Network failure, the other half of case 7.
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await page.route('**/api/waitlist', (route) => route.abort('failed'))
  await gotoWaitlist(page)
  await fillAndSubmit(page, 'offline@example.com')
  await page.waitForTimeout(700)

  const error = await page.textContent('#waitlist-error').catch(() => null)
  check('7b. a dropped connection says so', error === 'No connection. Check your network and try again.', String(error))

  await context.close()
}

// 9. Mobile form
{
  const { context, page, errors } = await openPage(
    { width: 390, height: 844 },
    { isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  )
  await page.goto(SITE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 80))
    }
  })
  await page.waitForTimeout(900)

  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    offenders: [...document.querySelectorAll('*')]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 5)
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 40)}`),
  }))
  check(
    '9. no horizontal overflow at 390',
    overflow.scrollW <= overflow.innerW,
    `${overflow.scrollW} > ${overflow.innerW}: ${overflow.offenders.join(', ')}`,
  )

  await page.evaluate(() => document.getElementById('waitlist')?.scrollIntoView())
  await page.waitForTimeout(500)

  const targets = await page.evaluate(() => {
    const nodes = [
      ...document.querySelectorAll('#waitlist input, #waitlist button, header button, header a, footer a'),
    ]
    return nodes
      // Elements hidden at this breakpoint are not touch targets.
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
      })
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { tag: el.tagName, text: el.textContent?.trim().slice(0, 18), w: Math.round(r.width), h: Math.round(r.height) }
      })
  })
  const tooSmall = targets.filter((t) => t.h < 44)
  check('9. every touch target is at least 44px tall', tooSmall.length === 0, JSON.stringify(tooSmall))

  await page.fill('#waitlist-email', 'mobile@example.com')
  await page.click('#waitlist button[type="submit"]')
  await page.waitForSelector("text=You're on the list.", { timeout: 6000 })
  check('9. mobile form submits', true)

  const { rows } = await dbRows()
  check('9. mobile submission persisted', rows.some((r) => r.email === 'mobile@example.com'))

  const mobileErrors = errors.filter((e) => !e.includes('favicon') && !e.includes('apple-touch-icon'))
  check('9. no console errors at 390', mobileErrors.length === 0, mobileErrors.slice(0, 3).join(' | '))

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)
  await shoot(page, 'mobile-hero')
  await shoot(page, 'mobile-full')
  await context.close()
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\naccessibility and motion\n')

{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await page.goto(SITE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const structure = await page.evaluate(() => {
    const labelled = [...document.querySelectorAll('input')].every((input) =>
      Boolean(document.querySelector(`label[for="${input.id}"]`)),
    )
    const slider = document.querySelector('[role="slider"]')
    return {
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      labelled,
      lang: document.documentElement.lang,
      mainLandmark: Boolean(document.querySelector('main')),
      skipLink: document.querySelector('a[href="#main"]')?.textContent?.trim(),
      sliderRole: Boolean(slider),
      sliderTabbable: slider?.getAttribute('tabindex') === '0',
      sliderLabel: slider?.getAttribute('aria-label'),
      canvasesHidden: [...document.querySelectorAll('canvas')].every((c) =>
        Boolean(c.closest('[aria-hidden="true"]')) || c.getAttribute('aria-hidden') === 'true',
      ),
    }
  })

  check('one h1, several h2', structure.h1 === 1 && structure.h2 >= 5, `h1=${structure.h1} h2=${structure.h2}`)
  check('every input has a label', structure.labelled)
  check('document language declared', structure.lang === 'en', structure.lang)
  check('main landmark present', structure.mainLandmark)
  check('skip link present', structure.skipLink === 'Skip to content', String(structure.skipLink))
  check('imaging divider is a labelled slider', structure.sliderRole && structure.sliderLabel?.length > 10)
  check('imaging divider is keyboard reachable', structure.sliderTabbable)
  check('decorative canvases hidden from assistive tech', structure.canvasesHidden)

  // The divider must respond to the keyboard, not only to a drag.
  await page.evaluate(() => document.querySelector('[role="slider"]').scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(2200)
  const before = await page.getAttribute('[role="slider"]', 'aria-valuenow')
  await page.focus('[role="slider"]')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.waitForTimeout(250)
  const after = await page.getAttribute('[role="slider"]', 'aria-valuenow')
  check('arrow keys move the imaging divider', Number(after) === Number(before) - 8, `${before} -> ${after}`)

  await page.keyboard.press('Home')
  await page.waitForTimeout(200)
  const home = await page.getAttribute('[role="slider"]', 'aria-valuenow')
  check('Home jumps the divider to full fluorescence', Number(home) === 0, String(home))

  // The underline transitions over 300ms, so read it after it has settled.
  await page.focus('#waitlist-email')
  await page.waitForTimeout(600)
  const focusRing = await page.evaluate(() => {
    const style = getComputedStyle(document.querySelector('#waitlist-email'))
    return { outline: style.outlineWidth, border: style.borderBottomColor }
  })
  check('focused field is visibly indicated', focusRing.border.includes('101, 50, 212'), JSON.stringify(focusRing))

  await shoot(page, 'technology')
  await context.close()
}

{
  const { context, page } = await openPage({ width: 1440, height: 900 }, { reducedMotion: 'reduce' })
  await page.goto(SITE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)

  const reduced = await page.evaluate(() => {
    const span = document.querySelector('h1 span')
    return {
      prefers: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      opacity: getComputedStyle(span).opacity,
      transform: getComputedStyle(span).transform,
    }
  })
  check('reduced motion is detected', reduced.prefers)
  check('content is fully visible under reduced motion', Number(reduced.opacity) > 0.99, reduced.opacity)
  check(
    'no residual translation under reduced motion',
    reduced.transform === 'none' || reduced.transform === 'matrix(1, 0, 0, 1, 0, 0)',
    reduced.transform,
  )

  await context.close()
}

// WebGL off: the page must still be complete.
{
  const { context, page } = await openPage({ width: 1440, height: 900 })
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
      apply(target, self, args) {
        if (String(args[0]).startsWith('webgl')) return null
        return Reflect.apply(target, self, args)
      },
    })
  })
  await page.goto(SITE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)

  const withoutWebGL = await page.evaluate(() => ({
    headline: document.querySelector('h1')?.innerText.replace(/\n/g, ' | '),
    headlineVisible: Number(getComputedStyle(document.querySelector('h1 span')).opacity) > 0.99,
    stillImages: document.querySelectorAll('svg[role="img"]').length,
    formPresent: Boolean(document.querySelector('#waitlist-email')),
  }))

  check('WebGL failure keeps the headline', withoutWebGL.headline === 'See what happens | between visits.')
  check('WebGL failure keeps the headline visible', withoutWebGL.headlineVisible)
  check('WebGL failure falls back to the static device', withoutWebGL.stillImages >= 2, String(withoutWebGL.stillImages))
  check('WebGL failure keeps the waitlist usable', withoutWebGL.formPresent)

  await page.evaluate(() => document.getElementById('waitlist')?.scrollIntoView())
  await page.waitForTimeout(400)
  await page.fill('#waitlist-email', 'nowebgl@example.com')
  await page.click('#waitlist button[type="submit"]')
  await page.waitForSelector("text=You're on the list.", { timeout: 6000 })
  check('WebGL failure still lets someone join', true)

  await shoot(page, 'no-webgl')
  await context.close()
}

await browser.close()

const final = await dbRows()
console.log(`\n  database holds ${final.count} rows: ${final.rows.map((r) => r.email).join(', ')}`)
console.log(`\n${passed} passed, ${failed} failed`)
if (failures.length) console.log(`failing: ${failures.join(' | ')}`)
console.log('')

process.exit(failed === 0 ? 0 : 1)
