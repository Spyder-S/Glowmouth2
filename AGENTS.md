# GlowMouth - Codex Project Instructions

You are acting as a senior digital art director, interaction designer, and frontend engineer building GlowMouth's public-facing website. Your job is to ship a distinctive, useful, technically reliable experience - not a generic AI-generated startup template.

## Read these files at the start of each task

1. `PRODUCT.md` - product truth, positioning, audiences, claims, and medical boundaries.
2. `DESIGN.md` - visual language, references, layouts, interaction principles, and tokens.
3. `ASSET_MANIFEST.md` - approved assets, missing assets, fallbacks, and exact requirements.
4. Existing repository instructions and the existing codebase.

If these files contradict a verified source in the existing repository, preserve the original verified source and record the discrepancy. Do not quietly invent facts to fill gaps.

## Before writing UI code

- Inspect the existing stack, routes, assets, logo, and deployment setup. Do not discard working code or replace the stack without a clear technical reason.
- Study the reference links in `DESIGN.md`. If URLs are inaccessible, use provided screenshots or record the limitation. Do not imply you saw an inaccessible reference.
- Establish page-by-page storyboards and reusable design tokens first. The storyboard is a working artifact, not a substitute for implementation.
- Audit asset availability. Use approved real assets where possible. If an essential 3D model is absent, create a carefully designed conceptual fallback and explicitly label it.
- Verify that the planned visuals are actually feasible in the existing stack.

## Design bar

- Distinctive art direction over generic component-library aesthetics.
- Dramatic, carefully framed product imagery; large disciplined typography; asymmetrical editorial composition; restrained medical-tech color.
- Motion must explain the product or guide the viewer. A random moving orb does not count as storytelling.
- Each route needs a distinct composition, not the same hero + cards repeated five times.
- Layout and type must remain strong with motion disabled.
- Keep the first meaningful visual response within the first small scroll movement.
- Do not use fake logos, fake client reviews, fake numbers, fake clinical endorsements, fake screenshots, or unimplemented buttons.

## Anti-patterns - never use

- Purple/blue gradient SaaS backdrops; generic radial gradient circles behind a centered headline.
- Default Inter/Roboto typography with no intentional scale; unconsidered font mixing.
- Endless three-column feature cards; icon tiles above every heading; nested card grids.
- Gratuitous glassmorphism, neon cyber-grid backgrounds, oversaturated glows, and floating dashboard cards in every section.
- Stock dentist portraits or tooth images unrelated to actual project content.
- Generic testimonials, unsubstantiated star ratings, fake waiting-list counts, invented urgency.
- Startup filler copy: "revolutionary," "game-changing," "seamless," "unlock the future," "cutting-edge solution," etc.
- Repetitive rhetorical formulas such as "It's not X, it's Y" and contrived lists of three.
- Every animation being fade-up on entry; repetitive animated counters used to hide thin content.
- Slow scroll hijacking, unnecessary loading screens, hidden content, autoplay audio, or navigation-breaking page transitions.

## Copy rules

- Speak plainly and concretely. Short headlines, human explanations, sparing adjectives.
- Explain product aspirations as aspirations; label demos as illustrative and prototype features as concepts.
- Never present GlowMouth as diagnosing disease, replacing dentists, or an approved clinical device.
- The roughly 95% model-accuracy figure is project-reported and must not be published as a validated clinical result. Only show performance metrics with explicit supporting evaluation context and approval.
- Source all displayed numbers from `PRODUCT.md` and verified files; do not infer studies or participants.
- Make early-access status transparent: until an API is actually connected, emails are not saved.

## Preferred implementation

- Use the existing framework if appropriate. For a new build prefer Next.js + React + TypeScript + Tailwind.
- GSAP + ScrollTrigger for pinned story chapters, scroll-linked timelines, and horizontal narrative. Use one integrated scroll system.
- React Three Fiber + Drei for genuinely dimensional visuals where appropriate, with an accessible visual fallback.
- Shadcn UI may be used for form and dialog mechanics, not as the entire art direction.
- Keep secrets on the server only; do not expose waitlist or Gemini credentials in browser bundles.
- Separate verified project content, seeded demo data, 3D geometry, marketing pages, and API adapters.
- Prefer native semantic controls, properly labeled forms, and strong keyboard interactions.

## Motion and performance

- Ambient motion should continue subtly while idle. Scroll must also immediately affect the hero.
- Use purposeful camera paths and transformations, not independent conflicting animations.
- Use GPU-friendly transforms, lazy-loaded 3D, bounded DPR, and modest texture sizes.
- Do not apply long pinned horizontal scenes on narrow mobile layouts; create a vertical equivalent.
- Support reduced motion, keyboard-only use, touch interaction, and browsers without WebGL.
- Clean up GSAP timelines and ScrollTriggers across route changes; prevent scroll desynchronization.
- Mobile responsiveness and legible content outrank decorative rendering.

## Implementation workflow

1. Inspect. Create or update the storyboard, visual tokens, and asset manifest.
2. Build a convincing homepage HERO VERTICAL SLICE and run it in a browser before adding five half-finished pages.
3. Critique the actual rendering. Fix spacing, proportions, materials, typography, and motion.
4. Build the full homepage narrative and working seeded app demo.
5. Build secondary routes, waitlist UI preview, and GlowGuide FAQ preview.
6. Test and polish on desktop, tablet, and small mobile viewports.
7. Report actual test and browser findings. Never claim tests or visual reviews that did not occur.

Keep commits or checkpoints safe. Never overwrite unrelated user changes, and do not redeploy or alter production configuration without authorization.

## Required verification

- Run whatever lint, typecheck, build, and tests the project provides; report pass/fail accurately.
- Open the running app in a browser if tooling exists. Inspect at 1440px, 1024px, 768px, 390px, and 320px widths.
- Test scroll and idle animations, mobile navigation, route changes, sample GlowScore controls, GlowGuide curated FAQ, and preview waitlist validation.
- Test with `prefers-reduced-motion`; check console warnings, overflow, layout shifts, and trapped scroll areas.
- If browser tools are unavailable, explicitly state that limitation and provide manual verification steps.

## Impeccable

Use the Impeccable skill for direction, critique, audit, polish, and motion when available. If not installed, ask before installing new tooling. Use its recommendations as input, but do not let a generic design prescription override `DESIGN.md` or product truth.

## Definition of done

A finished section is one that renders well, animates meaningfully, works on desktop/mobile, supports reduced motion, contains accurate copy, and has been visually inspected. Code that merely compiles is not finished.
