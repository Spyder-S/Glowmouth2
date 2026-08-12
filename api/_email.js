/**
 * Confirmation email.
 *
 * One module, one job, one exported function. Swapping EmailJS for Resend or
 * anything else means rewriting only sendConfirmation() below; nothing that
 * calls it changes.
 *
 * EmailJS is called server-side through its REST API, which requires the
 * PRIVATE key as `accessToken`. That key never reaches the browser. Sending
 * from the browser instead would expose your quota to anyone who reads the
 * bundle, which is why it is done here.
 *
 * If the environment variables below are unset, this is a no-op and the signup
 * still succeeds. Email is never allowed to fail a database write.
 */

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

export function emailConfigured() {
  return Boolean(
    process.env.EMAILJS_SERVICE_ID &&
      process.env.EMAILJS_TEMPLATE_ID &&
      process.env.EMAILJS_PUBLIC_KEY &&
      process.env.EMAILJS_PRIVATE_KEY,
  )
}

/**
 * Returns { sent: boolean, reason?: string }. Never throws.
 */
export async function sendConfirmation({ email, firstName }) {
  if (!emailConfigured()) return { sent: false, reason: 'not configured' }

  const body = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      // These names must match the variables used in your EmailJS template.
      email,
      to_email: email,
      first_name: firstName ?? '',
      greeting: firstName ? `${firstName},` : 'Hello,',
    },
  }

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      return { sent: false, reason: `${response.status} ${detail}`.trim().slice(0, 200) }
    }

    return { sent: true }
  } catch (cause) {
    return { sent: false, reason: String(cause?.message ?? cause).slice(0, 200) }
  }
}
