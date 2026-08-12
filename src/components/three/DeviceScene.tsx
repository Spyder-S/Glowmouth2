import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { DeviceModel } from './DeviceModel'

export type DeviceSceneProps = {
  /** 'paper' sits the object on the cream page. 'carbon' is the dark imaging moment. */
  surface?: 'paper' | 'carbon'
  glow?: number
  spin?: number
  still?: boolean
  lowDetail?: boolean
  /** Long lens compresses the object; a lower number pushes it further away. */
  zoom?: number
  grounded?: boolean
}

export default function DeviceScene({
  surface = 'paper',
  glow = 0.35,
  spin = 0,
  still = false,
  lowDetail = false,
  zoom = 1,
  grounded = true,
}: DeviceSceneProps) {
  const onCarbon = surface === 'carbon'

  return (
    <Canvas
      // Long focal length: product photography, not a game camera.
      camera={{ fov: 26 / zoom, position: [0, 0, 7.6], near: 0.1, far: 40 }}
      dpr={[1, lowDetail ? 1.4 : 1.85]}
      gl={{ antialias: !lowDetail, alpha: true, powerPreference: 'high-performance' }}
      // Alpha canvas: the page background is the backdrop. No card, no stage.
      style={{ background: 'transparent' }}
      frameloop={still ? 'demand' : 'always'}
    >
      <ambientLight intensity={onCarbon ? 0.22 : 0.62} color={onCarbon ? '#8E86FF' : '#F5F2EC'} />

      {/* Key */}
      <directionalLight
        position={[3.2, 5, 4.2]}
        intensity={onCarbon ? 0.85 : 1.75}
        color={onCarbon ? '#CFC8FF' : '#FFFDF8'}
      />

      {/* Fill, cooled slightly so the cream shell keeps some form */}
      <directionalLight position={[-4.2, 1.1, 2.4]} intensity={onCarbon ? 0.3 : 0.52} color="#E6E2F6" />

      {/* The only violet on the object: a rim from behind and below. */}
      <pointLight
        position={[-1.4, -1.2, -2.8]}
        intensity={onCarbon ? 5.4 : 2.2}
        distance={9}
        color="#8B5CFF"
      />

      <DeviceModel glow={glow} spin={spin} still={still} lowDetail={lowDetail} />

      {grounded && !onCarbon && (
        <ContactShadows
          position={[0, -1.62, 0]}
          opacity={0.3}
          scale={6.5}
          blur={2.8}
          far={3.2}
          resolution={lowDetail ? 256 : 512}
          color="#3A342C"
        />
      )}
    </Canvas>
  )
}
