import { useState, useEffect, useRef } from "react";
import Orb from '../components/Orb.jsx';
import Disc from '../components/Disc.jsx';

const STEPS = [
  { n: "01", ico: "📋", t: "Checklist", b: "Verify lighting, clean device tip, brush 10 minutes prior. The app walks you through it." },
  { n: "02", ico: "📷", t: "5-angle capture", b: "Front, left, right, upper, lower. Overlay guides show you exactly where to point." },
  { n: "03", ico: "⚡", t: "Quality check", b: "Client-side blur and brightness detection flags weak frames before anything is uploaded." },
  { n: "04", ico: "🧠", t: "AI analysis", b: "Encrypted upload. Results typically arrive in 20–40 seconds with full indicator breakdown." },
];

function useFade(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    ref.current.querySelectorAll(".fade").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Home({ score }) {
  const pageRef = useRef(null);
  useFade(pageRef);

  return (
    <div ref={pageRef}>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="wrap hero-grid">
          <div>
            <div className="hero-badge">
              <span className="pulse" />
              Wellness oral intelligence
            </div>
            <h1>Your smile,<br /><em>illuminated.</em></h1>
            <p className="lead">GlowMouth uses AI-powered scanning to give you a daily wellness score — and the personalised habits to improve it.</p>
            <div className="hero-ctas">
              <button className="btn btn-teal btn-teal-lg" onClick={() => alert("Signup modal")}>Start Free Trial →</button>
              <button className="btn btn-outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>How it works</button>
            </div>
            <p className="hero-note">⚕ Not a medical device · Not for diagnosis · Wellness screening only</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Orb score={score} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="features">
        <div className="wrap">
          <div className="fade center">
            <span className="tag">How it works</span>
            <h2>Four steps to a<br /><em>better smile</em></h2>
          </div>
          <div className="steps fade" style={{ transitionDelay: ".12s" }}>
            {STEPS.map(s => (
              <div key={s.n} className="step">
                <div className="step-n">{s.n}</div>
                <div className="step-ico">{s.ico}</div>
                <div className="step-title">{s.t}</div>
                <div className="step-body">{s.b}</div>
              </div>
            ))}
          </div>
          <div className="fade center" style={{ marginTop: 30, transitionDelay: ".22s" }}>
            <Disc />
          </div>
        </div>
      </section>

      {/* ── GLOWSCORE ── */}
      <section id="glowscore">
        <div className="wrap">
          <div className="demo-wrap">
            <div className="fade">
              <span className="tag">GlowScore™</span>
              <h2>One number.<br /><em>Total clarity.</em></h2>
              <p className="lead" style={{ marginTop: 18, marginBottom: 28 }}>Your GlowScore (0–100) summarises everything seen in your scan — plaque film, gum colour, and enamel clarity — into a single motivating metric.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[["80–100","Excellent","#86efac"],["60–79","Good","var(--teal)"],["40–59","Fair","var(--gold)"],["< 40","Needs Attention","#f87171"]].map(([r,l,c]) => (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: c, minWidth: 56 }}>{r}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)" }}>{l}</span>
                  </div>
                ))}
              </div>
              <Disc />
            </div>
            <div className="demo-card fade" style={{ transitionDelay: ".18s" }}>
              <div className="demo-row">
                <span style={{ fontSize: 11, color: "var(--faint)", letterSpacing: ".08em", textTransform: "uppercase" }}>Latest Scan</span>
                <span className="demo-live">Live</span>
              </div>
              <div className="demo-score">{score}</div>
              <div className="demo-sub">GlowScore™ · High Confidence</div>
              <div className="ind-row"><span className="ind-name">🔬 Plaque-Like Film</span><span className="ind-badge low">Low</span></div>
              <div className="ind-row"><span className="ind-name">🌿 Gum Colour</span><span className="ind-badge mod">Moderate</span></div>
              <div className="ind-row"><span className="ind-name">✨ Enamel Clarity</span><span className="ind-badge low">Clear</span></div>
              <p className="demo-note">⚕ Not a medical device. Not for diagnosis. Wellness screening only.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;