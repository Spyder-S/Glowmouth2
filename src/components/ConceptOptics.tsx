import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

/** An optical study, not a representation of manufactured GlowMouth hardware. */
function OpticalAssembly({ progress }: { progress: { current: number } }) {
  const assembly = useRef<THREE.Group>(null)
  const layers = useRef<(THREE.Group | null)[]>([])

  useFrame(({ clock }) => {
    const p = progress.current
    const separation = 1 - THREE.MathUtils.smoothstep(p, 0, .76)
    if (assembly.current) {
      assembly.current.rotation.set(-.28 + p * .18, -.48 + p * .5, -.25 + Math.sin(clock.elapsedTime * .3) * .025)
      assembly.current.position.y = Math.sin(clock.elapsedTime * .4) * .025
    }
    layers.current.forEach((layer, i) => {
      if (!layer) return
      layer.position.z = i * .13 + (i - 1.5) * separation * .92
      layer.position.y = (i - 1.5) * separation * .3
    })
  })

  return <group ref={assembly} rotation={[-.28, -.48, -.25]}>
    <group ref={el => { layers.current[0] = el }}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.14, 1.04, .7, 96]} />
        <meshPhysicalMaterial color="#1b3432" roughness={.32} metalness={.65} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0, 0, -.3 + i * .075]}>
        <torusGeometry args={[1.08, .016, 8, 96]} />
        <meshStandardMaterial color="#47605a" roughness={.3} metalness={.8} />
      </mesh>)}
    </group>
    <group ref={el => { layers.current[1] = el }}>
      <mesh><torusGeometry args={[.94, .105, 24, 96]} /><meshPhysicalMaterial color="#bfcebe" metalness={.8} roughness={.27} /></mesh>
      <mesh scale={[1, 1, .12]}><sphereGeometry args={[.88, 64, 32]} /><meshPhysicalMaterial color="#173a31" metalness={.65} roughness={.12} clearcoat={1} /></mesh>
      <mesh position={[0, 0, .08]}><torusGeometry args={[.72, .012, 8, 96]} /><meshStandardMaterial color="#93b4a0" metalness={.9} roughness={.18} /></mesh>
    </group>
    <group ref={el => { layers.current[2] = el }}>
      <mesh><torusGeometry args={[.96, .065, 24, 96]} /><meshStandardMaterial color="#1c3630" metalness={.8} roughness={.2} /></mesh>
      <mesh scale={[1, 1, .15]}><sphereGeometry args={[.9, 64, 32]} /><meshPhysicalMaterial color="#4d7968" transparent opacity={.55} metalness={.35} roughness={.08} clearcoat={1} side={THREE.DoubleSide} /></mesh>
    </group>
    <group ref={el => { layers.current[3] = el }}>
      <mesh><torusGeometry args={[1.04, .13, 32, 96]} /><meshPhysicalMaterial color="#dae1d4" roughness={.22} metalness={.55} clearcoat={1} /></mesh>
      <mesh position={[0,0,.08]}><torusGeometry args={[.94, .018, 12, 96]} /><meshStandardMaterial color="#2a6b55" metalness={.8} roughness={.2} /></mesh>
      {Array.from({length:4},(_,i)=><mesh key={i} position={[Math.cos(i*Math.PI/2)*1.04,Math.sin(i*Math.PI/2)*1.04,.13]}><sphereGeometry args={[.022,12,8]}/><meshStandardMaterial color="#172a24" metalness={.8} roughness={.3}/></mesh>)}
    </group>
  </group>
}

export default function ConceptOptics({ progress, active, onReady }: { progress: { current: number }; active: boolean; onReady: () => void }) {
  return <Canvas dpr={[1, 1.5]} frameloop={active ? 'always' : 'never'} camera={{ position: [4, 2.3, 7], fov: 37 }} gl={{ alpha: true, antialias: true }} onCreated={onReady}>
    <ambientLight intensity={.6} />
    <directionalLight position={[-3, 6, 5]} intensity={3} color="#fffdf5" />
    <directionalLight position={[4, 0, 3]} intensity={1.4} color="#c7e0c9" />
    <Environment resolution={128}>
      <Lightformer position={[-3, 4, 5]} scale={[2, 6, 1]} intensity={3} />
      <Lightformer position={[4, 1, 2]} scale={[1, 5, 1]} intensity={2} />
      <Lightformer position={[0, -3, 3]} scale={[5, 1, 1]} intensity={1} color="#a9c8ad" />
    </Environment>
    <OpticalAssembly progress={progress} />
  </Canvas>
}
