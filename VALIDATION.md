# Phase 1 validation — 20 October 2026

## Results
- `git fetch origin`: passed. Existing clone HEAD matched origin/main at faef43c; reused clean checkout instead of duplicating it.
- `npm run build`: passed (TypeScript + Vite). Optical scene chunk is 876 KB raw / 239 KB gzip, dynamically requested through the lazy scene. Removed the old manual chunk rule that pulled React into Three and eagerly preloaded it; the final HTML has no Three preload. Vite reports its size warning.
- Local server: http://127.0.0.1:5180/ (Vite).
- Actual in-app browser screenshots inspected at 1440×900, 1024×900, 768×1024, 390×844, 320×740. DOM width checks showed no horizontal page overflow at each width.
- Desktop and mobile chapter inspected; anchor scroll reaches the next section without a pin or scroll trap.
- Idle scene visibly changes across captures without pointer input; keyboard scroll inspected at 40px, with changed lens orientation.
- Explore CTA, desktop early-access link and return link passed. Mobile menu opens, closes on selection, and reaches the chapter.
- Pause motion unmounts canvas (verified 0 canvas elements) and displays the static poster (opacity 1); enabling restores scene. System prefers-reduced-motion uses this same branch plus CSS animation suppression, but OS media emulation was not exposed by this browser tool, so system-level behavior was source-reviewed, not independently emulated.
- No-WebGL detection and error boundary implemented and source-reviewed; WebGL-disabled browser mode was not independently injected. Static fallback itself was inspected via pause control.
- Clean final browser console: no warnings/errors captured. One earlier preview tab lost debugger synchronization after hot reload; a fresh tab recovered and subsequent checks succeeded.
- No lint script exists. Existing `npm run verify` targets the prior full homepage and live test waitlist backend; deliberately not run because this scoped prototype excludes those surfaces and backend integration is deferred. No claim that the legacy integration suite passes.
- npm installation reported 10 dependency advisories (3 moderate, 7 high); dependency security remediation remains outside this visual checkpoint. No forced major-version upgrades applied.

## Visual corrections from actual render
1. Narrowed and softened the optical studio reflection.
2. Moved the lens annotation below the object to remove occlusion.
3. Separated mobile CTA and optical visual.
4. Adjusted tablet camera container and crop.
5. Relaxed excessive display letter spacing.
6. Added explicit motion control, error fallback and visibility-based rendering pause.

## Review evidence
`qa/phase1/desktop.png`, `mobile.png`, `chapter.png`.

## Deferred
Full homepage, secondary-page content, approved device geometry, raster poster/social export, waitlist and Gemini integration. No production deployment, credentials or API writes. Review the two-chapter direction before Phase 2.

## Revision 2 — Busguard-inspired rebuild
- Browser inspected live Busguard hero and assembly motion before changing direction.
- Rebuilt light bold hero, original exploded optical assembly, scroll-linked reading transition, three-scene horizontal journey, layered comparison movement, animated capture guide, journal tabs and closing wordmark movement.
- TypeScript/Vite build passed. Lazy scene remains approximately 877 KB raw / 239 KB gzip; Vite's chunk-size warning remains.
- Browser inspected at 1440×900, 1024×900, 768×1024, 390×844 and 320×740. Width checks matched viewport at all sizes. Corrected mobile hero spacing, stale assembly pose on resize, assembled-scene text collision and 768px action/visual crowding.
- Verified pinned assembly: at scrollY 763, hero top remains 0 and components have assembled.
- Verified horizontal Compare control: rail transform reaches translateX(-1440px) at 1440px viewport. Discuss control reaches final panel; journal selection updates the displayed copy. Mobile chapter controls navigate vertically.
- Verified motion-off: optical canvas count becomes 0, rail display becomes block and page width remains 1440px. System-level reduced-motion and forced no-WebGL remain implemented but not independently emulated by available browser controls.
- Desktop/mobile screenshots and comparison evidence saved under qa/revision2. Original qa/phase1 remains historical, not the active design.
- Waitlist/Gemini remain disconnected. No production deployment. Legacy backend verification suite remains inapplicable and was not run.

## Revision 3 - October 20, 2026
Production build and TypeScript pass. Existing lazy 3D chunk size warning remains; secondary pages do not mount WebGL. Actual desktop and mobile screenshots inspected for all three pages. All routes fit 320, 768 and 1024px with document width equal to viewport; 390px mobile inspected too. Four portraits load. LinkedIn hrefs verified in rendered DOM. Population switch returns 21% and 10%; comparison ArrowRight updates 50 to 51; playback reaches Follow. Motion-off disables autoplay and retains manual controls. Mobile menu routes to Technology. No captured runtime errors/warnings. System reduced-motion emulation unavailable; manual branch tested. Evidence in qa/pages. Backend integration tests inapplicable to deferred waitlist/Gemini.

## Product assistant
Build/typecheck passed; two server tests cover method/origin/input validation, grounding, successful answer parsing and sanitized upstream failure. Browser verified submission/loading/unavailable state, 390px fit, Escape dismissal and focus restoration. Direct Gemini authentication/generation returned HTTP 200; another request returned HTTP 503 UNAVAILABLE due to high demand. Successful end-to-end UI answer remains unverified. Browser bundles checked and do not contain the supplied API key. No deployment performed.

## Chatbot removal
User requested removal. Removed UI, API endpoint, local dev middleware, assistant tests and Gemini environment entries (including local credential). Previous assistant notes above are historical.

## Scroll storytelling checks
Inspected reference through actual scroll. Verified desktop technology Capture/Compare/Follow progression and chapter buttons, Problem gum disease chapter, About DECA ICDC anchor and matching active marker. Motion-off removes enhanced story and renders all three chapters. Reviewed mobile scene and corrected device cropping/note overlap. Width checks 320/768/1024 across three routes; corrected narrow Problem sphere overflow. Console had no captured warnings/errors. CSS scene is conceptual, not CAD.

## Waitlist form
Desktop and 390px mobile inspected. Missing-database state truthfully disables registration. Production build passes. Mocked server integration test verifies insert-before-email order, duplicate handling without a second email, and preservation of signup on email failure. No real signup or email sent. Live verification blocked by missing Supabase credentials; EmailJS env settings are present but delivery unverified.

## Pre-push verification
Supabase waitlist table reachable with an exact count of zero after user migration. No subscriber data retrieved, signup inserted or email sent. Build and mocked waitlist integration test passed. Prior missing-credential notes are historical. Production environment variables must be configured separately.
