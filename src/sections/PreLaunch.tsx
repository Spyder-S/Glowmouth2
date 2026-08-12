import { Reveal } from '../components/Reveal'

export function PreLaunch() {
  return (
    <section aria-labelledby="prelaunch-heading" className="relative">
      <div className="shell pt-[26vh] md:pt-[32vh]">
        <div className="md:grid md:grid-cols-12">
          <Reveal className="md:col-span-9">
            <h2 id="prelaunch-heading" className="text-display-lg font-medium text-ink">
              We are still building.
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="shell pt-[12vh] md:pt-[15vh]">
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-6 md:col-start-5">
            <Reveal as="p" className="max-w-measure-wide text-lede text-ink-muted text-pretty">
              GlowMouth isn't available yet. We're testing, learning, refining, and working toward
              something we believe could give people a new perspective on their oral health.
            </Reveal>

            <Reveal as="p" delay={0.12} className="mt-12 text-display-sm text-ink md:mt-16">
              Want to see where it goes?
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
