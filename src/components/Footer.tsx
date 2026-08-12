import { Wordmark } from './Wordmark'

const LINKS = [
  { label: 'About', href: '#thinking' },
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Contact', href: 'mailto:hello@glowmouth.org' },
]

export function Footer() {
  return (
    <footer className="shell pb-14 pt-[10vh] md:pb-16">
      <div className="interval-rule" />

      <div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <Wordmark />

        <nav aria-label="Footer" className="flex items-baseline gap-7">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="-my-3 flex min-h-[44px] items-center py-3 text-small text-ink-muted"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-12 max-w-measure-wide md:mt-16">
        <p className="text-micro text-ink-faint">© 2026 GlowMouth</p>
        <p className="mt-3 text-micro text-ink-faint text-pretty">
          GlowMouth is under development and is not intended to diagnose, treat, cure, or prevent
          disease or replace professional dental care.
        </p>
      </div>
    </footer>
  )
}
