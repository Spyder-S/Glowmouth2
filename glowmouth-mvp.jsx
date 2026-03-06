import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #07111f;
    --bg2: #0c1a2e;
    --teal: #0ef5c8;
    --teal-dim: rgba(14,245,200,0.12);
    --teal-border: rgba(14,245,200,0.18);
    --gold: #e2b96a;
    --text: #ddeaf8;
    --muted: rgba(221,234,248,0.5);
    --faint: rgba(221,234,248,0.2);
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'DM Sans', system-ui, sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--sans); background: var(--bg); color: var(--text); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  /* grain */
  body::after { content:''; position:fixed; inset:0; background:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E"); pointer-events:none; z-index:9999; }

  .wrap { max-width: 1100px; margin: 0 auto; padding: 0 28px; }

  /* NAV */
  nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:18px 0; transition: all .35s; }
  nav.stuck { background:rgba(7,17,31,.88); backdrop-filter:blur(18px); border-bottom:1px solid rgba(221,234,248,.06); padding:13px 0; }
  .nav-inner { display:flex; align-items:center; justify-content:space-between; }
  .logo { display:flex; align-items:center; gap:9px; cursor:pointer; }
  .logo-icon { width:30px; height:30px; border-radius:9px; background:linear-gradient(135deg,var(--teal),#0891b2); display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(14,245,200,.28); }
  .logo-icon svg { width:15px; height:15px; }
  .logo-name { font-family:var(--serif); font-size:19px; font-weight:600; letter-spacing:.02em; }
  .nav-links { display:flex; gap:2px; list-style:none; }
  .nav-links a { color:var(--muted); text-decoration:none; font-size:13.5px; font-weight:500; padding:7px 13px; border-radius:8px; transition:.2s; }
  .nav-links a:hover { color:var(--teal); background:var(--teal-dim); }
  .nav-right { display:flex; gap:9px; }
  .btn { font-family:var(--sans); cursor:pointer; transition:.2s; font-weight:500; letter-spacing:.01em; }
  .btn-ghost { background:none; border:1px solid var(--teal-border); color:var(--muted); padding:8px 16px; border-radius:10px; font-size:13.5px; }
  .btn-ghost:hover { border-color:var(--teal); color:var(--teal); }
  .btn-teal { background:linear-gradient(135deg,var(--teal),#0891b2); color:#07111f; border:none; padding:9px 20px; border-radius:10px; font-size:13.5px; font-weight:600; box-shadow:0 4px 18px rgba(14,245,200,.24); }
  .btn-teal:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(14,245,200,.36); }
  .btn-teal:active { transform:translateY(0); }
  .btn-teal-lg { padding:14px 32px; font-size:15px; border-radius:14px; box-shadow:0 6px 28px rgba(14,245,200,.28); }
  .btn-outline { background:none; border:1px solid var(--teal-border); color:var(--muted); padding:13px 26px; border-radius:14px; font-size:15px; }
  .btn-outline:hover { border-color:var(--teal); color:var(--teal); }

  /* SECTIONS */
  section { padding: 120px 0; }

  .tag { display:inline-block; font-size:10.5px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--teal); background:var(--teal-dim); border:1px solid var(--teal-border); padding:4px 12px; border-radius:100px; margin-bottom:18px; }
  h1,h2 { font-family:var(--serif); font-weight:300; line-height:1.06; letter-spacing:-.02em; }
  h1 { font-size:clamp(50px,6.5vw,86px); }
  h2 { font-size:clamp(36px,4.5vw,60px); }
  em { font-style:italic; color:var(--teal); }
  .lead { font-size:17px; color:var(--muted); line-height:1.72; font-weight:300; }
  .center { text-align:center; }

  /* DISCLAIMER */
  .disc { display:inline-flex; align-items:center; gap:8px; background:rgba(226,185,106,.06); border:1px solid rgba(226,185,106,.18); border-radius:10px; padding:9px 16px; font-size:11px; color:rgba(226,185,106,.7); letter-spacing:.05em; font-weight:600; }

  /* HERO */
  .hero { min-height:100vh; display:flex; align-items:center; padding:110px 0 80px; position:relative; overflow:hidden; }
  .hero-glow { position:absolute; top:20%; right:15%; width:500px; height:500px; background:radial-gradient(circle,rgba(14,245,200,.07),transparent 65%); pointer-events:none; }
  .hero-glow2 { position:absolute; bottom:10%; left:5%; width:350px; height:350px; background:radial-gradient(circle,rgba(8,145,178,.05),transparent 65%); pointer-events:none; }
  .hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .hero-badge { display:inline-flex; align-items:center; gap:8px; background:var(--teal-dim); border:1px solid var(--teal-border); border-radius:100px; padding:6px 14px; font-size:12px; font-weight:600; color:var(--teal); letter-spacing:.08em; text-transform:uppercase; margin-bottom:26px; }
  .pulse { width:7px; height:7px; background:var(--teal); border-radius:50%; animation:pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
  .hero h1 { margin-bottom:22px; }
  .hero .lead { max-width:440px; margin-bottom:38px; }
  .hero-ctas { display:flex; gap:13px; flex-wrap:wrap; margin-bottom:18px; }
  .hero-note { font-size:11px; color:var(--faint); letter-spacing:.04em; }

  /* SCORE ORB */
  .orb-wrap { position:relative; width:270px; height:270px; margin:0 auto; }
  .orb-ring { position:absolute; inset:0; border-radius:50%; border:1px solid var(--teal-border); animation:spin 18s linear infinite; }
  .orb-ring::before { content:''; position:absolute; top:-4px; left:50%; transform:translateX(-50%); width:8px; height:8px; background:var(--teal); border-radius:50%; box-shadow:0 0 14px var(--teal); }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  .orb-body { position:absolute; inset:22px; border-radius:50%; background:radial-gradient(circle at 38% 32%,rgba(14,245,200,.14),rgba(7,17,31,.92) 68%); border:1px solid rgba(14,245,200,.22); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 0 50px rgba(14,245,200,.09),inset 0 0 30px rgba(14,245,200,.04); }
  .orb-num { font-family:var(--serif); font-size:76px; font-weight:300; color:var(--teal); line-height:1; text-shadow:0 0 30px rgba(14,245,200,.45); }
  .orb-label { font-size:9.5px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--faint); margin-top:4px; }
  .orb-chip { position:absolute; background:rgba(12,26,46,.85); border:1px solid var(--teal-border); border-radius:10px; padding:8px 12px; backdrop-filter:blur(8px); }
  .orb-chip-1 { top:30px; right:-22px; }
  .orb-chip-2 { bottom:50px; left:-34px; }
  .chip-key { font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:var(--faint); }
  .chip-val { font-size:12.5px; font-weight:600; color:var(--teal); margin-top:2px; }
  .chip-val.amber { color:var(--gold); }

  /* STEPS */
  .steps { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--teal-border); border:1px solid var(--teal-border); border-radius:20px; overflow:hidden; margin-top:60px; }
  .step { padding:38px 28px; background:var(--bg2); transition:background .25s; }
  .step:hover { background:#101f36; }
  .step-n { font-size:10.5px; font-weight:600; letter-spacing:.12em; color:var(--teal); margin-bottom:16px; }
  .step-ico { font-size:26px; margin-bottom:14px; }
  .step-title { font-family:var(--serif); font-size:21px; font-weight:400; color:var(--text); margin-bottom:8px; }
  .step-body { font-size:13px; color:var(--muted); line-height:1.65; font-weight:300; }

  /* FEATURES */
  .feat-grid { display:grid; grid-template-columns:1fr 1fr; gap:50px 90px; margin-top:64px; }
  .feat-ico { width:44px; height:44px; border-radius:12px; background:var(--teal-dim); border:1px solid var(--teal-border); display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px; }
  .feat-title { font-family:var(--serif); font-size:22px; font-weight:400; color:var(--text); margin-bottom:8px; }
  .feat-body { font-size:13.5px; color:var(--muted); line-height:1.7; font-weight:300; }

  /* SCORE DEMO */
  .demo-wrap { display:grid; grid-template-columns:1fr 420px; gap:70px; align-items:center; }
  .demo-card { background:var(--bg2); border:1px solid rgba(221,234,248,.08); border-radius:22px; padding:36px; position:relative; overflow:hidden; }
  .demo-card::before { content:''; position:absolute; top:-60px; right:-60px; width:200px; height:200px; background:radial-gradient(circle,rgba(14,245,200,.07),transparent 70%); pointer-events:none; }
  .demo-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:26px; }
  .demo-live { display:flex; align-items:center; gap:6px; font-size:11px; color:var(--teal); letter-spacing:.08em; }
  .demo-live::before { content:''; width:6px; height:6px; background:var(--teal); border-radius:50%; animation:pulse 2s ease-in-out infinite; }
  .demo-score { font-family:var(--serif); font-size:96px; font-weight:300; color:var(--teal); line-height:1; text-shadow:0 0 50px rgba(14,245,200,.28); }
  .demo-sub { font-size:12px; color:var(--faint); letter-spacing:.06em; margin-bottom:26px; }
  .ind-row { display:flex; align-items:center; justify-content:space-between; padding:11px 14px; background:rgba(255,255,255,.025); border-radius:11px; border:1px solid rgba(221,234,248,.06); margin-bottom:9px; }
  .ind-name { font-size:13px; color:var(--muted); }
  .ind-badge { font-size:11.5px; font-weight:600; padding:3px 10px; border-radius:100px; }
  .low { background:rgba(134,239,172,.1); color:#86efac; }
  .mod { background:rgba(226,185,106,.1); color:var(--gold); }
  .demo-note { font-size:10px; color:var(--faint); margin-top:16px; font-style:italic; letter-spacing:.04em; }

  /* PRICING */
  .price-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--teal-border); border:1px solid var(--teal-border); border-radius:22px; overflow:hidden; margin-top:56px; }
  .price-card { padding:42px 34px; background:var(--bg2); }
  .price-card.hi { background:#0d1d30; position:relative; }
  .price-card.hi::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0,rgba(14,245,200,.06),transparent 55%); pointer-events:none; }
  .price-tag { display:inline-block; background:var(--teal); color:#07111f; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:2px 10px; border-radius:100px; margin-bottom:18px; }
  .price-name { font-family:var(--serif); font-size:26px; font-weight:300; margin-bottom:6px; }
  .price-amt { font-family:var(--serif); font-size:52px; font-weight:300; line-height:1; }
  .price-amt sup { font-size:20px; vertical-align:top; margin-top:10px; color:var(--muted); }
  .price-per { font-size:12px; color:var(--faint); letter-spacing:.06em; margin-bottom:24px; }
  .price-desc { font-size:13.5px; color:var(--muted); line-height:1.6; font-weight:300; margin-bottom:24px; }
  .price-list { list-style:none; margin-bottom:28px; display:flex; flex-direction:column; gap:9px; }
  .price-list li { font-size:13.5px; color:var(--muted); font-weight:300; display:flex; gap:9px; align-items:flex-start; }
  .price-list li::before { content:'✓'; color:var(--teal); font-size:11px; font-weight:700; margin-top:2px; flex-shrink:0; }
  .price-btn { width:100%; padding:12px; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; font-family:var(--sans); transition:.2s; }
  .price-btn-teal { background:linear-gradient(135deg,var(--teal),#0891b2); color:#07111f; border:none; box-shadow:0 4px 16px rgba(14,245,200,.22); }
  .price-btn-teal:hover { transform:translateY(-1px); }
  .price-btn-ghost { background:none; border:1px solid var(--teal-border); color:var(--muted); }
  .price-btn-ghost:hover { border-color:var(--teal); color:var(--teal); }

  /* TRUST */
  .trust-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:52px; }
  .trust-card { padding:30px; background:var(--bg2); border:1px solid rgba(221,234,248,.07); border-radius:18px; transition:transform .25s,border-color .25s; }
  .trust-card:hover { transform:translateY(-4px); border-color:var(--teal-border); }
  .stars { color:var(--gold); font-size:13px; letter-spacing:2px; margin-bottom:14px; }
  .trust-quote { font-family:var(--serif); font-size:17.5px; font-weight:300; font-style:italic; line-height:1.55; margin-bottom:16px; }
  .trust-who { font-size:11px; color:var(--faint); letter-spacing:.08em; text-transform:uppercase; }

  /* PRIVACY */
  .priv-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--teal-border); border:1px solid var(--teal-border); border-radius:20px; overflow:hidden; margin-top:48px; }
  .priv-card { padding:30px 24px; background:var(--bg2); }
  .priv-ico { font-size:26px; margin-bottom:12px; display:block; }
  .priv-title { font-family:var(--serif); font-size:19px; font-weight:400; margin-bottom:8px; }
  .priv-body { font-size:12.5px; color:var(--muted); line-height:1.65; font-weight:300; }

  /* FAQ */
  .faq-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(221,234,248,.07); border:1px solid rgba(221,234,248,.07); border-radius:20px; overflow:hidden; margin-top:48px; }
  .faq-item { padding:26px 30px; background:var(--bg2); cursor:pointer; transition:background .2s; }
  .faq-item:hover { background:#101f36; }
  .faq-q { display:flex; justify-content:space-between; gap:14px; }
  .faq-qt { font-size:14.5px; font-weight:500; line-height:1.4; }
  .faq-plus { color:var(--teal); font-size:20px; font-weight:300; flex-shrink:0; transition:transform .2s; }
  .faq-plus.open { transform:rotate(45deg); }
  .faq-ans { font-size:13px; color:var(--muted); line-height:1.7; font-weight:300; margin-top:11px; }

  /* CTA */
  .cta-sec { text-align:center; position:relative; overflow:hidden; }
  .cta-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:400px; background:radial-gradient(ellipse,rgba(14,245,200,.07),transparent 65%); pointer-events:none; }
  .cta-sec h2 { margin-bottom:18px; }
  .cta-sec .lead { max-width:460px; margin:0 auto 40px; }
  .cta-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
  .cta-note { margin-top:16px; font-size:11px; color:var(--faint); letter-spacing:.05em; }

  /* FOOTER */
  footer { border-top:1px solid rgba(221,234,248,.07); padding:56px 0 36px; }
  .ft-grid { display:grid; grid-template-columns:1.6fr 1fr 1fr 1fr; gap:52px; margin-bottom:44px; }
  .ft-desc { font-size:13px; color:var(--faint); line-height:1.72; font-weight:300; margin-top:14px; max-width:200px; }
  .ft-disc { font-size:10px; color:var(--faint); margin-top:14px; line-height:1.6; letter-spacing:.03em; }
  .ft-h { font-size:10.5px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:14px; }
  .ft-links { list-style:none; display:flex; flex-direction:column; gap:9px; }
  .ft-links a { color:var(--muted); text-decoration:none; font-size:13.5px; font-weight:300; transition:.2s; }
  .ft-links a:hover { color:var(--teal); }
  .ft-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:26px; border-top:1px solid rgba(221,234,248,.06); flex-wrap:wrap; gap:10px; }
  .ft-copy { font-size:11.5px; color:var(--faint); }
  .ft-legal { font-size:10.5px; color:var(--faint); letter-spacing:.05em; }

  /* AUTH MODAL */
  .modal-bg { position:fixed; inset:0; background:rgba(7,17,31,.85); backdrop-filter:blur(10px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal { background:var(--bg2); border:1px solid var(--teal-border); border-radius:26px; padding:44px 40px; width:100%; max-width:400px; position:relative; }
  .modal-close { position:absolute; top:18px; right:18px; background:none; border:none; color:var(--muted); font-size:22px; cursor:pointer; line-height:1; }
  .modal h3 { font-family:var(--serif); font-size:34px; font-weight:300; margin-bottom:6px; }
  .modal-sub { font-size:13.5px; color:var(--muted); font-weight:300; margin-bottom:28px; }
  .field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
  .field label { font-size:11.5px; font-weight:600; color:var(--muted); letter-spacing:.08em; text-transform:uppercase; }
  .field input { background:rgba(255,255,255,.04); border:1px solid rgba(221,234,248,.1); border-radius:11px; padding:12px 15px; color:var(--text); font-size:14px; font-family:var(--sans); outline:none; transition:.2s; }
  .field input:focus { border-color:var(--teal); }
  .modal-btn { width:100%; padding:13px; border-radius:13px; font-size:15px; font-weight:600; cursor:pointer; font-family:var(--sans); background:linear-gradient(135deg,var(--teal),#0891b2); color:#07111f; border:none; box-shadow:0 4px 18px rgba(14,245,200,.22); margin-top:6px; transition:.2s; }
  .modal-btn:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(14,245,200,.32); }
  .modal-swap { text-align:center; margin-top:20px; font-size:13px; color:var(--muted); }
  .modal-swap button { background:none; border:none; color:var(--teal); cursor:pointer; font-size:13px; font-family:var(--sans); }
  .check-row { display:flex; align-items:flex-start; gap:10px; margin-bottom:18px; }
  .check-row input { margin-top:3px; accent-color:var(--teal); }
  .check-row span { font-size:12px; color:var(--faint); line-height:1.55; }

  /* FADE */
  .fade { opacity:0; transform:translateY(22px); transition:opacity .65s ease, transform .65s ease; }
  .fade.in { opacity:1; transform:translateY(0); }

  /* RESPONSIVE */
  @media(max-width:900px) {
    .nav-links { display:none; }
    .hero-grid { grid-template-columns:1fr; gap:50px; }
    .orb-wrap { width:220px; height:220px; }
    .orb-num { font-size:62px; }
    .orb-chip { display:none; }
    .steps { grid-template-columns:1fr 1fr; }
    .feat-grid { grid-template-columns:1fr; gap:38px; }
    .demo-wrap { grid-template-columns:1fr; gap:48px; }
    .price-grid { grid-template-columns:1fr; }
    .trust-grid { grid-template-columns:1fr; }
    .priv-grid { grid-template-columns:1fr 1fr; }
    .faq-grid { grid-template-columns:1fr; }
    .ft-grid { grid-template-columns:1fr 1fr; gap:36px; }
  }
  @media(max-width:560px) {
    .wrap { padding:0 18px; }
    .steps { grid-template-columns:1fr; }
    .priv-grid { grid-template-columns:1fr; }
    .ft-grid { grid-template-columns:1fr; }
    h1 { font-size:46px; }
    h2 { font-size:34px; }
    .hero-ctas { flex-direction:column; align-items:flex-start; }
    .cta-btns { flex-direction:column; align-items:center; }
    .modal { padding:32px 24px; }
  }
`;

// ── helpers ──────────────────────────────────────────────────────────

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

function useScroll() {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return stuck;
}

// ── data ─────────────────────────────────────────────────────────────

const STEPS = [
  { n: "01", ico: "📋", t: "Checklist", b: "Verify lighting, clean device tip, brush 10 minutes prior. The app walks you through it." },
  { n: "02", ico: "📷", t: "5-angle capture", b: "Front, left, right, upper, lower. Overlay guides show you exactly where to point." },
  { n: "03", ico: "⚡", t: "Quality check", b: "Client-side blur and brightness detection flags weak frames before anything is uploaded." },
  { n: "04", ico: "🧠", t: "AI analysis", b: "Encrypted upload. Results typically arrive in 20–40 seconds with full indicator breakdown." },
];

const FEATURES = [
  { ico: "🔬", t: "AI Oral Scanning", b: "Five-angle analysis trained on surface patterns. Detects plaque-like film, gum color indicators, and enamel clarity." },
  { ico: "📊", t: "GlowScore Trends", b: "Track your 0–100 wellness score daily. Watch it climb as your routine improves." },
  { ico: "💡", t: "Personalised Tips", b: "Each scan generates 3–5 custom recommendations based on your unique indicators and history." },
  { ico: "🔒", t: "Private by Default", b: "End-to-end encrypted scans. Stored only in your account. Full deletion rights, always." },
];

const FAQS = [
  { q: "Is GlowMouth a medical device?", a: "No. GlowMouth is a wellness screening tool. GlowScore and all indicators are for awareness only — not medical diagnosis. Always consult a dentist for health concerns." },
  { q: "How accurate are the scans?", a: "Accuracy depends on image quality. Each result includes a confidence level (High / Medium / Low) so you always know how reliable your reading is." },
  { q: "Who can see my scan data?", a: "Only you. Scans are encrypted at rest and in transit. You can delete any scan or your entire account from Settings at any time." },
  { q: "Do I need the physical device?", a: "No — the app works with any smartphone camera. The GlowMouth device provides enhanced optics for higher consistency." },
  { q: "How often should I scan?", a: "3–7 times per week builds the richest trend baseline. Same time each day gives the most comparable results." },
  { q: "What's the refund policy?", a: "Subscriptions cancel anytime; access continues to end of billing period. The device has a 30-day satisfaction guarantee from delivery." },
];

const TESTIMONIALS = [
  { q: "My dentist actually commented on how much cleaner my gumline looks. The tips are genuinely useful.", who: "Sarah K. — verified user" },
  { q: "Watching my GlowScore climb from 58 to 81 over six weeks was more motivating than anything else I've tried.", who: "Marcus T. — verified user" },
  { q: "Love that it's honest — not pretending to diagnose anything, just giving me useful data to act on.", who: "Priya L. — verified user" },
];

// ── components ───────────────────────────────────────────────────────

function Logo({ onClick }) {
  return (
    <div className="logo" onClick={onClick}>
      <div className="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3C8.5 3 5 6.5 5 10.5c0 5.5 7 10.5 7 10.5s7-5 7-10.5C19 6.5 15.5 3 12 3z" />
          <circle cx="12" cy="10" r="2" fill="white" stroke="none" />
        </svg>
      </div>
      <span className="logo-name">GlowMouth</span>
    </div>
  );
}

function Disc({ style }) {
  return (
    <div className="disc" style={style}>
      <span style={{ color: "#e2b96a", fontSize: 13 }}>⚕</span>
      NOT A MEDICAL DEVICE · NOT FOR DIAGNOSIS · WELLNESS ONLY
    </div>
  );
}

function Orb({ score }) {
  return (
    <div className="orb-wrap">
      <div className="orb-ring" />
      <div className="orb-body">
        <span className="orb-num">{score}</span>
        <span className="orb-label">GlowScore™</span>
      </div>
      <div className="orb-chip orb-chip-1">
        <div className="chip-key">Enamel</div>
        <div className="chip-val">Clear ✓</div>
      </div>
      <div className="orb-chip orb-chip-2">
        <div className="chip-key">Plaque Film</div>
        <div className="chip-val amber">Moderate</div>
      </div>
    </div>
  );
}

// ── modal ─────────────────────────────────────────────────────────────

function AuthModal({ mode, onClose, onSwap }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [agreed, setAgreed] = useState(false);
  const isUp = mode === "signup";

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{isUp ? "Create account" : "Welcome back"}</h3>
        <p className="modal-sub">{isUp ? "Start your 14-day free trial — no card needed." : "Sign in to your GlowMouth account."}</p>
        {isUp && (
          <div className="field">
            <label>Name</label>
            <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        {isUp && (
          <div className="check-row">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>I agree to the Terms of Service and Privacy Policy. I understand GlowMouth is not a medical device.</span>
          </div>
        )}
        <button className="modal-btn" onClick={() => alert(`${isUp ? "Account created" : "Signed in"}! (Connect to backend to activate.)`)}>
          {isUp ? "Create Account" : "Sign In"}
        </button>
        <div className="modal-swap">
          {isUp ? "Already have an account? " : "No account yet? "}
          <button onClick={onSwap}>{isUp ? "Sign in" : "Sign up free"}</button>
        </div>
      </div>
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────

export default function App() {
  const stuck = useScroll();
  const [modal, setModal] = useState(null); // "signin" | "signup"
  const [openFaq, setOpenFaq] = useState(null);
  const [score, setScore] = useState(78);
  const pageRef = useRef(null);

  useFade(pageRef);

  // slowly drift score for demo feel
  useEffect(() => {
    const t = setInterval(() => setScore(s => Math.max(68, Math.min(90, s + (Math.random() > .5 ? 1 : -1)))), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{css}</style>

      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onSwap={() => setModal(modal === "signup" ? "signin" : "signup")}
        />
      )}

      <div ref={pageRef}>
        {/* ── NAV ── */}
        <nav className={stuck ? "stuck" : ""}>
          <div className="wrap nav-inner">
            <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            <ul className="nav-links">
              {["#features", "#glowscore", "#pricing", "#faq"].map(href => (
                <li key={href}>
                  <a href={href}>{href.slice(1).charAt(0).toUpperCase() + href.slice(2)}</a>
                </li>
              ))}
            </ul>
            <div className="nav-right">
              <button className="btn btn-ghost" onClick={() => setModal("signin")}>Sign In</button>
              <button className="btn btn-teal" onClick={() => setModal("signup")}>Get Started</button>
            </div>
          </div>
        </nav>

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
                <button className="btn btn-teal btn-teal-lg" onClick={() => setModal("signup")}>Start Free Trial →</button>
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

        {/* ── PRICING ── */}
        <section id="pricing">
          <div className="wrap">
            <div className="fade center">
              <span className="tag">Pricing</span>
              <h2>Simple,<br /><em>transparent</em></h2>
              <p className="lead" style={{ maxWidth: 400, margin: "12px auto 0" }}>14-day free trial on all plans. No credit card required. Cancel anytime.</p>
            </div>
            <div className="price-grid fade" style={{ transitionDelay: ".15s" }}>
              {[
                { name: "Monthly", amt: "10", per: "/month", desc: "For getting started with daily wellness tracking.", feats: ["Unlimited scans","30-day score history","Personalised tips","5 learning modules","Email support"], btn: "price-btn-ghost", cta: "Start Monthly Trial" },
                { tag: "Best Value", name: "Yearly", amt: "100", per: "/year", desc: "Two months free. Best for long-term tracking.", feats: ["Everything in Monthly","Full 1-year history","Advanced analytics","All learning modules","Data export","Priority support"], btn: "price-btn-teal", hi: true, cta: "Start Yearly Trial" },
                { name: "Device", amt: "49.99", per: "one-time", desc: "Smart device + 30-day trial subscription.", feats: ["GlowMouth smart device","Enhanced optic tip","30-day trial included","Setup guide","1-year warranty"], btn: "price-btn-ghost", cta: "Buy Device" },
              ].map(p => (
                <div key={p.name} className={`price-card${p.hi ? " hi" : ""}`}>
                  {p.tag && <span className="price-tag">{p.tag}</span>}
                  <div className="price-name">{p.name}</div>
                  <div className="price-amt"><sup>$</sup>{p.amt}</div>
                  <div className="price-per">{p.per}</div>
                  <p className="price-desc">{p.desc}</p>
                  <ul className="price-list">{p.feats.map(f => <li key={f}>{f}</li>)}</ul>
                  <button className={`price-btn ${p.btn}`} onClick={() => setModal("signup")}>{p.cta}</button>
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

        {/* ── FAQ ── */}
        <section id="faq">
          <div className="wrap">
            <div className="fade center">
              <span className="tag">FAQ</span>
              <h2>Questions<br /><em>answered</em></h2>
            </div>
            <div className="faq-grid fade" style={{ transitionDelay: ".12s" }}>
              {FAQS.map((f, i) => (
                <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="faq-q">
                    <span className="faq-qt">{f.q}</span>
                    <span className={`faq-plus${openFaq === i ? " open" : ""}`}>+</span>
                  </div>
                  {openFaq === i && <p className="faq-ans">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-sec">
          <div className="cta-glow" />
          <div className="wrap fade">
            <span className="tag">Get started</span>
            <h2>Start <em>glowing</em> today</h2>
            <p className="lead">Join thousands building better oral wellness habits. 14-day free trial, no card needed.</p>
            <div className="cta-btns">
              <button className="btn btn-teal btn-teal-lg" onClick={() => setModal("signup")}>Get Started Free →</button>
              <button className="btn btn-outline" onClick={() => setModal("signin")}>Sign In</button>
            </div>
            <p className="cta-note">⚕ Not a medical device · Not for diagnosis · Always consult your dentist</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <div className="wrap">
            <div className="ft-grid">
              <div>
                <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
                <p className="ft-desc">Wellness oral intelligence. Track your GlowScore. Build better habits.</p>
                <p className="ft-disc">Not a medical device.<br />Not for diagnosis.<br />Wellness screening only.</p>
              </div>
              <div>
                <p className="ft-h">Product</p>
                <ul className="ft-links">
                  {["AI Scan","GlowScore","Pricing","Device"].map(l => <li key={l}><a href="#">{l}</a></li>)}
                </ul>
              </div>
              <div>
                <p className="ft-h">Company</p>
                <ul className="ft-links">
                  {["About","FAQ","Support","Blog"].map(l => <li key={l}><a href="#">{l}</a></li>)}
                </ul>
              </div>
              <div>
                <p className="ft-h">Legal</p>
                <ul className="ft-links">
                  {["Privacy Policy","Terms of Service","Consent Policy","Cookie Policy","Refund Policy"].map(l => <li key={l}><a href="#">{l}</a></li>)}
                </ul>
              </div>
            </div>
            <div className="ft-bottom">
              <span className="ft-copy">© {new Date().getFullYear()} GlowMouth, Inc.</span>
              <span className="ft-legal">⚕ NOT A MEDICAL DEVICE · WELLNESS SCREENING ONLY</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
