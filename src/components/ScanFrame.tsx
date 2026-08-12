import { useEffect, useMemo, useRef } from 'react'
import { buildField, paint } from '../lib/imagingField'

type ScanFrameProps = {
  seed?: number
  mode?: 'visible' | 'fluorescence'
  className?: string
  style?: React.CSSProperties
}

/** A single conceptual capture. Same renderer as the imaging section. */
export function ScanFrame({ seed = 20260812, mode = 'visible', className, style }: ScanFrameProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const field = useMemo(() => buildField(seed), [seed])

  useEffect(() => {
    const el = canvas.current
    if (!el) return

    const render = () => paint(el, mode, field)
    render()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', render)
      return () => window.removeEventListener('resize', render)
    }

    const observer = new ResizeObserver(render)
    observer.observe(el)
    return () => observer.disconnect()
  }, [field, mode])

  return <canvas ref={canvas} className={className} style={style} aria-hidden="true" />
}
