import { Reveal } from '../components/Reveal'

const HABITS = ['We brush every day.', 'We floss.', 'We notice sensitivity.', 'We wonder about that spot.']

export function BetweenVisits() {
  return (
    <section aria-labelledby="between-heading" className="relative">
      <div className="shell pt-[20vh] md:pt-[24vh]">
        <Reveal as="p" className="label" y={10}>
          The part we rarely see.
        </Reveal>
      </div>

      <div className="shell pt-[13vh] md:pt-[15vh]">
        <div className="md:grid md:grid-cols-12">
          <Reveal className="md:col-span-8 md:col-start-5">
            <h2 id="between-heading" className="text-display-lg font-medium text-ink text-balance">
              <span className="md:block">Six months is a long time</span> not to look.
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="shell pt-[24vh] md:pt-[30vh]">
        <div className="md:grid md:grid-cols-12">
          <ul className="space-y-3 md:col-span-6 md:space-y-4">
            {HABITS.map((line, i) => (
              <Reveal as="li" key={line} delay={i * 0.08} className="text-display-sm text-ink-muted">
                {line}
              </Reveal>
            ))}
            <Reveal as="li" delay={0.5} className="text-display-sm text-ink" y={14}>
              <span className="mt-8 block md:mt-12">And usually, we wait.</span>
            </Reveal>
          </ul>
        </div>
      </div>

      {/* The interval. Two ticks, and a great deal of nothing between them. */}
      <div className="shell pt-[22vh] md:pt-[26vh]">
        <Reveal amount={0.6}>
          <div className="interval-rule" />
          <div className="mt-4 flex items-baseline justify-between">
            <span className="label">Last visit</span>
            <span className="label">Next visit</span>
          </div>
        </Reveal>
      </div>

      {/* The one number on the site. Sourced, attributed, and about visibility
          rather than outcomes. */}
      <div className="shell pt-[20vh] md:pt-[24vh]">
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-5">
            <Reveal as="p" className="label" y={10}>
              The scale of it
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-7 text-display-md font-medium text-ink text-balance">
                About 3.5 billion people live with an oral disease.
              </p>
            </Reveal>
            <Reveal as="p" delay={0.16} className="mt-7 max-w-measure text-lede text-ink-muted text-pretty">
              Close to half the world. Most of it starts small, in the places hardest to see, long
              before anyone thinks to look.
            </Reveal>
            <Reveal as="p" delay={0.24} className="mt-8 text-micro text-ink-faint">
              World Health Organization, Global Oral Health Status Report, 2022
            </Reveal>
          </div>
        </div>
      </div>

      <div className="shell pb-[6vh] pt-[20vh] md:pt-[24vh]">
        <div className="md:grid md:grid-cols-12">
          <Reveal className="md:col-span-9">
            <p className="text-display-lg font-medium text-ink text-balance">
              <span className="md:block">Your mouth doesn't wait</span> for your next appointment.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
