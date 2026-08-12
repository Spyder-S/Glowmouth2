import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { DeviceStill } from './DeviceStill'
import type { DeviceSceneProps } from './three/DeviceScene'

// The 3D module is a separate chunk. Nothing above the fold waits on it.
const DeviceScene = lazy(() => import('./three/DeviceScene'))

let webglSupport: boolean | null = null

function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    webglSupport = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/** If the renderer throws for any reason, the page keeps its object. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

type DeviceObjectProps = Omit<DeviceSceneProps, 'lowDetail' | 'still'> & {
  className?: string
}

export function DeviceObject({ className, surface = 'paper', ...sceneProps }: DeviceObjectProps) {
  const holder = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [near, setNear] = useState(false)
  const [small, setSmall] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const sync = () => setSmall(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  // Only build a renderer once the object is close to being seen.
  useEffect(() => {
    const el = holder.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const still = <DeviceStill surface={surface} />
  const canRender = near && supportsWebGL()

  return (
    <div ref={holder} className={className} aria-hidden="true">
      {canRender ? (
        <SceneBoundary fallback={still}>
          <Suspense fallback={still}>
            <DeviceScene
              {...sceneProps}
              surface={surface}
              still={Boolean(reduceMotion)}
              lowDetail={small}
            />
          </Suspense>
        </SceneBoundary>
      ) : (
        still
      )}
    </div>
  )
}
