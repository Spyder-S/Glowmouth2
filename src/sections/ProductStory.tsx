import { DeviceStill } from '../components/DeviceStill'
import { Reveal } from '../components/Reveal'
import { ScanFrame } from '../components/ScanFrame'
import { useStickyProgress } from '../lib/useReveal'

const STEPS = [
  { word: 'Look.', copy: 'Capture areas of your mouth that can be difficult to see yourself.' },
  { word: 'Compare.', copy: 'Return to previous images instead of relying on memory alone.' },
  { word: 'Follow.', copy: 'Build a visual history of change over time.' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr']

export function ProductStory() {
  const { ref, progress } = useStickyProgress<HTMLDivElement>()
  const active = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2

  return (
    <section aria-labelledby="story-heading" className="relative">
      <div ref={ref} className="relative h-[300svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="shell grid w-full grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-5">
              {/* The headline is the progress indicator. No dots, no numbers. */}
              <h2 id="story-heading" className="text-display-md font-medium">
                {STEPS.map((step, i) => (
                  <span
                    key={step.word}
                    className="block"
                    style={{
                      color: i === active ? 'var(--ink)' : 'var(--ink-faint)',
                      transition: 'color 620ms cubic-bezier(0.22,0.61,0.36,1)',
                    }}
                  >
                    {step.word}
                  </span>
                ))}
              </h2>

              <div className="relative mt-8 h-[5.5rem] md:mt-11 md:h-[6rem]">
                {STEPS.map((step, i) => (
                  <p
                    key={step.word}
                    aria-hidden={i !== active}
                    className="absolute inset-x-0 top-0 max-w-measure text-lede text-ink-muted text-pretty"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform: i === active ? 'translateY(0)' : 'translateY(8px)',
                      transition:
                        'opacity 560ms cubic-bezier(0.22,0.61,0.36,1), transform 560ms cubic-bezier(0.22,0.61,0.36,1)',
                    }}
                  >
                    {step.copy}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative h-[32svh] md:col-span-6 md:col-start-7 md:h-[52svh]">
              {/* Look: the object arrives. */}
              <StepLayer shown={active === 0}>
                <div className="flex h-full items-center justify-center">
                  <div className="h-full w-[46%] max-w-[190px] md:w-[42%]">
                    <DeviceStill />
                  </div>
                </div>
              </StepLayer>

              {/* Compare: two captures, softly overlapping. */}
              <StepLayer shown={active === 1}>
                <div className="relative flex h-full items-center justify-center">
                  <ScanFrame
                    seed={41207}
                    className="absolute h-[68%] w-[62%]"
                    style={{ transform: 'translate(-9%, -7%) rotate(-1.4deg)', opacity: 0.55 }}
                  />
                  <ScanFrame
                    seed={90318}
                    className="absolute h-[68%] w-[62%]"
                    style={{ transform: 'translate(9%, 7%) rotate(1.1deg)' }}
                  />
                </div>
              </StepLayer>

              {/* Follow: the interval rule again, marked out in months. */}
              <StepLayer shown={active === 2}>
                <div className="flex h-full items-center">
                  <div className="w-full">
                    <div className="mb-5 flex items-end justify-between">
                      {MONTHS.map((month, i) => (
                        <span
                          key={month}
                          className="block h-1.5 w-1.5 rounded-full"
                          style={{
                            background: 'var(--violet)',
                            opacity: active === 2 ? 1 : 0,
                            transform: active === 2 ? 'scale(1)' : 'scale(0.4)',
                            transition: `opacity 500ms ${180 + i * 130}ms, transform 500ms ${180 + i * 130}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="interval-rule" />
                    <div className="mt-4 flex items-baseline justify-between">
                      {MONTHS.map((month) => (
                        <span key={month} className="label">
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StepLayer>
            </div>
          </div>
        </div>
      </div>

      {/* Kept small on purpose. It is a direction, not a feature. */}
      <div className="shell pt-[10vh] md:pt-[14vh]">
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-6 md:col-start-7">
            <Reveal as="p" className="label" y={10}>
              Looking ahead
            </Reveal>
            <Reveal as="p" delay={0.08} className="mt-6 max-w-measure text-body text-ink-muted text-pretty">
              We're also exploring ways to turn complex imaging information into simpler signals that
              are easier to follow over time.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function StepLayer({ shown, children }: { shown: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.985)',
        transition:
          'opacity 620ms cubic-bezier(0.22,0.61,0.36,1), transform 620ms cubic-bezier(0.22,0.61,0.36,1)',
        pointerEvents: shown ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  )
}
