import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const LINKS = [
  { label: 'Our thinking', href: '#thinking' },
  { label: 'Technology', href: '#technology' },
]

export function Navbar() {
  const [settled, setSettled] = useState(false)
  const [inverted, setInverted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      setSettled(window.scrollY > 24)

      // Invert to light type while the dark imaging passage sits under the bar.
      const dark = document.querySelector('[data-surface="carbon"]')
      if (!dark) return
      const rect = dark.getBoundingClientRect()
      const band = 34 // roughly the vertical centre of the bar
      setInverted(rect.top <= band && rect.bottom >= band)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Lock the page behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const tone = inverted ? 'var(--ink-inverse)' : 'var(--ink)'

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[70] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          backgroundColor: settled
            ? inverted
              ? 'rgba(16,15,13,0.72)'
              : 'rgba(245,242,236,0.72)'
            : 'transparent',
          backdropFilter: settled ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: settled ? 'blur(14px)' : 'none',
          boxShadow: settled
            ? `inset 0 -1px 0 ${inverted ? 'rgba(237,233,225,0.14)' : 'rgba(22,19,15,0.1)'}`
            : 'none',
          transition: 'background-color 500ms ease, box-shadow 500ms ease',
        }}
      >
        <nav
          aria-label="Primary"
          className="shell flex h-[68px] items-center justify-between md:h-[76px]"
        >
          <a
            href="#top"
            className="-my-3 flex min-h-[44px] items-center py-3 text-[0.98rem] font-medium tracking-[-0.022em]"
            style={{ color: tone, transition: 'color 500ms ease' }}
          >
            GlowMouth
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-small"
                style={{
                  color: inverted ? 'var(--ink-inverse-muted)' : 'var(--ink-muted)',
                  transition: 'color 500ms ease',
                }}
              >
                {link.label}
              </a>
            ))}
            <a href="#waitlist" className="quiet-link text-small" style={{ color: tone }}>
              Join the waitlist
            </a>
          </div>

          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="relative block h-[9px] w-[19px]" aria-hidden="true">
              <span
                className="absolute left-0 block h-px w-full"
                style={{
                  background: tone,
                  top: menuOpen ? 4 : 0,
                  transform: menuOpen ? 'rotate(45deg)' : 'none',
                  transition: 'transform 320ms ease, top 320ms ease',
                }}
              />
              <span
                className="absolute left-0 block h-px w-full"
                style={{
                  background: tone,
                  top: menuOpen ? 4 : 8,
                  transform: menuOpen ? 'rotate(-45deg)' : 'none',
                  transition: 'transform 320ms ease, top 320ms ease',
                }}
              />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-paper md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="shell flex h-full flex-col justify-center gap-7 pb-24">
              {[...LINKS, { label: 'Join the waitlist', href: '#waitlist' }].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-display-sm text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
