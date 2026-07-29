import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import OralHealthMap from '../../components/OralHealthMap';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const HERO_ZONES = [
  { label: 'Front', value: 92 },
  { label: 'Left', value: 68 },
  { label: 'Right', value: 84 },
  { label: 'Rear', value: 73 },
];

const steps = [
  {
    step: '01',
    title: 'Scan',
    body: 'Capture a high-fidelity oral image in seconds with a guided, low-friction workflow.',
  },
  {
    step: '02',
    title: 'Analyze',
    body: 'AI maps biological activity by region and detects early changes the eye would miss.',
  },
  {
    step: '03',
    title: 'Understand',
    body: 'See personalized interpretation, risk markers, and trend direction in one place.',
  },
];

export default function Home() {
  useDocumentTitle();
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState('idle');

  const handleWaitlistSubmit = async () => {
    if (!email || !email.includes('@')) return;
    setSubmitState('loading');
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          user_name: email,
          reply_to: email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitState('success');
      setEmail('');
    } catch (err) {
      console.error('EmailJS error:', err);
      setSubmitState('error');
    }
  };

  return (
    <>
      <Nav />

      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="eyebrow">Oral Health Intelligence</span>
              <h1>Know what&apos;s happening before symptoms appear.</h1>
              <p className="hero-sub">
                GlowMouth turns a daily scan into a single, clear score — so you can see change early and act with confidence.
              </p>
              <div className="hero-actions">
                <Link to="/pricing" className="btn btn-primary">Get Early Access</Link>
                <Link to="/how-it-works" className="btn btn-secondary">See the platform</Link>
              </div>
              <p className="hero-fine">Not a medical device. Wellness intelligence only.</p>
            </motion.div>

            <motion.div className="hero-showcase" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>
              <div className="gs-card">
                <div className="gs-card-header">
                  <div>
                    <p className="gs-score-label">Your GlowScore</p>
                    <div className="gs-numeral">84</div>
                    <div className="gs-change">↑ +3 from yesterday</div>
                  </div>
                  <span className="status-pill status-pill-live">Live</span>
                </div>
                <div className="gs-card-divider" />
                {HERO_ZONES.map((zone) => (
                  <div key={zone.label} style={{ marginBottom: 12 }}>
                    <div className="gs-bar-row">
                      <span className="gs-bar-label">{zone.label}</span>
                      <span className="gs-bar-val">{zone.value}</span>
                    </div>
                    <div className="gs-bar-track">
                      <div className="gs-bar-fill" style={{ width: `${zone.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="feat-row section-rule">
        <div className="container">
          <div className="feat-grid">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="feat-h2">Three steps. One intelligence loop.</h2>
              <div style={{ display: 'grid', gap: 16, marginTop: 22 }}>
                {steps.map((step) => (
                  <div key={step.step} className="hero-mini-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline' }}>
                      <h3>{step.title}</h3>
                      <span className="hero-mini-stat" style={{ fontSize: 24 }}>{step.step}</span>
                    </div>
                    <p style={{ marginTop: 10 }}>{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <OralHealthMap />
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <h2 className="section-h2 section-h2-lg" style={{ marginBottom: 20 }}>Know your mouth before problems begin.</h2>
          <p className="section-sub" style={{ marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            Join the waitlist and be first to experience the future of oral health intelligence.
          </p>
          {submitState !== 'success' ? (
            <div className="waitlist-form">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={submitState === 'loading'}
                className="waitlist-input"
                onKeyDown={e => e.key === 'Enter' && handleWaitlistSubmit()}
              />
              <button
                onClick={handleWaitlistSubmit}
                disabled={submitState === 'loading' || !email}
                className="waitlist-btn"
              >
                {submitState === 'loading' ? (
                  <><span className="spinner" /> Sending...</>
                ) : 'Join Waitlist'}
              </button>
            </div>
          ) : (
            <div className="waitlist-success">
              <span className="waitlist-check">✓</span>
              <span>You&apos;re on the list. We&apos;ll be in touch.</span>
            </div>
          )}

          {submitState === 'error' && (
            <p className="waitlist-error">Something went wrong. Please try again.</p>
          )}

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
            Not a medical device. For wellness awareness only.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
