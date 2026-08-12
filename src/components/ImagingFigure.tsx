import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { buildField, paint } from '../lib/imagingField'

const START = 100
const RESTING = 46

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

export function ImagingFigure() {
  const frame = useRef<HTMLDivElement>(null)
  const visibleCanvas = useRef<HTMLCanvasElement>(null)
  const fluorCanvas = useRef<HTMLCanvasElement>(null)
  const touched = useRef(false)
  const dragging = useRef(false)

  const reduceMotion = useReducedMotion()
  const [split, setSplit] = useState(START)

  const field = useMemo(() => buildField(), [])

  // Paint both passes, and repaint when the frame changes size.
  useEffect(() => {
    const el = frame.current
    if (!el) return

    const render = () => {
      if (visibleCanvas.current) paint(visibleCanvas.current, 'visible', field)
      if (fluorCanvas.current) paint(fluorCanvas.current, 'fluorescence', field)
    }

    render()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', render)
      return () => window.removeEventListener('resize', render)
    }

    const observer = new ResizeObserver(render)
    observer.observe(el)
    return () => observer.disconnect()
  }, [field])

  // Ease the divider open once, on first sight, so the effect is never missed
  // by someone who does not think to drag anything.
  useEffect(() => {
    const el = frame.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    let raf = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched.current) return
        observer.disconnect()

        if (reduceMotion) {
          setSplit(RESTING)
          return
        }

        const begin = performance.now()
        const travel = START - RESTING
        const tick = (now: number) => {
          const t = Math.min(1, (now - begin) / 1600)
          const eased = 1 - Math.pow(1 - t, 3)
          if (!touched.current) setSplit(START - travel * eased)
          if (t < 1 && !touched.current) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.45 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduceMotion])

  const positionFrom = useCallback((clientX: number) => {
    const el = frame.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    touched.current = true
    setSplit(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onHandleDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      dragging.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
      positionFrom(event.clientX)
    },
    [positionFrom],
  )

  const onHandleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return
      positionFrom(event.clientX)
    },
    [positionFrom],
  )

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  const onKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -4,
      ArrowRight: 4,
      ArrowDown: -4,
      ArrowUp: 4,
      PageDown: -12,
      PageUp: 12,
    }
    if (event.key in steps) {
      event.preventDefault()
      touched.current = true
      setSplit((value) => clamp(value + steps[event.key]))
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      touched.current = true
      setSplit(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      touched.current = true
      setSplit(100)
    }
  }, [])

  const rounded = Math.round(split)

  return (
    <figure className="m-0">
      <div
        ref={frame}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '16 / 10', borderRadius: '2px', cursor: 'ew-resize' }}
        onPointerDown={(event) => {
          // Click anywhere in the frame to move the divider there.
          if (event.target === event.currentTarget || event.currentTarget.contains(event.target as Node)) {
            if (!dragging.current) positionFrom(event.clientX)
          }
        }}
      >
        {/* The figcaption and the slider carry the meaning; the pixels are decoration. */}
        <canvas ref={visibleCanvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <canvas
          ref={fluorCanvas}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: `inset(0 0 0 ${split}%)` }}
        />

        {/* The divider itself */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px"
          style={{ left: `${split}%`, background: 'rgba(237,233,225,0.62)' }}
          aria-hidden="true"
        />

        {/* Handle: 44px of hit area, one hairline of visible weight. */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Blend between visible light and 405 nm fluorescence"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-valuetext={`${rounded}% visible light, ${100 - rounded}% fluorescence`}
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKey}
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: `${split}%`, touchAction: 'none', cursor: 'ew-resize' }}
        >
          <span
            className="block h-7 w-7 rounded-full"
            style={{
              border: '1px solid rgba(237,233,225,0.72)',
              background: 'rgba(16,15,13,0.28)',
              backdropFilter: 'blur(3px)',
            }}
          />
        </div>
      </div>

      <figcaption className="mt-5 flex items-baseline justify-between gap-4">
        <span
          className="label"
          style={{ opacity: 0.42 + 0.58 * (split / 100), transition: 'opacity 220ms linear' }}
        >
          Visible light
        </span>
        <span
          className="label"
          style={{ opacity: 0.42 + 0.58 * (1 - split / 100), transition: 'opacity 220ms linear' }}
        >
          405 nm fluorescence
        </span>
      </figcaption>
    </figure>
  )
}
