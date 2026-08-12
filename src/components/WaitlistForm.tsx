import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { isValidEmail, joinWaitlist } from '../lib/waitlist'
import { Reveal } from './Reveal'

type FormState = 'idle' | 'validating' | 'submitting' | 'success' | 'duplicate' | 'error'

const BUSY: FormState[] = ['validating', 'submitting']
const QUIET = [0.22, 0.61, 0.36, 1] as const

export function WaitlistForm() {
  const [state, setState] = useState<FormState>('idle')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [message, setMessage] = useState('')

  const inFlight = useRef(false)
  const emailField = useRef<HTMLInputElement>(null)
  const abort = useRef<AbortController | null>(null)

  useEffect(() => () => abort.current?.abort(), [])

  const busy = BUSY.includes(state)
  const settled = state === 'success' || state === 'duplicate'

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      // Second line of defence against a double submit; the button is also disabled.
      if (inFlight.current) return

      setState('validating')
      setMessage('')

      const trimmed = email.trim()

      if (trimmed.length === 0) {
        setState('error')
        setMessage('Enter your email to join the waitlist.')
        emailField.current?.focus()
        return
      }

      if (!isValidEmail(trimmed)) {
        setState('error')
        setMessage('That email address does not look right. Check it and try again.')
        emailField.current?.focus()
        return
      }

      inFlight.current = true
      setState('submitting')

      abort.current?.abort()
      abort.current = new AbortController()

      const outcome = await joinWaitlist({
        email: trimmed,
        firstName,
        signal: abort.current.signal,
      })

      inFlight.current = false

      if (outcome.kind === 'success') {
        setState('success')
        return
      }

      if (outcome.kind === 'duplicate') {
        setState('duplicate')
        return
      }

      setState('error')
      setMessage(outcome.message)
      emailField.current?.focus()
    },
    [email, firstName],
  )

  const reset = useCallback(() => {
    setState('idle')
    setMessage('')
    setEmail('')
    // Let the field mount before reaching for it.
    requestAnimationFrame(() => emailField.current?.focus())
  }, [])

  const invalid = state === 'error'

  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="relative"
      style={{ scrollMarginTop: '84px' }}
    >
      <div className="shell pt-[16vh] md:pt-[20vh]">
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <h2 id="waitlist-heading" className="text-display-md font-medium text-ink text-balance">
                Join the GlowMouth waitlist.
              </h2>
            </Reveal>

            <Reveal as="p" delay={0.08} className="mt-6 max-w-measure text-body text-ink-muted text-pretty">
              Get product updates and be among the first to know when GlowMouth becomes available.
            </Reveal>

            <div className="mt-12 md:mt-14">
              <AnimatePresence mode="wait" initial={false}>
                {settled ? (
                  <motion.div
                    key="settled"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.55, ease: QUIET }}
                  >
                    <p className="text-display-sm text-ink">
                      {state === 'success' ? "You're on the list." : "You're already with us."}
                    </p>
                    <p className="mt-4 max-w-measure text-body text-ink-muted text-pretty">
                      {state === 'success'
                        ? "We'll let you know as GlowMouth gets closer to launch."
                        : 'This email is already on the GlowMouth waitlist.'}
                    </p>
                    {state === 'duplicate' && (
                      <button type="button" onClick={reset} className="quiet-link mt-8 text-small text-ink">
                        Use a different email
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: QUIET }}
                  >
                    <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                      <div>
                        <label htmlFor="waitlist-email" className="label mb-3 block">
                          Email
                        </label>
                        <input
                          ref={emailField}
                          id="waitlist-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          inputMode="email"
                          spellCheck={false}
                          placeholder="you@example.com"
                          className="field-input"
                          value={email}
                          aria-invalid={invalid}
                          aria-describedby={invalid ? 'waitlist-error' : undefined}
                          onChange={(event) => {
                            setEmail(event.target.value)
                            if (state === 'error') {
                              setState('idle')
                              setMessage('')
                            }
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="waitlist-first-name" className="label mb-3 block">
                          First name <span className="normal-case tracking-normal">(optional)</span>
                        </label>
                        <input
                          id="waitlist-first-name"
                          name="first_name"
                          type="text"
                          autoComplete="given-name"
                          placeholder="Optional"
                          className="field-input"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-4">
                      <button type="submit" className="commit-button" disabled={busy}>
                        {state === 'submitting' ? 'Joining…' : 'Join the waitlist'}
                      </button>

                      {invalid && message && (
                        <p id="waitlist-error" className="text-small" style={{ color: 'var(--violet)' }}>
                          {message}
                        </p>
                      )}
                    </div>

                    <p className="mt-8 max-w-measure text-micro text-ink-faint text-pretty">
                      No spam. No noise. Just GlowMouth when there's something worth sharing.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Outcome announcement for assistive technology. */}
              <p role="status" aria-live="polite" className="sr-only">
                {state === 'success'
                  ? "You're on the list. We'll let you know as GlowMouth gets closer to launch."
                  : state === 'duplicate'
                    ? "You're already with us. This email is already on the GlowMouth waitlist."
                    : state === 'submitting'
                      ? 'Submitting your email.'
                      : invalid
                        ? message
                        : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
