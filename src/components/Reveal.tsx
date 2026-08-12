import { motion } from 'motion/react'
import type { ReactNode } from 'react'

const QUIET = [0.22, 0.61, 0.36, 1] as const

type RevealProps = {
  children: ReactNode
  delay?: number
  /** Travel distance in px. Set 0 for things that should only fade. */
  y?: number
  className?: string
  /** How much of the element must be visible before it starts. */
  amount?: number
  as?: 'div' | 'p' | 'span' | 'li' | 'h2' | 'figure'
}

/**
 * Everything on the page arrives the same way: a short rise and a fade.
 * One motion vocabulary, used everywhere, so nothing calls attention to itself.
 * MotionConfig reducedMotion="user" strips the transform for readers who ask.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  amount = 0.3,
  as = 'div',
}: RevealProps) {
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.9, delay, ease: QUIET }}
    >
      {children}
    </Tag>
  )
}
