type LogoMarkProps = {
  size?: number
  className?: string
}

/**
 * The GlowMouth mark: a smile, and a spark above it.
 *
 * Drawn inline rather than loaded from a file so it inherits `currentColor`.
 * That is what lets the nav render it in ink on the warm paper and flip it to
 * light over the dark imaging section without swapping assets.
 *
 * public/logo-mark.svg carries the same artwork as a standalone file for decks,
 * social avatars and anywhere outside this app.
 */
export function LogoMark({ size = 20, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block' }}
    >
      {/* The spark: four points, concave between them, so it reads as light
          rather than as a star. */}
      <path
        d="M12 4.2 Q12.85 6.95 15.6 7.8 Q12.85 8.65 12 11.4 Q11.15 8.65 8.4 7.8 Q11.15 6.95 12 4.2 Z"
        fill="currentColor"
      />
      {/* The smile. Open, unforced, and drawn with one stroke. */}
      <path
        d="M5 14.6 Q12 22.4 19 14.6"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
