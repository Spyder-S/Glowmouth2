# GlowMouth - Asset Requirements and Generation Prompts

This is an exact *request manifest*, not proof that these files already exist. Inspect `public/`, design sources, and any supplied asset folder first. Do not overwrite real assets. Do not download reference designers' images to display as GlowMouth property.

## Required first-pass assets

### 01. `public/brand/glowmouth-wordmark.svg`
- Format: SVG, scalable, transparent background.
- Source priority: original existing project logo or approved vector.
- Fallback: a tasteful text-only SVG lockup generated from the chosen display typeface; flag as temporary. Do not invent registered marks or a new legal brand identity.

### 02. `public/models/glowmouth-concept.glb` OR procedural `ConceptOpticalObject.tsx`
- Format: optimized GLB/glTF preferred, with a low-poly alternative; units and axis documented.
- Concept: compact oral-imaging-inspired optical instrument, with restrained white ceramic/satin polymer surfaces and a clearly defined imaging lens.
- Source priority: approved actual CAD/model/render. If none exists, create original procedural geometry and label the UI `CONCEPT VISUALIZATION`.
- Do not imply the model is a faithful representation of a shipping product.
- Motion goal: meaningful rotation/tilt and focal-depth progression through a scroll timeline.
- Fallback: a well-art-directed sculptural optical-lens abstraction is preferable to a visibly fake toothbrush or low-quality product facsimile.

### 03. `public/media/hero-fallback.webp`
- Dimensions: 2560 x 1440; 16:9; target optimized file size under ~400KB where quality allows.
- Usage: no-WebGL, reduced-motion, and loading poster for hero.
- Asset prompt: `A sculptural precision optical object for a speculative oral-health imaging project, floating diagonally in deep blue-green near-black negative space, off-white satin ceramic body, small concentric optical lens, single soft studio key light from upper left, very restrained pale mint rim reflection, premium industrial design photography, asymmetric composition with generous copy-safe empty space on left, subtle physical reflections, quiet confidence, no text, no logo, no people, no toothbrush bristles, no fantasy neon circuits, 16:9.`
- If image generation is unavailable, render the procedural 3D model to a still using the browser or provide a CSS poster fallback instead.

### 04. `public/media/optics-detail.webp`
- Dimensions: 1800 x 1800; 1:1; target optimized output.
- Usage: `/technology` macro chapter and responsive fallback.
- Prompt: `Extreme macro studio photograph of a precision glass optical lens nested in a softly sculpted satin ivory housing, subtle teal reflections along the edges, smooth material transitions, microscopic specular highlights, photoreal design visualization, clean near-black backdrop, tactile realism, no branding, no labels, no medical claims, square.`

### 05. `public/media/enamel-abstract.webp`
- Dimensions: 1800 x 1350; 4:3; target optimized output.
- Usage: illustrated conceptual transition, NOT a real clinical scan.
- Prompt: `Abstract macro 3D study inspired by the smooth translucent surface of dental enamel, pale mineral ceramic forms, subtle soft subsurface scattering, delicate thin blue-green light at edges, high-end medical design editorial photography, minimal background, refined realistic lighting, visually abstract rather than diagnostic, no actual patient, no text, no arrows, no disease or pathology depiction, 4:3.`

## Interface assets

### 06. `SampleGlowScore.tsx` (rendered React component, NOT an image)
- Viewport compositions: desktop widget approx 720 x 850; phone layout approx 390 x 844.
- Must contain real text controls and interactive date tabs with a seeded, labeled-illustrative chart.
- Use CSS/SVG/chart components; do not fake the app with a static screenshot.

### 07. `DemoPhone.tsx` (rendered React component)
- Approx base proportion 390 x 844; adapt to desktop and mobile.
- Use 3-4 distinct app states. Text remains live/selectable and screen reader accessible.

### 08. Founder/team photography
- Use ONLY approved images that exist in the repository or are supplied by the user.
- If none is available, use a strong editorial typographic list with genuine names/roles only after verification. Do not generate fake human portraits.

### 09. `public/media/glowmouth-og.png`
- Dimensions: 1200 x 630; social preview.
- Design: off-white GlowMouth wordmark on dark ink, a strong original optical object at right, tasteful mint accent, very large readable minimal text. No claims or logos belonging to other organizations.

## Optional later assets

### 10. One short atmospheric background loop
- 6-10 seconds, 1920 x 1080, muted and seamless, optimized WebM/MP4 poster fallback.
- Only add if it measurably improves storytelling. Prefer real-time minimal 3D scene over large page video.

## Rules

- Each missing asset must have an explicit fallback, with no broken URL.
- Use names and dimensions above consistently; update this manifest if the implementation changes.
- Keep exact attribution/license notes for third-party assets. Do not reuse Dribbble images in production.
- Keep hero legible if image or 3D fails. Avoid text baked into generated illustrations.
- Build first with asset 01 + 02 + 03; secondary imagery can follow after the hero is approved.

## Phase 1 asset inventory — implemented
- Existing `public/logo-mark-light.svg` retained; wordmark is live Schibsted Grotesk text. No invented registered trademark.
- `src/components/ConceptOptics.tsx`: original procedural optical sculpture, centered on origin, front along +Z, radius 1.48 scene units. Not approved hardware or CAD.
- `src/prototype.css` `.optical-poster`: CSS optical still for loading, reduced motion, no WebGL, render failures and explicit pause. No raster hero poster required for this checkpoint; a render-derived WebP remains a later optimization.
- Existing `public/team.jpg` retained and unused in this slice.
- Actual device CAD/model, approved product photography, optics detail imagery and social preview remain unavailable. None blocks this explicitly conceptual two-chapter review.
- Reference imagery is not copied into the project.

## Founder portraits - October 20, 2026
User supplied four Downloads JPEGs copied without bitmap edits to public/team/{vansh-goel,anish-ranga,anhad-sandhu,raj-mirchandani}.jpg. Responsive CSS crop/saturation only. Original files retained. Founder-name alt text on every portrait.

## Raj portrait update - October 26, 2026
Replaced `public/team/raj-mirchandani.jpg` with the user-supplied portrait (Screenshot 2026-10-26 at 9.11.39 PM), converted from PNG to JPEG at 90% quality. Existing responsive portrait styling retained.
