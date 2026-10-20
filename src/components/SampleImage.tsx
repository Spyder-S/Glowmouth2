import { useEffect, useRef } from 'react'
import { buildField, paint } from '../lib/imagingField'

export function SampleImage({ variant = 'visible' }: { variant?: 'visible' | 'fluorescence' }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvas.current) return
    const field = buildField()
    const draw = () => { if (canvas.current) paint(canvas.current, variant, field) }
    const observer = new ResizeObserver(draw)
    observer.observe(canvas.current)
    draw()
    return () => observer.disconnect()
  }, [variant])
  return <canvas ref={canvas} className="sample-image" role="img" aria-label="Synthetic abstract surface study, not a patient image" />
}
