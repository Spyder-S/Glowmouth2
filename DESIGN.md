# GlowMouth - Visual System and Interaction Direction

## North star

A premium editorial product launch about seeing oral health more clearly. The aesthetic is `optical calm`: dark, sculptural medical technology paired with open, warm, precise editorial layouts. The mood is contemplative, credible, and unusually beautiful - never a cyberpunk dashboard.

## Reference hierarchy

1. Smartcare, Sophie Tomash / Zajno: https://dribbble.com/shots/23133725-Landing-Page-for-Conceptual-Medical-AI-Toothbrush
   - Borrow the dramatic centrally framed product, focused lighting, micro-annotations, spare copy, and chapter-by-chapter scroll narrative.
   - Adapt away from toothbrush functionality. This reference is a design concept, not a production website or reusable asset library.
2. Bloom Plant Care, Kris Anfalova: https://dribbble.com/shots/27416728-Bloom-Plant-Care-Landing-Page
   - Borrow whitespace, visual hierarchy, offset imagery, soft editorial rhythm, and clean app mockups.
   - Do not borrow the plant-green brand identity, botanical imagery, or exact layout.
3. Apple AirPods Pro: https://www.apple.com/airpods-pro/
   - Study how a hardware story is broken into meaningful chapters and feature-focused visuals.
   - Do not reproduce Apple's trademarks, footage, text, or proprietary visuals.

Analyze screenshots when available. Write a brief local reference audit covering typography, spacing, composition, lighting, and feasible implementation. Capture original inspirations as guidance, not as backgrounds to paste into the site.

## Visual identity

Backgrounds:
- `ink` #071316: blue-green tinted charcoal, main immersive canvas.
- `ink-deep` #03090B: deep shadow for product reveals.
- `paper` #F3F5F1: soft off-white for accessible editorial sections.
- `paper-2` #E6ECE8: subtle tonal separation.

Accents:
- `signal` #8CE7D9: desaturated luminous mint/cyan, use as a *signal* not flood fill.
- `signal-dark` #155B5B: accessible signal color on light sections.
- `muted-dark` #9EB3B3 for secondary copy on ink.
- `body-dark` #EAF2F0; `body-light` #16282A.

Keep the number of accent colors small. Prohibited: unmotivated rainbow gradients and generic purple-glowing blobs.

Typography:
- Display: `Plus Jakarta Sans` or another intentionally selected modern sans with clear optical proportions; heavy weights only for large type.
- Text: `DM Sans` or another complementary readable font; ordinary body copy at least 16px.
- Editorial accent, optional: `Instrument Serif` in selected 1-3 short phrases across the entire site.
- Technical micro labels: `IBM Plex Mono`, small with generous letter spacing and good contrast.

Desktop hero heading approximately clamp(4.4rem, 8vw, 8.5rem). Mobile heading approximately clamp(3rem, 12vw, 5.2rem). Body line lengths 55-70 characters, text never cramped to the edge.

Grid: 12-column conceptual system, outer gutters clamp(24px, 5.5vw, 92px), main content max width ~1480px. Use intentional asymmetry and substantial negative space. Buttons should feel engineered: minimal border, 10-14px corner radius, satisfying hover and focus behaviors. Avoid fake pill-everything styles.

Texture: exceptionally subtle fine grain/noise only when useful. Materials should resemble ceramic, frosted glass, satin polymer, and optical glass. The light treatment should suggest care and clarity, not the inside of a spaceship.

## Primary visual object

A real WebGL 3D conceptual object is preferable, using Three.js/React Three Fiber when feasible. If no real GlowMouth physical device exists or no approved render is available, model a neutral `imaging concept` or sculptural optical lens and label it honestly. Do not invent detailed production hardware or imply an unbuilt device is manufactured.

Use one main scene/camera and evolve it through the homepage:
- idle: slow 2-4px equivalent float and subtle <5-degree oscillation over several seconds;
- pointer: optional very modest parallax, never required for motion;
- early scroll: product begins responding within the first ~80px;
- feature reveal: camera moves close enough to show a lens/optical focal point;
- transition: move visually from hardware/lens to an illustrative app experience;
- exit: product settles before editable sections begin.

Avoid multiple independent heavyweight canvases. Reuse 3D assets where possible. Limit WebGL pixel ratio and pause rendering when not visible.

## Homepage storyboard (build in this order)

### 01 / ENTRY: 'LOOK CLOSER'
Full-height, deep-ink visual. Headline on a deliberate asymmetrical grid, left/lower-left. Product or optical form lit with one off-white key light and restrained mint rim light, right of center, partially beyond the fold. Navigation is simple and translucent only when readability allows. A small supporting sentence and CTA are visible without scrolling. The 3D visual floats even during idle. The first scroll changes camera orientation or scale immediately.

### 02 / THE GAP BETWEEN VISITS
Open, paper-colored narrative section. A simple visual calendar/time axis connects periodic dental visits. Scroll reveals the quiet interval between appointments and a human, modest explanation. Use crisp oversized editorial type and a single purposeful timeline - not three features cards.

### 03 / OBJECT REVEAL
Pin for about 1.5-2 viewport heights on desktop, not longer than necessary. Camera rotates the optical object while only 2-3 annotations appear in sync. If the model is conceptual, explicitly display `DESIGN CONCEPT`. Restraint wins: readable labels, no faux engineering measurements. Mobile version uses sequential sticky visual-and-copy blocks without prolonged pinning.

### 04 / FROM IMAGE TO INSIGHT
Transition through an enlarging optical circle. An animated image-capture illustration becomes a legible app dashboard. Do not pretend to analyze real patient images. Build the interface from real React components and synthetic sample content. Make the transition smooth using layered DOM with WebGL only where beneficial.

### 05 / HORIZONTAL STORY
Three 100vw chapters translated horizontally as the visitor scrolls vertically: `Capture (concept)` -> `See patterns (illustrative)` -> `Follow change (GlowScore concept)`. Use GSAP ScrollTrigger with pin and scrub, not wheel interception. Timeline progress is visible. Mobile converts to normal vertical chapters.

### 06 / GLOWSCORE DEMO
In a bright editorial environment, large phone/dashboard display of an expressly illustrative 0-100 trend indicator. Interactive date selection updates both chart and score. Use clearly invented *sample* values with no diagnostic labels. Changes have a small restrained interpolation animation, not a gimmicky count-up.

### 07 / PROOF OF WORK
Founder-reported factual items, verified before publish: 6,414 survey respondents, 4-person team, 2 dental collaborators, $500 VCU funding, provisional patent filed. Avoid collapsing them into a five-card row; instead use an asymmetric typographic/statistical editorial spread and a linked project timeline. Do not publish the 95% metric without robust context.

### 08 / CLOSING
Return to ink. Reintroduce optical shape in a new frame and use a very short headline: `Follow what we're building.` Strong, singular CTA to `/early-access`. No made-up availability or live waitlist totals.

## Secondary pages - distinct, purposeful interactions

`/technology`
- Opening: cross-section-style optical illustration or product close-up with slow ambient movement.
- One pinned rotation or focus/zoom demonstration, then a vertically progressing sequence explaining image acquisition -> analysis concept -> tracking concept.
- Separate current work from future possibilities.

`/how-it-works`
- A synchronized mobile app prototype with several scroll-linked views.
- Independent manual controls for sample GlowScore history.
- Horizontal progression on desktop, vertical progression on mobile.

`/our-story`
- Editorial typography, restrained documentary mood.
- Scroll-linked project milestones and one photo-led/typographic team section using approved content only.
- Avoid fabricated founder stories and fake people images.

`/early-access`
- Conversion-led split composition, not a spectacle that distracts from the field.
- Form validation and clear inactive-backend messaging until configured.
- Subtle animated object, scroll-reactive FAQ reveal; not a second full-homepage-length experience.

## Shared components

Navigation; PageFooter; PrimaryCTA; DisplayHeading; ScrollChapter; StickyProductScene; ScrollProgress; SampleGlowScore; DemoPhone; SectionTransition; EarlyAccessForm; GlowGuideFAQPreview; ReducedMotionStaticPoster.

## Motion implementation contract

- Prefer GSAP ScrollTrigger with one source of scroll progress. If using Lenis, integrate its RAF carefully and synchronize ScrollTrigger; avoid CSS global `scroll-behavior: smooth` conflicts.
- For React route transitions, clean up tweens/ScrollTriggers using contexts and lifecycle cleanup. Refresh measurements after fonts, imagery, and resized layout are ready.
- Favor transforms and opacity. Avoid per-frame state-setting/reconciliation for camera motion where refs/GSAP suffice.
- Idle movement must not depend on pointer or scroll input; clamp movement for comfort.
- Do not hide content when reduced motion is enabled; render stable keyframes and direct navigation.
- Never lock scrolling, trap users inside pinned chapters, or leave blank screens.

## Motion implementation budget

One hero WebGL scene and at most one adjacent 3D reuse if reasonable; other sections primarily composited DOM/SVG. Small sample datasets, static fallbacks, and optimized models. Avoid heavy real-time volumetric lighting, huge videos, large particle systems, and multiple simultaneous render loops.

## What success feels like

Within 5 seconds, a visitor understands this is an oral-health technology concept with real people behind it. Within 20 seconds of scrolling, they have seen a uniquely choreographed visual demonstration. By the end, they understand the idea and want to follow it, without encountering a fake clinical claim or broken interaction.

## Current direction — user-requested Busguard-inspired revision
This overrides the earlier dark hero north star for the active prototype. Use a light mineral surface (#f0f1e9), forest ink (#18251d), restrained green (#30734e), and pale chartreuse (#d5e7a2). Bold Schibsted Grotesk display type replaces the thin hero. An exploded optical study assembles on vertical scroll, followed by a reading transition and a horizontal Capture / Compare / Discuss story. Mobile uses stacked scenes; no horizontal scroll trapping. Do not copy Busguard assets or imply the model is real hardware. No waitlist or Gemini integration.
