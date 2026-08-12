import { Reveal } from '../components/Reveal'

export function Manifesto() {
  return (
    <section id="thinking" aria-labelledby="thinking-heading" className="relative">
      <div className="shell pt-[8vh] md:pt-[10vh]">
        <Reveal as="p" className="label" y={10}>
          Why we're building it
        </Reveal>

        <div className="md:grid md:grid-cols-12">
          <Reveal delay={0.08} className="md:col-span-9">
            <h2
              id="thinking-heading"
              className="mt-7 text-display-lg font-medium text-ink text-balance md:mt-9"
            >
              <span className="md:block">Better awareness can start</span> with simply being able to see.
            </h2>
          </Reveal>
        </div>
      </div>

      {/* Indented from the headline: this is the argument, not the banner. */}
      <div className="shell pt-[13vh] md:pt-[16vh]">
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-3">
            <Reveal as="p" className="max-w-measure-wide text-display-sm text-ink text-pretty">
              Most of us know remarkably little about what is happening inside our own mouths between
              dental visits.
            </Reveal>

            <Reveal as="p" delay={0.1} className="mt-9 text-lede text-ink-muted md:mt-11">
              Not because we don't care.
            </Reveal>

            <Reveal as="p" delay={0.16} className="mt-3 text-lede text-ink-muted">
              Because we haven't had an easy way to look.
            </Reveal>

            <Reveal as="p" delay={0.1} className="mt-14 text-lede text-ink-muted md:mt-20">
              GlowMouth started with a simple question:
            </Reveal>

            <Reveal delay={0.2} className="mt-6 md:mt-8">
              <p className="text-display-md font-medium text-ink">What if we did?</p>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="shell pt-[20vh] md:pt-[24vh]">
        <div className="md:grid md:grid-cols-12">
          <Reveal className="md:col-span-8 md:col-start-3">
            <p className="max-w-measure-wide text-lede text-ink text-pretty">
              We're developing GlowMouth as an at-home oral imaging system designed to make it easier
              to capture, revisit, and eventually understand changes in your oral health over time.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
