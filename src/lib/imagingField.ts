/**
 * A conceptual intraoral imaging field.
 *
 * Both renderings are drawn from one seeded description, so the visible-light
 * pass and the fluorescence pass are structurally the same scene under two
 * different lights. That is the entire point of the section: nothing new is
 * invented on the right-hand side of the divider, it was already there.
 *
 * Deliberately abstract. No recognisable anatomy, nothing clinical, nothing
 * unpleasant, and no claim about what any device detects.
 */

type Blob = { x: number; y: number; r: number; tone: number; rot: number; stretch: number }
type Specular = { x: number; y: number; r: number }
type Recess = { x: number; y: number; r: number; load: number; rot: number }

export type ImagingField = {
  blobs: Blob[]
  speculars: Specular[]
  recesses: Recess[]
  /** Amplitude and phase of the soft band the recesses gather along. */
  margin: { amp: number; phase: number; base: number }
}

const TAU = Math.PI * 2

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildField(seed = 20260812): ImagingField {
  const rand = mulberry32(seed)
  const span = (min: number, max: number) => min + rand() * (max - min)

  const margin = { amp: span(0.06, 0.13), phase: span(0, TAU), base: span(0.44, 0.6) }
  const marginAt = (x: number) => margin.base + Math.sin(x * 3.1 + margin.phase) * margin.amp

  // Rounded, overlapping forms. Stretched and rotated so the field reads as
  // surfaces meeting rather than a scatter of dots.
  const blobs: Blob[] = Array.from({ length: 11 }, () => {
    const x = span(-0.08, 1.08)
    const above = rand() > 0.45
    const y = above ? marginAt(x) - span(0.08, 0.42) : marginAt(x) + span(0.08, 0.4)
    return {
      x,
      y,
      r: span(0.13, 0.32),
      // Forms above the band read as hard, bright surfaces; below, softer.
      tone: above ? span(0.6, 1) : span(0, 0.4),
      rot: span(0, TAU),
      stretch: span(1.1, 2.3),
    }
  })

  const bright = blobs.filter((b) => b.tone > 0.55)
  const speculars: Specular[] = Array.from({ length: 11 }, () => {
    const host = bright.length ? bright[Math.floor(rand() * bright.length)] : blobs[0]
    return {
      x: host.x + span(-0.45, 0.45) * host.r,
      y: host.y + span(-0.4, 0.4) * host.r,
      r: span(0.006, 0.022),
    }
  })

  // Recesses gather along the band: the seam a mirror and good lighting still
  // make hard to read.
  const recesses: Recess[] = Array.from({ length: 9 }, () => {
    const x = span(0.04, 0.96)
    return {
      x,
      y: marginAt(x) + span(-0.045, 0.045),
      r: span(0.022, 0.072),
      load: span(0.4, 1),
      rot: span(0, TAU),
    }
  })

  return { blobs, speculars, recesses, margin }
}

function mix(a: number[], b: number[], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

function rgba(c: number[], alpha: number) {
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`
}

function softForm(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  colour: number[],
  alpha: number,
  { stretch = 1, rot = 0, core = 0.12 } = {},
) {
  if (r <= 0) return
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.scale(stretch, 1 / Math.sqrt(stretch))
  const gradient = ctx.createRadialGradient(0, 0, r * core, 0, 0, r)
  gradient.addColorStop(0, rgba(colour, alpha))
  gradient.addColorStop(0.5, rgba(colour, alpha * 0.62))
  gradient.addColorStop(0.82, rgba(colour, alpha * 0.2))
  gradient.addColorStop(1, rgba(colour, 0))
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, TAU)
  ctx.fill()
  ctx.restore()
}

/** The soft seam the recesses follow, drawn as a wide feathered band. */
function marginBand(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  field: ImagingField,
  colour: number[],
  alpha: number,
  thickness: number,
) {
  const { amp, phase, base } = field.margin
  ctx.save()
  ctx.beginPath()
  for (let i = 0; i <= 64; i += 1) {
    const t = i / 64
    const x = t * w
    const y = (base + Math.sin(t * 3.1 + phase) * amp) * h
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.strokeStyle = rgba(colour, alpha)
  ctx.lineWidth = thickness
  ctx.lineCap = 'round'
  if ('filter' in ctx) ctx.filter = `blur(${Math.round(thickness * 0.55)}px)`
  ctx.stroke()
  ctx.restore()
  if ('filter' in ctx) ctx.filter = 'none'
}

function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, colour: number[], alpha: number) {
  const gradient = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.3,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.74,
  )
  gradient.addColorStop(0, rgba(colour, 0))
  gradient.addColorStop(1, rgba(colour, alpha))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
}

// Pearl and bone, cooled off. Warm enough to be tissue, never flesh.
const SOFT_DEEP = [150, 136, 130]
const SOFT_LIGHT = [232, 224, 213]
const ENAMEL = [252, 250, 245]

/** What an ordinary camera sees: even, soft, and unremarkable. */
export function drawVisible(ctx: CanvasRenderingContext2D, w: number, h: number, field: ImagingField) {
  const s = Math.max(w, h)

  const base = ctx.createLinearGradient(0, 0, w * 0.3, h)
  base.addColorStop(0, '#EFE9DF')
  base.addColorStop(0.5, '#DBD1C4')
  base.addColorStop(1, '#B3A79B')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  marginBand(ctx, w, h, field, [126, 110, 104], 0.3, s * 0.045)

  for (const blob of field.blobs) {
    const colour = mix(SOFT_DEEP, SOFT_LIGHT, blob.tone)
    softForm(ctx, blob.x * w, blob.y * h, blob.r * s, colour, 0.62, {
      stretch: blob.stretch,
      rot: blob.rot,
    })
  }

  // The recesses are present. In this light they are just shadow.
  for (const recess of field.recesses) {
    softForm(ctx, recess.x * w, recess.y * h, recess.r * s * 1.6, [116, 100, 94], 0.26, {
      stretch: 1.5,
      rot: recess.rot,
    })
  }

  for (const spot of field.speculars) {
    softForm(ctx, spot.x * w, spot.y * h, spot.r * s, ENAMEL, 0.85, { core: 0.02 })
  }

  vignette(ctx, w, h, [52, 42, 36], 0.4)
}

const AUTOFLUORESCENCE = [122, 232, 206]
const PORPHYRIN = [255, 88, 48]

/** The same field under 405 nm: most of it goes quiet, a little of it does not. */
export function drawFluorescence(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  field: ImagingField,
) {
  const s = Math.max(w, h)

  const base = ctx.createLinearGradient(0, 0, w * 0.3, h)
  base.addColorStop(0, '#1C1140')
  base.addColorStop(0.55, '#150C2E')
  base.addColorStop(1, '#0B0618')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = 'lighter'

  for (const blob of field.blobs) {
    if (blob.tone > 0.5) {
      // Hard surfaces answer back, cool and even.
      softForm(ctx, blob.x * w, blob.y * h, blob.r * s, AUTOFLUORESCENCE, (blob.tone - 0.5) * 0.5, {
        stretch: blob.stretch,
        rot: blob.rot,
      })
    } else {
      softForm(ctx, blob.x * w, blob.y * h, blob.r * s * 0.92, [96, 66, 196], 0.2, {
        stretch: blob.stretch,
        rot: blob.rot,
      })
    }
  }

  // And the seam, which was only shadow a moment ago, is the loudest thing here.
  for (const recess of field.recesses) {
    softForm(ctx, recess.x * w, recess.y * h, recess.r * s * 2.1, PORPHYRIN, recess.load * 0.16, {
      stretch: 1.4,
      rot: recess.rot,
    })
    softForm(ctx, recess.x * w, recess.y * h, recess.r * s * 0.78, PORPHYRIN, recess.load * 0.62, {
      stretch: 1.2,
      rot: recess.rot,
      core: 0.02,
    })
  }

  for (const spot of field.speculars) {
    softForm(ctx, spot.x * w, spot.y * h, spot.r * s * 0.9, [214, 246, 255], 0.4, { core: 0.02 })
  }

  ctx.globalCompositeOperation = 'source-over'
  vignette(ctx, w, h, [4, 2, 12], 0.62)
}

/**
 * Paint one pass into a canvas at device resolution, capped so a retina screen
 * never asks for four times the pixels it needs.
 */
export function paint(
  canvas: HTMLCanvasElement,
  mode: 'visible' | 'fluorescence',
  field: ImagingField,
) {
  const rect = canvas.getBoundingClientRect()
  if (rect.width < 2 || rect.height < 2) return

  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  const w = Math.round(rect.width * ratio)
  const h = Math.round(rect.height * ratio)

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, w, h)
  if (mode === 'visible') drawVisible(ctx, w, h, field)
  else drawFluorescence(ctx, w, h, field)
}
