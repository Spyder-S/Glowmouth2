import { DeviceObject } from '../components/DeviceObject'
import { Reveal } from '../components/Reveal'
import { useScrollProgress } from '../lib/useReveal'

export function FinalMoment() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <section aria-labelledby="final-heading" className="relative">
      <div
        className="shell flex flex-col items-center justify-center pb-[14vh] pt-[26vh] text-center md:pb-[18vh] md:pt-[30vh]"
        style={{ minHeight: '92svh' }}
      >
        <div ref={ref} className="h-[20svh] w-full max-w-[300px] md:h-[26svh]">
          <DeviceObject
            className="h-full w-full"
            surface="paper"
            glow={0.42}
            spin={progress * 0.5}
            zoom={0.52}
          />
        </div>

        <Reveal className="mt-[9vh] md:mt-[11vh]">
          <h2 id="final-heading" className="text-display-md font-medium text-ink text-balance">
            <span className="md:block">Your oral health.</span> In a new light.
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-10 md:mt-12">
          <a href="#waitlist" className="quiet-link group text-lede text-ink">
            Join the waitlist{' '}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-500 ease-quiet group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
