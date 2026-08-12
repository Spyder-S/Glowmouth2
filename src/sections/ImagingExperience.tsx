import { DeviceObject } from '../components/DeviceObject'
import { ImagingFigure } from '../components/ImagingFigure'
import { Reveal } from '../components/Reveal'
import { useScrollProgress } from '../lib/useReveal'

export function ImagingExperience() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <section id="technology" aria-labelledby="technology-heading" className="on-carbon relative">
      {/* Exposure closing down. The page does not cut to dark, it dims into it. */}
      <div className="h-[34vh] w-full md:h-[40vh]" style={{ background: 'var(--ramp-in)' }} />

      <div data-surface="carbon" className="bg-carbon pb-[16vh] md:pb-[20vh]">
        {/* Following the object inside. */}
        <div ref={ref} className="shell -mt-[6vh] flex justify-center">
          <DeviceObject
            className="h-[30svh] w-full max-w-[420px] md:h-[42svh]"
            surface="carbon"
            glow={0.85}
            spin={progress * 0.7}
            zoom={0.72}
            grounded={false}
          />
        </div>

        <div className="shell pt-[10vh] md:pt-[12vh]">
          <div className="md:grid md:grid-cols-12">
            <div className="md:col-span-7">
              <Reveal as="p" className="label" y={10}>
                A different way to look.
              </Reveal>
              <Reveal delay={0.08}>
                <h2
                  id="technology-heading"
                  className="mt-7 text-display-lg font-medium text-balance"
                  style={{ color: 'var(--ink-inverse)' }}
                >
                  One view isn't always enough.
                </h2>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="shell pt-[9vh] md:pt-[11vh]">
          <Reveal amount={0.15}>
            <ImagingFigure />
          </Reveal>
        </div>

        <div className="shell pt-[9vh] md:pt-[12vh]">
          <div className="md:grid md:grid-cols-12">
            <div className="md:col-span-6 md:col-start-7">
              <Reveal as="p" className="text-lede text-pretty" >
                <span style={{ color: 'var(--ink-inverse)' }}>
                  GlowMouth is being designed to explore oral imaging from more than one perspective.
                </span>
              </Reveal>
              <Reveal as="p" delay={0.1} className="mt-7 text-body text-pretty" >
                <span style={{ color: 'var(--ink-inverse-muted)' }}>
                  Standard imaging captures what we normally see. Fluorescence-based imaging can offer
                  another visual perspective.
                </span>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* And back out into the light. */}
      <div className="h-[30vh] w-full md:h-[36vh]" style={{ background: 'var(--ramp-out)' }} />
    </section>
  )
}
