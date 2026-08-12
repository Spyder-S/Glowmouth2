type DeviceStillProps = {
  surface?: 'paper' | 'carbon'
  className?: string
}

/**
 * Static stand-in for the device, drawn from the same silhouette as the 3D
 * model. Shown while the 3D module loads, when WebGL is unavailable, and
 * whenever the reader has asked for reduced motion on a small screen.
 * Concept visualisation, not final hardware.
 */
export function DeviceStill({ surface = 'paper', className }: DeviceStillProps) {
  const onCarbon = surface === 'carbon'

  return (
    <svg
      viewBox="0 0 240 420"
      className={className}
      role="img"
      aria-label="Concept rendering of the GlowMouth device: a slim handheld wand with a small imaging tip."
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`shell-${surface}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={onCarbon ? '#3B3730' : '#DCD6CA'} />
          <stop offset="32%" stopColor={onCarbon ? '#78726A' : '#FBF9F5'} />
          <stop offset="62%" stopColor={onCarbon ? '#4A4640' : '#EDE9E1'} />
          <stop offset="100%" stopColor={onCarbon ? '#232019' : '#CFC8B9'} />
        </linearGradient>

        <radialGradient id={`ground-${surface}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3A342C" stopOpacity={onCarbon ? 0 : 0.34} />
          <stop offset="100%" stopColor="#3A342C" stopOpacity="0" />
        </radialGradient>

        <filter id={`bloom-${surface}`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <ellipse cx="120" cy="388" rx="64" ry="10" fill={`url(#ground-${surface})`} />

      <g transform="rotate(-11 120 210)">
        <path
          d="M120 370.8
             C131 370.8 139 362 139 342
             C139 300 138 250 136 192
             C134.5 148 132 112 131.9 90
             C131.8 74 132 66 127 60
             C125 58.2 122.5 57.8 120 57.8
             C117.5 57.8 115 58.2 113 60
             C108 66 108.2 74 108.1 90
             C108 112 105.5 148 104 192
             C102 250 101 300 101 342
             C101 362 109 370.8 120 370.8 Z"
          fill={`url(#shell-${surface})`}
        />

        {/* Parting line */}
        <path
          d="M103.4 246 C110 248.4 130 248.4 136.6 246"
          fill="none"
          stroke={onCarbon ? '#1B1814' : '#CBC4B6'}
          strokeWidth="1.1"
        />

        {/* Imaging ring, with a whisper of bloom */}
        <ellipse
          cx="120"
          cy="67"
          rx="11"
          ry="3"
          fill="none"
          stroke="#8B5CFF"
          strokeWidth="3"
          opacity={onCarbon ? 0.55 : 0.28}
          filter={`url(#bloom-${surface})`}
        />
        <ellipse
          cx="120"
          cy="67"
          rx="11"
          ry="3"
          fill="none"
          stroke="#8B5CFF"
          strokeWidth="1.7"
          opacity={onCarbon ? 0.95 : 0.6}
        />

        {/* Lens */}
        <ellipse cx="120" cy="60.5" rx="7" ry="2.4" fill="#0B0A0C" />
      </g>
    </svg>
  )
}
