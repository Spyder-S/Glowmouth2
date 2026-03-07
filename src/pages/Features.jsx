import { useRef } from "react";
import useFade from '../hooks/useFade.jsx';
import Disc from '../components/Disc.jsx';

const FEATURES = [
  { ico: "🔬", t: "AI Oral Scanning", b: "Five-angle analysis trained on surface patterns. Detects plaque-like film, gum color indicators, and enamel clarity." },
  { ico: "📊", t: "GlowScore Trends", b: "Track your 0–100 wellness score daily. Watch it climb as your routine improves." },
  { ico: "💡", t: "Personalised Tips", b: "Each scan generates 3–5 custom recommendations based on your unique indicators and history." },
  { ico: "🔒", t: "Private by Default", b: "End-to-end encrypted scans. Stored only in your account. Full deletion rights, always." },
];

const TESTIMONIALS = [
  { q: "My dentist actually commented on how much cleaner my gumline looks. The tips are genuinely useful.", who: "Sarah K. — verified user" },
  { q: "Watching my GlowScore climb from 58 to 81 over six weeks was more motivating than anything else I've tried.", who: "Marcus T. — verified user" },
  { q: "Love that it's honest — not pretending to diagnose anything, just giving me useful data to act on.", who: "Priya L. — verified user" },
];

function Features() {
  const pageRef = useRef(null);
  useFade(pageRef);

  return (
    <div ref={pageRef}>
      {/* ── FEATURES ── */}
      <section>
        <div className="wrap">
          <div className="fade">
            <span className="tag">Features</span>
            <h2>Built for<br /><em>lasting results</em></h2>
          </div>
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <div key={f.t} className="fade" style={{ transitionDelay: `${i * .09}s` }}>
                <div className="feat-ico">{f.ico}</div>
                <div className="feat-title">{f.t}</div>
                <div className="feat-body">{f.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section>
        <div className="wrap">
          <div className="fade center">
            <span className="tag">What users say</span>
            <h2>Real people,<br /><em>real results</em></h2>
          </div>
          <div className="trust-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="trust-card fade" style={{ transitionDelay: `${i * .1}s` }}>
                <div className="stars">★★★★★</div>
                <p className="trust-quote">"{t.q}"</p>
                <p className="trust-who">{t.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY ── */}
      <section>
        <div className="wrap">
          <div className="fade center">
            <span className="tag">Privacy & trust</span>
            <h2>Your data,<br /><em>your control</em></h2>
          </div>
          <div className="priv-grid fade" style={{ transitionDelay: ".12s" }}>
            {[
              { ico: "🔐", t: "End-to-End Encrypted", b: "AES-256 at rest, TLS 1.3 in transit. Nobody can access your scans but you." },
              { ico: "🚫", t: "Zero Data Selling", b: "We never sell your personal data or scan images to any third party." },
              { ico: "🗑️", t: "Full Deletion Rights", b: "Delete any scan or your entire account instantly from Settings." },
              { ico: "📋", t: "Explicit Consent", b: "All consent is versioned, timestamped, and manageable. You choose what you share." },
            ].map(p => (
              <div key={p.t} className="priv-card">
                <span className="priv-ico">{p.ico}</span>
                <div className="priv-title">{p.t}</div>
                <div className="priv-body">{p.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;