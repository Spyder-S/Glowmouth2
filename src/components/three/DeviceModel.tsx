import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ─────────────────────────────────────────────────────────────────────────
 * CONCEPT VISUALISATION ONLY.
 *
 * This is a procedural stand-in for the GlowMouth device. Its shape,
 * proportions, materials and details are exploratory and not final hardware.
 *
 * To swap in a production model later, replace only the geometry section of
 * this file with a `useGLTF('/models/glowmouth.glb')` load and keep the props
 * contract below identical. Every scene on the page consumes this component
 * through the same interface, so nothing else needs to change.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type DeviceModelProps = {
  /** Violet ring illumination, 0..1. Kept low everywhere on purpose. */
  glow?: number
  /** Extra Y rotation in radians, usually driven by scroll. */
  spin?: number
  /** How much the object leans toward the pointer, 0..1. */
  pointerInfluence?: number
  /** Disables idle drift for reduced-motion readers. */
  still?: boolean
  /** Fewer segments on small screens. */
  lowDetail?: boolean
}

/**
 * Silhouette of the wand, as (radius, height) pairs. A spline runs through
 * these so the enclosure reads as one continuous surface with no hard
 * shoulders: wide enough to hold at the base, narrow at the imaging end.
 */
const PROFILE: [number, number][] = [
  [0.0, -1.34],
  [0.075, -1.322],
  [0.128, -1.262],
  [0.15, -1.1],
  [0.158, -0.75],
  [0.152, -0.3],
  [0.138, 0.15],
  [0.118, 0.55],
  [0.1, 0.82],
  [0.098, 1.0],
  [0.104, 1.1],
  [0.098, 1.19],
  [0.062, 1.25],
  [0.0, 1.268],
]

export function DeviceModel({
  glow = 0.35,
  spin = 0,
  pointerInfluence = 1,
  still = false,
  lowDetail = false,
}: DeviceModelProps) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)

  const radialSegments = lowDetail ? 40 : 96

  const bodyGeometry = useMemo(() => {
    const spline = new THREE.SplineCurve(PROFILE.map(([x, y]) => new THREE.Vector2(x, y)))
    return new THREE.LatheGeometry(spline.getPoints(lowDetail ? 56 : 120), radialSegments)
  }, [radialSegments, lowDetail])

  const materials = useMemo(() => {
    const shell = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#EFEBE3'),
      roughness: 0.44,
      metalness: 0,
      clearcoat: 0.55,
      clearcoatRoughness: 0.32,
      reflectivity: 0.35,
    })
    const lens = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0B0A0C'),
      roughness: 0.1,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      reflectivity: 0.6,
    })
    const emitter = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D9CCFF'),
      roughness: 0.3,
      metalness: 0,
      emissive: new THREE.Color('#8B5CFF'),
      emissiveIntensity: glow,
    })
    const seam = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D6D1C7'),
      roughness: 0.7,
      metalness: 0,
    })
    return { shell, lens, emitter, seam }
    // glow is applied per-frame below; it is only the initial value here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Explicit teardown. R3F disposes what it creates; these were made here.
  useEffect(() => {
    const created = materials
    return () => {
      bodyGeometry.dispose()
      created.shell.dispose()
      created.lens.dispose()
      created.emitter.dispose()
      created.seam.dispose()
    }
  }, [bodyGeometry, materials])

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return

    // Clamp so a dropped frame never produces a jump.
    const step = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime

    const idleY = still ? 0 : Math.sin(t * 0.17) * 0.07
    const idleLift = still ? 0 : Math.sin(t * 0.33) * 0.021

    const px = still ? 0 : state.pointer.x * 0.09 * pointerInfluence
    const py = still ? 0 : state.pointer.y * 0.06 * pointerInfluence

    // Everything eases toward its target rather than snapping to it.
    node.rotation.y += (spin + idleY + px - node.rotation.y) * step * 2.4
    // Positive X tips the imaging tip toward the camera, so the lens and ring read.
    node.rotation.x += (0.26 - py - node.rotation.x) * step * 2.4
    node.position.y += (idleLift - node.position.y) * step * 2.4

    if (ring.current) {
      const mat = ring.current.material as THREE.MeshStandardMaterial
      const breathe = still ? 1 : 1 + Math.sin(t * 0.8) * 0.12
      mat.emissiveIntensity += (glow * breathe - mat.emissiveIntensity) * step * 3
    }
  })

  return (
    <group ref={group} rotation={[0.26, 0, -0.32]}>
      {/* Enclosure */}
      <mesh geometry={bodyGeometry} material={materials.shell} castShadow receiveShadow />

      {/* Parting line where the two halves of the shell would meet */}
      <mesh material={materials.seam} position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1525, 0.0032, 8, lowDetail ? 40 : 88]} />
      </mesh>

      {/* Imaging ring around the tip */}
      <mesh ref={ring} material={materials.emitter} position={[0, 1.196, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.086, 0.0088, 10, lowDetail ? 40 : 80]} />
      </mesh>

      {/* Lens */}
      <mesh material={materials.lens} position={[0, 1.256, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.055, lowDetail ? 24 : 48]} />
      </mesh>
    </group>
  )
}
