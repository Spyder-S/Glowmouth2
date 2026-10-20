# GlowMouth - Phased Prompts for Codex / Claude Code

Copy ONE phase prompt at a time into your coding agent. Review the local browser after major checkpoints, especially after Phase 1. Later phases assume earlier work is complete. Persistent constraints are already in the project documents.

## Phase 0 - project audit and setup

```text
We are redesigning GlowMouth. You are the lead digital art director and frontend engineer.

Read AGENTS.md, PRODUCT.md, DESIGN.md, ASSET_MANIFEST.md and inspect the existing repository before making changes. If an Impeccable skill is already installed, use it. If not, tell me the exact install step; do not silently install global tools.

Analyze the three visual references in DESIGN.md, using browser views and screenshots if available. Create `REFERENCE_AUDIT.md` with a compact description of their composition, typography, whitespace, materials, section flow, and which parts are technically feasible. Never claim to have observed interactions in a static Dribbble concept. If I supply screenshots, analyze them directly.

Create the project tokens/components plan and `IMPLEMENTATION_PLAN.md` with page routes, the homepage visual storyboard, design tokens, scroll/3D ownership, asset dependencies, privacy/medical boundaries, and checkpoint testing. Check which real GlowMouth claims and images are documented; identify unknowns without inventing answers.

Then immediately scaffold the actual working frontend framework, global typography/colors/navigation, route shells, and a coherent static hero composition. Preserve existing working code where possible. Start the dev server. Show me the local preview URL and current blocking issues. Do not build all five pages as generic cards.
```

## Phase 1 - exceptional home hero, first visual approval checkpoint

```text
Focus ONLY on the homepage's opening 1-2 chapters. The goal is visual quality, not maximum section count.

Implement the `LOOK CLOSER` hero from DESIGN.md with a genuine 3D optical/product concept or an approved real device model, carefully lit dark medical-tech environment, a very large deliberate typographic composition, premium navigation, and two working CTAs. Idle motion must continue without mouse movement, and the first ~80px of scrolling must visibly influence the scene.

Use react-three-fiber/Drei and GSAP ScrollTrigger if compatible with the project. Create an excellent non-WebGL poster fallback and a reduced-motion path. Implement the next bright editorial section with a scrolling appointment-gap visual. Make desktop and 390px mobile visually excellent. Do not use stock cards, fake scientific metrics, or generic purple gradients.

Run the site, inspect the rendered result using browser tooling, capture/inspect screenshots at 1440px and 390px, critique the current design, and fix at least the five largest visual problems you find. Verify no clipping, horizontal overflow, or frozen scroll. Do not announce completion based only on compilation.

After this phase, STOP for my visual review. Report the working preview URL and list any genuine missing assets.
```

## Phase 2 - full flagship landing page

```text
The hero direction is approved. Extend the homepage into the complete eight-chapter cinematic story in DESIGN.md without lowering the quality bar.

Implement a pinned scroll-controlled object/lens reveal, thoughtful annotation states, a coherent transition from optics to an illustrative React app interface, a high-quality 3-panel horizontal chapter driven by normal vertical scroll, a working sample GlowScore with date controls updating the chart and score, a carefully art-directed proof-of-work section using only verified claims, and the closing early-access CTA.

Ensure scene continuity: the same visual language must persist from the hero into product chapters. Avoid throwing unrelated animations into every section. Render content as normal DOM wherever appropriate, and only use WebGL where it adds real depth.

Test ScrollTrigger refresh after resize, font loads, route transitions, and reduced motion. On mobile, use an elegant vertical equivalent for the horizontal chapter. Every CTA/link must work. Review the entire homepage in a browser at 1440, 1024, 768, and 390 widths. Fix visuals that look templated, unreadable, or technically broken.

Report what is live, what is an illustrative concept, which interactions were tested, and what still needs actual hardware/brand assets.
```

## Phase 3 - secondary pages and UI previews

```text
Build distinct, polished, real routes: /technology, /how-it-works, /our-story, and /early-access. Use DESIGN.md and PRODUCT.md as the source of truth.

Every page needs its own composition and at least two meaningful motion treatments. Technology: an interactive optical/device concept detail and progressive visual explanation. How It Works: scroll-synchronized simulated companion-app screens, followed by manual sample GlowScore history interactions. Our Story: a carefully paced milestone timeline and real approved team/project details only. Early Access: an exceptional conversion-led layout, form validation, honest preview/integration status, FAQ, and small animated optical motif.

Build GlowGuide as a local curated-FAQ preview, with suggested questions, accessible dialog behavior, and honest unsupported-question responses. Do not send messages to Gemini, pretend to generate AI diagnoses, or collect patient information.

Prepare typed waitlist and future Gemini service interfaces and server-side environment placeholders but do not connect either service. Do not expose secret values to the browser. Until the waitlist backend is enabled, show plainly that submission is a preview and no email is being saved.

Do not give every secondary page the same cards and same fade-in treatment. Preserve the premium art direction. Inspect each route on desktop and mobile, then fix the most visible issues.
```

## Phase 4 - professional creative and engineering audit

```text
Perform an uncompromising production-quality pass across every GlowMouth route. Use Impeccable critique/audit/polish/animate workflows if available, plus actual browser testing.

Look especially for: bland templated sections, awkward product framing, excessive visual effects, poorly lit 3D materials, ineffective narrative transitions, inconsistent spacing, weak type hierarchy, fake medical credibility, idle scenes that do not animate, scroll scenes that start too late, trapping pins, broken controls, stale ScrollTriggers, and poor mobile fallbacks.

Rank the ten most impactful issues by severity; then FIX THEM IN CODE before reporting. Run build/typecheck/lint/tests as available. Inspect all pages at 1440px, 1024px, 768px, 390px, and 320px. Verify keyboard tab order and reduced-motion behavior. Run a basic performance audit if tools allow and optimize the biggest bottlenecks.

Update the README, ASSET_MANIFEST.md, IMPLEMENTATION_PLAN.md, and create `VALIDATION.md` with actual test commands/results, routes inspected, remaining limitations, and instructions for future waitlist and Gemini API integration. Do not claim a test passed if it was not run. Do not change production deployment settings.
```

## Phase 5 - backend integration, ONLY when explicitly requested later

```text
We are now ready to integrate production services. First inspect the existing typed service interfaces and environment-variable placeholders. Ask me which waitlist provider/API and Gemini environment I want to use. Explain how secrets stay server-side. Do not paste credentials into client components.

Implement and validate the actual waitlist persistence path, meaningful success/error states, abuse prevention, appropriate privacy disclosure, and any approved Gemini endpoint with medical-safety boundaries. Never claim submitted information is stored until the backend confirms it.

Do not begin this phase unless I explicitly approve it and provide the necessary provider information.
```

## Extra feedback prompts

### When the hero looks generic

```text
Audit the first screen as a senior digital art director. Compare its negative space, product crop, lighting contrast, typography, and spatial depth to the Smartcare and Bloom references in DESIGN.md. Identify the exact five details making it look generic and correct them in code. Do not add more cards or gradients to compensate. Reopen the page and inspect the result.
```

### When the 3D feels fake

```text
Improve the material realism and 3D composition of the GlowMouth concept object. Focus on silhouette, lens detail, roughness, realistic key/fill/rim lighting, camera perspective, carefully staged motion, and physically convincing shading. Do not claim the concept is actual manufactured hardware. If procedural geometry cannot reach the desired level of fidelity, record the limitation and make the alternative optical sculpture coherent with the design.
```

### When the scroll is impressive but exhausting

```text
Keep the highest-impact animated story beats and remove repetitive motion. Shorten excessive pinned distances, increase time for reading, stop scroll-hijacking behavior, smooth camera paths, and make responsive/mobile scenes simpler. Preserve the hero, optical product reveal, and one horizontal story. Reinspect in browser and reduced-motion mode.
```
