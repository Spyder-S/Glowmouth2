# GlowMouth, pre-launch site

A single-page, waitlist-first site for the GlowMouth concept device.

React 18 + TypeScript + Vite + Tailwind + Motion + React Three Fiber, with a
Supabase-backed waitlist behind a Vercel serverless function.

---

## Run it locally

Two processes. The site, and the local stand-in for the waitlist server.

```bash
npm install
```

```bash
npm run dev
```

In a second terminal:

```bash
WAITLIST_DEV_DEBUG=1 npm run waitlist:dev
```

The site is on <http://localhost:5180>. Vite proxies `/api/waitlist` to the
stand-in server, which stores signups in SQLite at `.local/waitlist.db`. You do
not need Supabase, Docker, or any keys to develop.

### Tests

```bash
node scripts/verify-api.mjs
```

```bash
node scripts/verify.mjs
```

The first checks the server contract, the second drives a real browser through
the ten waitlist cases, responsive behaviour, reduced motion, and WebGL failure.
Screenshots land in `.screenshots/`.

---

## 1. Push to GitHub

The repository is already initialised and committed on `main`.

Create an **empty** repository at <https://github.com/new>. Name it
`glowmouth-prelaunch`. Do not add a README, `.gitignore`, or licence, since
those would conflict with what is already here.

Then, replacing `YOUR-USERNAME`:

```bash
git -C /Users/vanshgoel/glowmouth-prelaunch remote add origin https://github.com/YOUR-USERNAME/glowmouth-prelaunch.git
```

```bash
git -C /Users/vanshgoel/glowmouth-prelaunch push -u origin main
```

If GitHub asks for a password, it wants a personal access token, not your
account password. Create one at <https://github.com/settings/tokens> with the
`repo` scope and paste it as the password.

`.gitignore` already excludes `node_modules`, `dist`, `.env`, `.local`
(the SQLite database with your test signups), and `.screenshots`.

---

## 2. Set up the database

In the Supabase dashboard, open **SQL Editor**, paste the whole of
`supabase/migrations/20260812000000_waitlist.sql`, and run it.

That creates `public.waitlist` and turns on row level security so that anonymous
visitors may insert a signup and nobody anonymous can read the list back.

To confirm it worked, run this in the SQL editor. It should return zero rows
rather than an error:

```sql
select count(*) from public.waitlist;
```

---

## 3. Deploy to Vercel

Go to <https://vercel.com/new> and import the GitHub repository. Vercel reads
`vercel.json` and needs no manual build configuration.

Before the first deploy finishes, add the environment variables below under
**Settings → Environment Variables**. Tick Production, Preview, and Development
for each one.

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Supabase → Project Settings → Data API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys → `service_role` |
| `EMAILJS_SERVICE_ID` | EmailJS → Email Services |
| `EMAILJS_TEMPLATE_ID` | EmailJS → Email Templates |
| `EMAILJS_PUBLIC_KEY` | EmailJS → Account → General → Public Key |
| `EMAILJS_PRIVATE_KEY` | EmailJS → Account → General → Private Key |
| `ALLOWED_ORIGIN` | Optional. Your live origin, e.g. `https://glowmouth.org` |

Redeploy after adding them. Environment variables are only read at deploy time,
so a deploy that ran before you added them will not pick them up.

**None of these are prefixed `VITE_`, and none of them should be.** Vite only
exposes `VITE_*` variables to the browser bundle. Everything above is read by
`api/waitlist.js` on the server, so no key ever reaches a visitor. Adding a
`VITE_` prefix to the service role key would publish full read and write access
to your database to anyone who opens developer tools.

---

## 4. Set up EmailJS

EmailJS is called **server-side** here, through its REST API, using the private
key. That is why the keys live in Vercel rather than in the bundle. Sending from
the browser instead would put your public key and your send quota in front of
anyone who reads the JavaScript.

1. **Connect a service.** EmailJS → Email Services → add Gmail, Outlook, or
   whichever provider sends your mail. Note the service ID.

2. **Create a template.** EmailJS → Email Templates. Set the **To Email** field
   to `{{email}}`. The function sends these variables:

   | Variable | Contains |
   | --- | --- |
   | `{{email}}` | The address that signed up |
   | `{{to_email}}` | The same address, if your template prefers this name |
   | `{{first_name}}` | First name, or empty if they did not give one |
   | `{{greeting}}` | `Vansh,` or `Hello,` if no name was given |

   A body that matches the site's voice:

   ```
   {{greeting}}

   You're on the list. We'll let you know as GlowMouth gets closer to launch.

   GlowMouth is under development and is not intended to diagnose, treat,
   cure, or prevent disease or replace professional dental care.
   ```

3. **Allow non-browser API calls.** EmailJS → Account → Security, and turn on
   API requests from outside a browser. Server-side calls are rejected until you
   do, and this is the single most common reason confirmation emails silently
   fail.

If any EmailJS variable is missing, `api/_email.js` skips sending and the signup
still succeeds. Email is never allowed to fail a database write.

To move to a different provider later, rewrite `sendConfirmation()` in
`api/_email.js`. Nothing that calls it changes.

---

## 5. Check it works in production

**Before testing the form, open this in a browser:**

```
https://your-site.vercel.app/api/waitlist
```

That is a configuration check. It returns JSON telling you exactly what is and
is not wired up, and it never returns a key, a signup, or a row count.

When everything is ready:

```json
{ "ok": true, "supabase_url_set": true, "supabase_service_key_set": true,
  "email_configured": true, "table_reachable": true }
```

When something is missing, `ok` is `false` and `fix` says what to do. The codes:

| `code` | Meaning |
| --- | --- |
| *(absent, `supabase_url_set` false)* | Env vars not set, or set after the last deploy. Add them and redeploy. |
| `table_missing` | The SQL migration in step 2 has not been run. |
| `permission_denied` | You used the anon key. It must be the `service_role` key. |
| `bad_key` | Supabase rejected the key. Re-copy it. |
| `unreachable` | `SUPABASE_URL` is wrong. It must be the full `https://<ref>.supabase.co`. |

Once it reports `ok: true`, join the waitlist with a real address and check
**Table Editor → waitlist** in Supabase. Submit the same address again and the
site should say *You're already with us* rather than showing an error.

A failed signup shows visitors a plain message, by design. The specific reason
goes to the Vercel function logs, and the response carries the same `code` as
above in its JSON body if you look in the browser's network tab.

### "Something went wrong on our end"

That is the generic 500. It means the function ran but could not finish. Open
`/api/waitlist` as above; it will tell you which of the causes it is. In almost
every case it is one of two things: the environment variables are not set, or
they were added *after* the last deploy and Vercel has not picked them up.
Environment variables are read at deploy time only, so adding them is never
enough on its own. Redeploy.

---

## Layout of the project

```
api/
  _core.js        Validation and normalisation. Shared with the local server,
                  so the tests exercise the production rules.
  _email.js       Confirmation email. The only file that knows about EmailJS.
  waitlist.js     The serverless function. Insert, then email.
src/
  components/     Navbar, WaitlistForm, ImagingFigure, DeviceObject, Footer
  components/three/
    DeviceModel    The conceptual device. Swap this one file for a GLB.
    DeviceScene    Canvas, lighting, camera.
  sections/       One file per moment on the page
  lib/            Waitlist client, scroll hooks, imaging field renderer
supabase/
  migrations/     The waitlist table and its RLS policies
  functions/      An Edge Function alternative to api/waitlist.js, unused by
                  default. Deploy it only if you move off Vercel.
scripts/          Local waitlist server and the two verification suites
```

---

## Replacing the 3D model

`src/components/three/DeviceModel.tsx` builds the device procedurally. It is a
concept visualisation: the shape, proportions, and materials are exploratory and
not final hardware.

When a real model exists, replace the geometry inside that one file with
`useGLTF('/models/glowmouth.glb')` and keep the props contract (`glow`, `spin`,
`pointerInfluence`, `still`, `lowDetail`) as it is. Every scene on the page
consumes the component through that interface, so nothing else needs to change.

---

## 6. Point glowmouth.org at it

Vercel gives every project a `.vercel.app` URL. Attaching your own domain
replaces it; nothing about the code changes.

### In Vercel

**Settings → Domains → Add.** Enter `glowmouth.org`, then add `www.glowmouth.org`
as well. Vercel will offer to redirect one to the other: take it, and make the
bare `glowmouth.org` the primary. Two addresses serving identical content splits
your search ranking between them, so one has to be canonical, and the canonical
tags in `index.html` already point at the bare domain.

Vercel then shows the DNS records it needs. Do not guess these; copy what it
shows you, because the values differ by account.

### At your registrar

Two ways, and the second is usually less trouble.

**Option A, change the nameservers.** Replace your registrar's nameservers with
the ones Vercel lists (typically `ns1.vercel-dns.com` and `ns2.vercel-dns.com`).
Vercel then manages all DNS for the domain. Simplest, but it moves every record,
so do not use this if the domain already handles email or anything else.

**Option B, add records at your registrar.** Keep your existing DNS and add:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | the IP Vercel shows (usually `76.76.21.21`) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Delete any existing `A` or `CNAME` on `@` and `www` first, or the old ones win.

### Then wait

DNS usually propagates in minutes but can take up to 48 hours. Vercel issues the
HTTPS certificate automatically once it sees the records, and the domain shows a
green check when it is done. Until then it may show "Invalid Configuration",
which during the first hour usually means "not propagated yet" rather than
"wrong".

### After it goes live

1. Set `ALLOWED_ORIGIN` to `https://glowmouth.org` in Vercel and redeploy. Until
   the domain works, leave it unset; a mismatch blocks the form.
2. Confirm `https://glowmouth.org/api/waitlist` still reports `ok: true`.
3. Submit the form once on the real domain.

### One thing that is not automatic

`hello@glowmouth.org` appears in the footer and, more importantly, on the
privacy page as the address people write to in order to have their data deleted.
Buying the domain does not create that mailbox. Set up email forwarding at your
registrar, which is usually free, and point it at an inbox you actually read.
Until you do, that address bounces and the promise on the privacy page is one
you cannot keep.

---

## Brand assets to drop in

Both are optional. The site is built so that a missing file is never a broken
image: the section simply stands on its typography until the file exists.

### The team photograph

Save the podium photo here, with exactly this name:

```
/Users/vanshgoel/glowmouth-prelaunch/public/team.jpg
```

Landscape, ideally around 2000px wide. It is cropped to 16:8 and centred, so
leave a little room above your heads. Then:

```bash
git -C /Users/vanshgoel/glowmouth-prelaunch add public/team.jpg && git -C /Users/vanshgoel/glowmouth-prelaunch commit -m "Add team photograph" && git -C /Users/vanshgoel/glowmouth-prelaunch push
```

Until that file exists the founders section simply runs without it. No broken
image ever appears.

### The mark

`src/components/LogoMark.tsx` draws the smile and the spark inline, in
`currentColor`, which is what lets the nav render it in ink on warm paper and
flip it to light over the dark imaging section without swapping files.

Standalone copies live at `public/logo-mark.svg` (ink, for light backgrounds)
and `public/logo-mark-light.svg` (paper, for dark ones), for decks, avatars and
anywhere outside this app. The favicon carries the same artwork on the dark
brand tile.

To change the mark, edit the two paths in `LogoMark.tsx` and mirror them into
those two files and the favicon in `index.html`.

## Before launch

- Replace `public/og-image.png`. The meta tags reference it but the file does
  not exist yet; social previews will be blank until it does.
- Add `public/apple-touch-icon.png` and real icons in `site.webmanifest`.
- Update the canonical origin in `index.html` and `src/lib/site.ts` if the
  domain is not `glowmouth.org`.
- Point `hello@glowmouth.org` at a mailbox you actually read. It appears in the
  footer and in `public/privacy/index.html`.
- Re-check the WHO figure cited in the *scale of it* section against the current
  edition of the Global Oral Health Status Report.
