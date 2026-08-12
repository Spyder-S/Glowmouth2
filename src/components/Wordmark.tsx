import { useState } from 'react'

type WordmarkProps = {
  /** Colour of the text, so the nav can invert it over the dark section. */
  tone?: string
  className?: string
}

/**
 * The brand lockup: the GlowMouth mark, then the name set in the site's face.
 *
 * The mark is loaded from /logo-mark.svg. Until that file exists the name
 * stands on its own, which is why nothing here waits on an asset. Export the
 * mark by itself, without the dark tile and without the word, so it sits on the
 * warm paper background and inverts cleanly over the imaging section.
 */
export function Wordmark({ tone = 'var(--ink)', className }: WordmarkProps) {
  const [hasMark, setHasMark] = useState(true)

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      {hasMark && (
        <img
          src="/logo-mark.svg"
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
          onError={() => setHasMark(false)}
          style={{ display: 'block', height: 20, width: 'auto' }}
        />
      )}
      <span
        className="text-[0.98rem] font-medium tracking-[-0.022em]"
        style={{ color: tone, transition: 'color 500ms ease' }}
      >
        GlowMouth
      </span>
    </span>
  )
}
