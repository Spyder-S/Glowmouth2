import { useState } from 'react'
import { Reveal } from '../components/Reveal'

const FOUNDERS = [
  { name: 'Anish Ranga', school: 'Deep Run High School' },
  { name: 'Raj Mirchandani', school: 'J.R. Tucker High School' },
  { name: 'Vansh Goel', school: 'J.R. Tucker High School' },
  { name: 'Anhad Sandhu', school: 'J.R. Tucker High School' },
]

export function Founders() {
  // The photograph is optional. Drop public/team.jpg in and it appears;
  // without it the section stands on the typography alone.
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <section id="founders" aria-labelledby="founders-heading" className="relative">
      <div className="shell pt-[22vh] md:pt-[26vh]">
        <Reveal as="p" className="label" y={10}>
          Who we are
        </Reveal>

        <div className="md:grid md:grid-cols-12">
          <Reveal delay={0.08} className="md:col-span-8">
            <h2 id="founders-heading" className="mt-7 text-display-lg font-medium text-ink text-balance md:mt-9">
              Four high school seniors in Virginia.
            </h2>
          </Reveal>
        </div>
      </div>

      {hasPhoto && (
        <div className="shell pt-[9vh] md:pt-[11vh]">
          <div className="md:grid md:grid-cols-12">
            {/* Right-anchored, to counterweight the left-anchored headline.
                Held near its native 656px so it is never upscaled into mush. */}
            <Reveal amount={0.15} className="md:col-span-7 md:col-start-6">
              <figure className="m-0" style={{ maxWidth: 656 }}>
                <img
                  src="/team.jpg"
                  alt="The four GlowMouth founders presenting at a podium."
                  width={656}
                  height={434}
                  loading="lazy"
                  decoding="async"
                  onError={() => setHasPhoto(false)}
                  className="w-full"
                  style={{ borderRadius: '2px', aspectRatio: '3 / 2', objectFit: 'cover' }}
                />
              </figure>
            </Reveal>
          </div>
        </div>
      )}

      <div className="shell pt-[10vh] md:pt-[13vh]">
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-6 md:col-start-3">
            <Reveal as="p" className="max-w-measure-wide text-lede text-ink-muted text-pretty">
              We are still in high school. We started GlowMouth because none of us could answer that
              question about our own mouths, and we are building it in the time between classes.
            </Reveal>
          </div>
        </div>
      </div>

      {/* The same rule that measured the gap between visits, now measuring us. */}
      <div className="shell pt-[12vh] md:pt-[15vh]">
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-10 md:col-start-3">
            <Reveal amount={0.4}>
              <div className="interval-rule" />
            </Reveal>

            <ul className="mt-8 space-y-6 md:mt-10 md:space-y-7">
              {FOUNDERS.map((person, i) => (
                <Reveal
                  as="li"
                  key={person.name}
                  delay={i * 0.07}
                  y={12}
                  className="flex flex-col gap-x-8 gap-y-1 md:flex-row md:items-baseline md:justify-between"
                >
                  <span className="text-display-sm text-ink">{person.name}</span>
                  <span className="label">{person.school}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
