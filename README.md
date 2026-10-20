# GlowMouth

React + TypeScript + Vite website with scroll-driven product storytelling and a Supabase-backed waitlist.

## Local development

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Preview: http://127.0.0.1:5180. Vite serves the same Supabase waitlist handler used in production. Copy `.env.example` to `.env.local` and fill server credentials; never commit that file.

Routes: `/`, `/problem`, `/technology`, `/about`, `/early-access`.

## Waitlist configuration

Run `supabase/migrations/20260812000000_waitlist.sql` in the Supabase SQL Editor. Set these server-only environment variables:

- `SUPABASE_URL`: project origin, without `/rest/v1/`.
- `SUPABASE_SERVICE_ROLE_KEY`: privileged server key.
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`

EmailJS template: recipient `{{email}}`, greeting `{{greeting}}`; optional values `{{first_name}}` and `{{to_email}}`. Configure the Reply To address to a monitored inbox. Enable the appropriate server API permissions in EmailJS. Never prefix secrets with `VITE_`.

The form checks database availability before enabling registration. Signups are saved before confirmation email delivery is attempted. Duplicate addresses are recognized without resending. An email failure does not discard the signup. Future update campaigns are not automated; removal requests received by reply must be handled by the team.

`GET /api/waitlist` reports configuration/database status without key values. The inherited `?probe=1` diagnostic writes a temporary test row and removes it; use only intentionally. Legacy SQLite development scripts remain for isolated testing; they are not used by the active website.

## Validation

```sh
npm run build
node --test tests/waitlist.test.mjs
```

The server test mocks external services and covers insertion before email, duplicate handling, and email failure. The older `npm run verify` script targets the previous UI and SQLite test server; it is not the active UI regression suite. Browser verification is documented in `VALIDATION.md`.

## Deploy to Vercel

Import this repository. `vercel.json` configures the Vite build, serverless `/api/waitlist` endpoint, and SPA route fallback. Add the six environment variables above to the intended deployment environments before deploying or redeploying. GitHub does not carry local environment variables. Hosting on GitHub Pages alone will not run the waitlist backend.

Verify database health and a real signup/confirmation before announcing the public waitlist. Local database connectivity has been verified; live email delivery has not yet been confirmed.

## Design and content

Mineral/forest palette; procedural optical study; GSAP scroll chapters. Small screens and reduced-motion mode use readable stacked content. Device geometry, imagery and sample scores are illustrative, not clinical claims. WHO/CDC source details are recorded in `PRODUCT.md`. Supplied founder portraits are in `public/team`.

See `AGENTS.md`, `DESIGN.md`, `ASSET_MANIFEST.md`, `REFERENCE_AUDIT.md`, and `IMPLEMENTATION_PLAN.md` for project context. No chatbot is included.
