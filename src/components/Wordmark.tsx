import { LogoMark } from './LogoMark'

type WordmarkProps = {
  /** Colour of the lockup, so the nav can invert it over the dark section. */
  tone?: string
  className?: string
}

/**
 * The brand lockup: the mark, then the name set in the site's own face.
 *
 * Both halves take their colour from `tone`, so one component serves the nav on
 * warm paper, the nav over carbon, and the footer.
 */
export function Wordmark({ tone = 'var(--ink)', className }: WordmarkProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: tone,
        transition: 'color 500ms ease',
      }}
    >
      <LogoMark size={19} />
      <span className="text-[0.98rem] font-medium tracking-[-0.022em]">GlowMouth</span>
    </span>
  )
}
