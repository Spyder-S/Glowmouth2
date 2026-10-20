import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SampleImage } from './components/SampleImage'
import { ProblemPage, TechnologyPage, AboutPage } from './pages/SecondaryPages'
import './prototype.css'
import { WaitlistPage } from './pages/WaitlistPage'

const ConceptOptics = lazy(() => import('./components/ConceptOptics'))
gsap.registerPlugin(ScrollTrigger)

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}


function App() {
  const page = useRef<HTMLDivElement>(null)
  const hero = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const horizontal = useRef<ScrollTrigger | null>(null)
  const [motion, setMotion] = useState(false)
  const [webgl, setWebgl] = useState(false)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(true)
  const [menu, setMenu] = useState(false)
  const [day, setDay] = useState(0)
  const route = window.location.pathname

  useEffect(() => {
    const titles: Record<string, string> = { '/problem': 'The problem', '/technology': 'Technology', '/about': 'Our team', '/early-access': 'Join the waitlist' }
    document.title = titles[route] ? `${titles[route]} | GlowMouth` : 'GlowMouth | See Your Oral Health Differently'
  }, [route])

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotion(!preference.matches)
    update()
    preference.addEventListener('change', update)
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      setWebgl(Boolean(gl))
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch { setWebgl(false) }
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!hero.current) return
    let visible = true
    const update = () => setActive(visible && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(hero.current)
    document.addEventListener('visibilitychange', update)
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      if (!motion) { progress.current = .85; return }
      mm.add('(min-width: 801px)', () => {
        progress.current = 0
        const assembly = gsap.timeline({ scrollTrigger: { trigger: '.assembly-chapter', start: 'top top', end: '+=135%', pin: true, scrub: .4, invalidateOnRefresh: true, onUpdate: self => { progress.current = self.progress } } })
        assembly.to('.hero-copy', { xPercent: -20, opacity: 0, duration: .35 }, 0)
          .to('.assembly-stage', { xPercent: -65, scale: 1.08, duration: .8 }, 0)
          .fromTo('.assembly-caption', { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: .25 }, .55)
          .to('.assembly-progress i', { scaleX: 1, duration: 1 }, 0)
        const rail = document.querySelector<HTMLElement>('.story-rail')!
        const journey = gsap.to(rail, { x: () => -(rail.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: '.journey', start: 'top 94px', end: () => '+=' + (rail.scrollWidth - innerWidth), pin: true, scrub: .65, invalidateOnRefresh: true, onUpdate: self => { gsap.set('.journey-progress i', { scaleX: self.progress }) } } })
        horizontal.current = journey.scrollTrigger ?? null
        gsap.fromTo('.comparison-frame', { rotation: -13, y: 35 }, { rotation: -7, y: 0, scrollTrigger: { trigger: '.compare-panel', containerAnimation: journey, start: 'left right', end: 'left left', scrub: true } })
        gsap.fromTo('.comparison-frame.second', { rotation: 16, y: -35 }, { rotation: 8, y: 0, scrollTrigger: { trigger: '.compare-panel', containerAnimation: journey, start: 'left right', end: 'left left', scrub: true } })
        return () => { horizontal.current = null }
      })
      mm.add('(max-width: 800px)', () => {
        progress.current = 0
        ScrollTrigger.create({ trigger: '.assembly-chapter', start: 'top top', end: 'bottom top', onUpdate: self => { progress.current = self.progress } })
      })
      gsap.fromTo('.bridge-statement span', { color: '#a8b2a4' }, { color: '#172a22', stagger: .18, scrollTrigger: { trigger: '.bridge', start: 'top 75%', end: 'bottom 75%', scrub: true } })
      gsap.to('.bridge-orbit', { rotate: 65, scrollTrigger: { trigger: '.bridge', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.closing-word', { xPercent: 8 }, { xPercent: 0, scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom bottom', scrub: true } })
      gsap.to('.scan-beam', { yPercent: 600, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, page)
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => { mm.revert(); ctx.revert(); observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [motion])

  function jumpToPanel(index: number) {
    const trigger = horizontal.current
    if (trigger) window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * index / 2, behavior: 'smooth' })
    else document.getElementById(`step-${index}`)?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' })
  }

  const links = <>{[['/', 'Home'], ['/problem', 'The problem'], ['/technology', 'Technology'], ['/about', 'About us']].map(([href, label]) => <a key={href} href={href} aria-current={route === href ? 'page' : undefined} onClick={() => setMenu(false)}>{label}</a>)}</>
  return <div ref={page} className={motion ? 'motion-on' : 'motion-off'}>
    <a className="skip" href="#main">Skip to content</a>
    <header className="navigation">
      <a href="/" className="brand" aria-label="GlowMouth home"><img src="/logo-mark.svg" alt="" />GlowMouth</a>
      <nav aria-label="Main navigation">{links}</nav>
      <a className="nav-cta" href="/early-access">Join the waitlist <span>↗</span></a>
      <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-menu">{menu ? 'Close −' : 'Menu +'}</button>
      {menu && <div className="mobile-menu" id="mobile-menu">{links}<a href="/early-access" onClick={() => setMenu(false)}>Join the waitlist ↗</a></div>}
    </header>
    {route === '/' ? <main id="main">
      <section ref={hero} className="assembly-chapter" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-label"><i /> A new perspective on oral health</p>
          <h1 id="hero-title">Your mouth.<br />A little more<br /><em>understood.</em></h1>
          <p className="hero-description">A closer look at what happens between visits.</p>
          <p className="hero-detail">We’re exploring how imaging and AI could help you follow changes in your oral health. And start better conversations about it.</p>
          <div className="hero-actions"><a className="cta" href="#experience">Explore the idea <span>↘</span></a><a className="text-link" href="/early-access">Meet what’s next ↗</a></div>
        </div>
        <div className="assembly-stage" aria-hidden="true">
          <div className={`optical-poster ${ready && motion && webgl ? 'is-ready' : ''}`}><div className="poster-disc back" /><div className="poster-disc glass" /><div className="poster-disc front" /></div>
          {motion && webgl && <SceneBoundary onError={() => { setReady(false); setWebgl(false) }}><Suspense fallback={null}><ConceptOptics progress={progress} active={active} onReady={() => setReady(true)} /></Suspense></SceneBoundary>}
        </div>
        <div className="assembly-caption"><p>Focus on the bigger picture.</p><h2>Small details.<br />More context.</h2><span>An optical study of the idea.<br />Not final device hardware.</span></div>
        <div className="assembly-bottom"><span>Optical study / Concept visualization</span><div className="assembly-progress"><span>Scroll to bring it together</span><i /></div><button onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? 'Motion on ↙' : 'Motion off ↗'}</button></div>
      </section>

      <section className="bridge" id="idea">
        <div className="bridge-orbit" aria-hidden="true"><span /><span /><span /></div>
        <p className="bridge-statement"><span>You see your dentist.</span><br /><span>Then life happens.</span><br /><span>Let’s look at the in-between.</span></p>
        <div className="bridge-bottom"><p>That’s where GlowMouth begins.</p><p>Oral health changes over time. We’re exploring a way to make those changes easier to see, follow, and talk about—with a dental professional.</p></div>
      </section>

      <section className="journey" id="experience" aria-label="Explore the envisioned experience">
        <div className="journey-bar"><span>The envisioned experience</span><div className="journey-tabs"><button onClick={() => jumpToPanel(0)}>Capture</button><button onClick={() => jumpToPanel(1)}>Compare</button><button onClick={() => jumpToPanel(2)}>Discuss</button></div><span>Scroll to explore →</span></div>
        <div className="story-rail">
          <article className="story-panel capture-panel" id="step-0"><div className="panel-copy"><span className="step-count">01 / CAPTURE</span><h2>Start with<br />a closer look.</h2><p>A guided image. A familiar angle.<br />The concept starts with making images easier to compare over time.</p><span className="concept-note">Illustrative interface. Synthetic imagery.</span></div><div className="capture-interface"><div className="interface-top"><span>GlowMouth</span><span>Image study · 01</span></div><div className="capture-view"><SampleImage /><div className="focus-bracket"/><div className="scan-beam"/><span>Keep the same perspective</span></div><div className="capture-bottom"><span>Guided capture<br /><small>Concept preview</small></span><span className="shutter" aria-hidden="true"/><span>↗</span></div></div></article>
          <article className="story-panel compare-panel" id="step-1"><div className="panel-copy"><span className="step-count">02 / COMPARE</span><h2>One image is<br />a moment.<br /><em>Two add context.</em></h2><p>The same view, brought together.<br />An exploration of how a visual history could make patterns easier to follow.</p><span className="concept-note">Illustrative samples. No analysis or diagnosis.</span></div><div className="comparison-study"><div className="comparison-frame"><SampleImage /><span>Earlier</span></div><div className="comparison-connector">↔</div><div className="comparison-frame second"><SampleImage /><span>Later</span></div><p>A consistent perspective makes comparison possible.</p></div></article>
          <article className="story-panel discuss-panel" id="step-2" onFocus={() => { if (horizontal.current) jumpToPanel(2) }}><div className="panel-copy"><span className="step-count">03 / DISCUSS</span><h2>Bring a little<br />more to the<br /><em>conversation.</em></h2><p>A visual record to return to.<br />Something to ask about at your next visit. Your dentist remains part of the picture.</p><a className="cta" href="/early-access">Join the waitlist <span>↗</span></a></div><div className="journal"><div className="journal-heading"><span>Your visual journal</span><small>ILLUSTRATIVE</small></div><h3>A little history.<br />A useful starting point.</h3><div className="journal-tabs" aria-label="Sample journal entries">{['First look', 'Next look', 'For your visit'].map((label,i)=><button key={label} aria-pressed={day===i} onClick={()=>setDay(i)}>{label}</button>)}</div><div className="journal-entry" aria-live="polite"><span className="journal-date">{['A starting point','Returning to the same view','A question worth asking'][day]}</span><p>{['Your first image creates a reference to return to.','A familiar perspective helps you put images side by side.','“Is there anything in these images we should talk about?”'][day]}</p></div><div className="journal-rule"/><p className="journal-disclaimer">A concept for continuity.<br />Not a clinical assessment.</p><span className="journal-arrow">↗</span></div></article>
        </div><div className="journey-progress"><i/></div>
      </section>
      <section className="closing"><p>Still exploring. Always looking closer.</p><h2>Better questions.<br /><em>Better conversations.</em></h2><a href="/early-access" className="cta">Join the waitlist <span>↗</span></a><span className="closing-word" aria-hidden="true">GlowMouth</span></section>
    </main> : route === '/problem' ? <ProblemPage motion={motion} /> : route === '/technology' ? <TechnologyPage motion={motion} /> : route === '/about' ? <AboutPage motion={motion} /> : <WaitlistPage />}
    <footer><a className="brand" href="/">GlowMouth</a><p>GlowMouth is an early-stage project. Illustrations and sample results are not medical advice or diagnoses. For concerns, consult a qualified dental professional.</p><nav className="footer-pages" aria-label="Footer"><a href="/problem">The problem</a><a href="/technology">Technology</a><a href="/about">About us</a>{route !== '/' && <button className="footer-motion" onClick={() => setMotion(!motion)} aria-pressed={!motion}>{motion ? 'Pause motion' : 'Enable motion'}</button>}</nav></footer>
  </div>
}
export default App
