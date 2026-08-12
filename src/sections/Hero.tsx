import { motion } from 'motion/react'
import { DeviceObject } from '../components/DeviceObject'
import { useScrollProgress } from '../lib/useReveal'

const QUIET = [0.22, 0.61, 0.36, 1] as const

const rise = {
  hidden: { opacity: 0, y: 20 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.1 + i * 0.11, ease: QUIET },
  }),
}

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLElement>()

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      <div className="shell grid min-h-[100svh] grid-cols-1 items-center gap-y-2 pb-16 pt-[104px] md:grid-cols-12 md:gap-x-8 md:pb-0 md:pt-[76px]">
        <div className="md:col-span-8 md:pr-6">
          <h1 className="text-display-xl font-medium text-ink">
            <motion.span
              className="block"
              custom={0}
              variants={rise}
              initial="hidden"
              animate="shown"
            >
              See what happens
            </motion.span>
            <motion.span
              className="block"
              custom={1}
              variants={rise}
              initial="hidden"
              animate="shown"
            >
              between visits.
            </motion.span>
          </h1>

          <motion.p
            custom={2}
            variants={rise}
            initial="hidden"
            animate="shown"
            className="mt-8 max-w-measure text-lede text-ink-muted text-pretty md:mt-10"
          >
            GlowMouth is exploring a new way to visualize and follow your oral health from home.
          </motion.p>

          <motion.div custom={3} variants={rise} initial="hidden" animate="shown" className="mt-10 md:mt-12">
            <a href="#waitlist" className="quiet-link group text-lede text-ink">
              Join the waitlist{' '}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-500 ease-quiet group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </motion.div>

          <motion.p
            custom={4}
            variants={rise}
            initial="hidden"
            animate="shown"
            className="mt-6 text-small text-ink-faint"
          >
            We're just getting started.
          </motion.p>
        </div>

        {/* The object is not in a card and not on a stage. It is simply in the room. */}
        <motion.div
          className="relative -mx-6 mt-14 h-[46svh] md:col-span-4 md:-mr-[8vw] md:ml-0 md:mt-0 md:h-[84svh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.35, ease: QUIET }}
        >
          <DeviceObject
            className="h-full w-full"
            surface="paper"
            glow={0.3}
            spin={progress * 0.55}
            zoom={1}
          />
        </motion.div>
      </div>
    </section>
  )
}
