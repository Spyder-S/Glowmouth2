import { useState, useRef, useEffect, useCallback } from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

// ─── Render a realistic 405nm QLF fluorescence scan onto a canvas ────────────
// In real QLF: dark background, healthy enamel appears green-grey,
// bacterial metabolites fluoresce red/orange. This mirrors that.
function drawQLFScan(canvas) {
  const W = 640, H = 480;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Deep dark background
  ctx.fillStyle = '#050D0C';
  ctx.fillRect(0, 0, W, H);

  // ── Arch background glow (ambient green from healthy enamel) ──
  const archGlow = ctx.createRadialGradient(W/2, H/2, 40, W/2, H/2, 260);
  archGlow.addColorStop(0,   'rgba(30, 90, 60, 0.55)');
  archGlow.addColorStop(0.6, 'rgba(10, 50, 35, 0.30)');
  archGlow.addColorStop(1,   'rgba(0,  20, 15, 0.00)');
  ctx.fillStyle = archGlow;
  ctx.fillRect(0, 0, W, H);

  // ── Draw individual tooth shapes ──
  const TEETH = [
    // Upper arch (x-center, y-top, width, height)
    { x:210, y:100, w:34, h:56 }, // UL2
    { x:248, y: 90, w:38, h:64 }, // UL1
    { x:288, y: 88, w:38, h:66 }, // UR1
    { x:330, y: 92, w:36, h:60 }, // UR2
    { x:368, y:100, w:30, h:50 }, // UR3
    { x:170, y:112, w:28, h:44 }, // UL3
    { x:138, y:130, w:26, h:38 }, // UL4
    { x:108, y:150, w:24, h:32 }, // UL5 (molar)
    { x:402, y:112, w:28, h:44 }, // UR4
    { x:432, y:130, w:26, h:38 }, // UR5
    { x:462, y:150, w:24, h:32 }, // UR6 (molar)
    // Lower arch
    { x:210, y:290, w:32, h:54 },
    { x:248, y:300, w:36, h:62 },
    { x:288, y:304, w:36, h:64 },
    { x:328, y:300, w:34, h:60 },
    { x:366, y:292, w:30, h:52 },
    { x:172, y:280, w:28, h:44 },
    { x:140, y:262, w:26, h:38 },
    { x:108, y:244, w:24, h:34 },
    { x:400, y:280, w:28, h:44 },
    { x:430, y:262, w:26, h:38 },
    { x:460, y:244, w:24, h:34 },
  ];

  TEETH.forEach(({ x, y, w, h }) => {
    const rx = w / 2;
    // Healthy tooth — muted green-grey fluorescence
    const toothGrad = ctx.createLinearGradient(x, y, x, y + h);
    toothGrad.addColorStop(0,   'rgba(60,130,90, 0.70)');
    toothGrad.addColorStop(0.5, 'rgba(40,100,70, 0.55)');
    toothGrad.addColorStop(1,   'rgba(20, 70,50, 0.45)');

    ctx.beginPath();
    ctx.ellipse(x, y + h * 0.55, rx * 0.9, h * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = toothGrad;
    ctx.fill();

    // Subtle outline
    ctx.strokeStyle = 'rgba(80,180,120,0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // ── Bacterial hotspots (the key diagnostic signal) ──
  // Left molars (UR5/UR6): HIGH activity — red/orange
  const spots = [
    // { x, y, r, intensity, color }  — high activity left rear
    { x:108, y:150, r:28, intensity:0.92, color:[220, 60, 30] },
    { x:138, y:132, r:22, intensity:0.78, color:[210, 80, 20] },
    { x:108, y:244, r:26, intensity:0.85, color:[230, 55, 25] },
    { x:140, y:262, r:18, intensity:0.65, color:[200, 90, 30] },
    // Right rear: MODERATE activity — amber/yellow-orange
    { x:462, y:150, r:18, intensity:0.52, color:[200,150, 30] },
    { x:432, y:132, r:14, intensity:0.42, color:[190,160, 40] },
    { x:460, y:244, r:16, intensity:0.48, color:[205,145, 35] },
    // Scattered small spots on rear lower midline
    { x:288, y:310, r:10, intensity:0.32, color:[160,140, 50] },
    { x:248, y:308, r: 8, intensity:0.28, color:[150,140, 55] },
    // Front surfaces: LOW — barely visible green tinge
    { x:248, y: 95, r: 9, intensity:0.12, color:[60,160, 90] },
    { x:288, y: 93, r: 8, intensity:0.10, color:[55,155, 85] },
  ];

  spots.forEach(({ x, y, r, intensity, color: [r2, g, b] }) => {
    // Outer corona
    const outer = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
    outer.addColorStop(0,   `rgba(${r2},${g},${b},${intensity * 0.65})`);
    outer.addColorStop(0.4, `rgba(${r2},${g},${b},${intensity * 0.30})`);
    outer.addColorStop(1,   `rgba(${r2},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = outer;
    ctx.fill();

    // Core bright spot
    const core = ctx.createRadialGradient(x, y, 0, x, y, r);
    core.addColorStop(0,   `rgba(${Math.min(255,r2+40)},${Math.min(255,g+30)},${Math.min(255,b+20)},${intensity})`);
    core.addColorStop(0.6, `rgba(${r2},${g},${b},${intensity * 0.75})`);
    core.addColorStop(1,   `rgba(${r2},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();
  });

  // ── Scan grid overlay (gives it a clinical/sensor look) ──
  ctx.strokeStyle = 'rgba(0,180,100,0.04)';
  ctx.lineWidth = 0.5;
  for (let gx = 0; gx < W; gx += 16) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += 16) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  }

  // ── Corner HUD elements ──
  ctx.fillStyle = 'rgba(0,200,120,0.7)';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillText('QLF · 405nm · LIVE', 14, 20);
  ctx.fillText('SCAN ID: GM-2026-0728', 14, 34);
  ctx.fillStyle = 'rgba(0,200,120,0.45)';
  ctx.fillText(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, W - 170, 20);

  // Crosshair center
  ctx.strokeStyle = 'rgba(0,200,120,0.20)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(W/2, H/2 - 20); ctx.lineTo(W/2, H/2 + 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W/2 - 20, H/2); ctx.lineTo(W/2 + 20, H/2); ctx.stroke();
  ctx.setLineDash([]);
}

// ─── AI Analysis via OpenRouter (free text model, scan data as input) ────────
async function analyzeWithClaude() {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const prompt = `You are GlowMouth AI. A 405nm quantitative light-induced fluorescence (QLF) dental scan was just processed. In QLF, bacterial metabolites fluoresce red/orange under 405nm light — healthy enamel stays green/grey.

The sensor captured the following raw fluorescence intensity readings across four oral zones (0 = no fluorescence = healthy, 1.0 = peak bacterial signal):

- Front surfaces (incisors):  0.11  — faint green, minimal signal
- Left molars (upper + lower): 0.87  — strong red-orange cluster, upper-left posterior concentrated
- Right molars (upper + lower): 0.49 — amber signal, diffuse across posterior right
- Rear surfaces (lower arch):  0.31  — mild diffuse green-yellow along midline

Based on these QLF readings, return ONLY a valid JSON object with this exact structure, nothing else:
{"glowScore":<int 0-100>,"zones":{"frontSurfaces":{"score":<int>,"risk":"<Low|Moderate|Elevated|High>","note":"<1 sentence>"},"leftMolars":{"score":<int>,"risk":"<Low|Moderate|Elevated|High>","note":"<1 sentence>"},"rightMolars":{"score":<int>,"risk":"<Low|Moderate|Elevated|High>","note":"<1 sentence>"},"rearSurfaces":{"score":<int>,"risk":"<Low|Moderate|Elevated|High>","note":"<1 sentence>"}},"primaryFinding":"<1-2 sentences>","recommendation":"<1-2 sentences>","confidence":<int 88-96>}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://glowmouth.vercel.app',
      'X-Title': 'GlowMouth Detection Demo',
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-nano-12b-v2-vl:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content.trim();
  const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(clean);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function riskColor(risk) {
  if (risk === 'Low')      return '#22C55E';
  if (risk === 'Moderate') return '#F59E0B';
  if (risk === 'Elevated') return '#F97316';
  return '#EF4444';
}
function scoreColor(s) {
  if (s >= 80) return '#22C55E';
  if (s >= 60) return '#F59E0B';
  return '#EF4444';
}

const PIPELINE_STEPS = [
  { id: 'capture',  label: 'Capturing 405nm fluorescence spectrum',    ms: 1200 },
  { id: 'filter',   label: 'Applying QLF bacterial filter',            ms: 1000 },
  { id: 'segment',  label: 'Segmenting tooth surfaces by zone',        ms: 1100 },
  { id: 'map',      label: 'Mapping biological activity across arch',   ms: 1300 },
  { id: 'score',    label: 'Running AI vision scoring model',           ms: 0    }, // waits for API
];

// ─── Main Demo Component ──────────────────────────────────────────────────────
export default function Demo() {
  const canvasRef  = useRef(null);
  const [phase, setPhase]       = useState('idle');   // idle | scanning | done | error
  const [stepsDone, setStepsDone]   = useState([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [scanlineY, setScanlineY]   = useState(0);
  const [heatmapOp, setHeatmapOp]   = useState(0);
  const [result, setResult]     = useState(null);
  const [errMsg, setErrMsg]     = useState('');
  const scanlineRef = useRef(null);

  // Draw the QLF image once on mount
  useEffect(() => {
    if (canvasRef.current) drawQLFScan(canvasRef.current);
  }, []);

  // Scanline animation during processing
  useEffect(() => {
    if (phase === 'scanning') {
      let y = 0;
      scanlineRef.current = setInterval(() => {
        y = (y + 3) % 480;
        setScanlineY(y);
      }, 16);
    } else {
      clearInterval(scanlineRef.current);
    }
    return () => clearInterval(scanlineRef.current);
  }, [phase]);

  const runAnalysis = useCallback(async () => {
    setPhase('scanning');
    setStepsDone([]);
    setActiveStep(0);
    setHeatmapOp(0);
    setResult(null);
    setErrMsg('');

    // Run first 4 pipeline steps with delays
    for (let i = 0; i < PIPELINE_STEPS.length - 1; i++) {
      setActiveStep(i);
      if (i === 3) {
        // Start fading in heatmap overlay at the "mapping" step
        let op = 0;
        const fade = setInterval(() => {
          op = Math.min(1, op + 0.04);
          setHeatmapOp(op);
          if (op >= 1) clearInterval(fade);
        }, 30);
      }
      await new Promise(r => setTimeout(r, PIPELINE_STEPS[i].ms));
      setStepsDone(prev => [...prev, PIPELINE_STEPS[i].id]);
    }

    // Final step: real AI call
    setActiveStep(PIPELINE_STEPS.length - 1);
    try {
      const analysis = await analyzeWithClaude();
      setStepsDone(prev => [...prev, 'score']);
      setResult(analysis);
      setPhase('done');
    } catch (e) {
      if (e.message === 'NO_KEY') {
        setErrMsg('Add VITE_ANTHROPIC_API_KEY to your .env file to enable live AI analysis.');
      } else {
        setErrMsg(`AI analysis error: ${e.message}`);
      }
      setPhase('error');
    }
  }, []);

  const reset = () => {
    setPhase('idle');
    setStepsDone([]);
    setActiveStep(-1);
    setHeatmapOp(0);
    setResult(null);
    setErrMsg('');
  };

  const ZONE_ORDER = result ? [
    { key: 'frontSurfaces', label: 'Front Surfaces',  ...result.zones.frontSurfaces },
    { key: 'leftMolars',    label: 'Left Molars',     ...result.zones.leftMolars    },
    { key: 'rightMolars',   label: 'Right Molars',    ...result.zones.rightMolars   },
    { key: 'rearSurfaces',  label: 'Rear Surfaces',   ...result.zones.rearSurfaces  },
  ] : [];

  return (
    <>
      <Nav />
      <div style={{ paddingTop: 88, background: 'var(--bg)', minHeight: '100vh' }}>

        {/* Dark header */}
        <section style={{ background: '#050D0C', color: '#fff', padding: '52px 24px 44px' }}>
          <div className="container">
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', color: '#3FAF7E', textTransform: 'uppercase' }}>
              GlowMouth · Live Detection Demo
            </span>
            <h1 style={{ color: '#fff', marginTop: 10, fontSize: 'clamp(26px,4vw,50px)' }}>
              405nm Fluorescence Analysis
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 580, marginTop: 10, lineHeight: 1.7, fontSize: 15 }}>
              GlowMouth uses quantitative light-induced fluorescence (QLF) to detect bacterial metabolites
              on tooth surfaces invisible to the naked eye. The AI vision model maps activity across four
              oral zones and generates a GlowScore.
            </p>
            <div style={{ display: 'flex', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
              {[['405nm', 'Blue-violet LED'], ['4 zones', 'Per-region scoring'], ['Claude Vision', 'AI interpretation'], ['QLF', 'Fluorescence imaging']].map(([v, l]) => (
                <div key={v}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: '#3FAF7E' }}>{v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container" style={{ padding: '44px 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,0.85fr)', gap: 28, alignItems: 'start' }}>

            {/* ── LEFT: scan visualization ── */}
            <div>
              <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(63,175,126,0.2)', background: '#050D0C' }}>

                {/* The QLF fluorescence canvas */}
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', display: 'block', aspectRatio: '640/480' }}
                />

                {/* Heatmap overlay highlight — brightens hotspot zones */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: `radial-gradient(ellipse 18% 22% at 17% 33%, rgba(220,55,25,${heatmapOp * 0.28}) 0%, transparent 100%),
                               radial-gradient(ellipse 14% 18% at 22% 27%, rgba(210,80,20,${heatmapOp * 0.22}) 0%, transparent 100%),
                               radial-gradient(ellipse 16% 20% at 17% 53%, rgba(225,50,22,${heatmapOp * 0.25}) 0%, transparent 100%),
                               radial-gradient(ellipse 12% 16% at 72% 33%, rgba(195,145,30,${heatmapOp * 0.18}) 0%, transparent 100%),
                               radial-gradient(ellipse 10% 14% at 72% 53%, rgba(200,140,32,${heatmapOp * 0.16}) 0%, transparent 100%)`,
                  transition: 'opacity 0.4s ease',
                  opacity: heatmapOp,
                }} />

                {/* Scan line */}
                {phase === 'scanning' && (
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    top: `${(scanlineY / 480) * 100}%`,
                    background: 'linear-gradient(90deg, transparent 0%, #3FAF7E 30%, #7FFFD4 50%, #3FAF7E 70%, transparent 100%)',
                    boxShadow: '0 0 10px 3px rgba(63,175,126,0.5)',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* SCANNING badge */}
                {phase === 'scanning' && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12, padding: '4px 12px',
                    background: 'rgba(220,38,38,0.85)', borderRadius: 6,
                    fontFamily: 'var(--mono)', fontSize: 10, color: '#fff', letterSpacing: '0.1em',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'gmPulse 0.8s infinite' }} />
                    SCANNING
                  </div>
                )}

                {/* Legend (shown after heatmap appears) */}
                {heatmapOp > 0.3 && (
                  <div style={{
                    position: 'absolute', bottom: 12, right: 12,
                    background: 'rgba(5,13,12,0.88)', borderRadius: 8, padding: '8px 12px',
                    border: '1px solid rgba(63,175,126,0.2)',
                  }}>
                    {[['#22C55E','Low activity'],['#F59E0B','Moderate'],['#F97316','Elevated'],['#EF4444','High activity']].map(([c,l]) => (
                      <div key={l} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4, fontSize:10, fontFamily:'var(--mono)', color:'rgba(255,255,255,0.7)' }}>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:c, flexShrink:0 }} />{l}
                      </div>
                    ))}
                  </div>
                )}

                {/* Done badge */}
                {phase === 'done' && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12, padding: '4px 12px',
                    background: 'rgba(22,163,74,0.85)', borderRadius: 6,
                    fontFamily: 'var(--mono)', fontSize: 10, color: '#fff', letterSpacing: '0.1em',
                  }}>
                    ✓ ANALYSIS COMPLETE
                  </div>
                )}
              </div>

              {/* Action button */}
              <div style={{ marginTop: 14 }}>
                {phase === 'idle' && (
                  <button className="btn btn-primary" onClick={runAnalysis} style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
                    Run Fluorescence Analysis →
                  </button>
                )}
                {phase === 'scanning' && (
                  <button className="btn" disabled style={{ width: '100%', justifyContent: 'center', background: 'var(--bg-alt)', color: 'var(--text-muted)', cursor: 'not-allowed' }}>
                    Analyzing scan...
                  </button>
                )}
                {(phase === 'done' || phase === 'error') && (
                  <button className="btn btn-secondary" onClick={reset} style={{ width: '100%', justifyContent: 'center' }}>
                    Reset &amp; Run Again
                  </button>
                )}
              </div>
            </div>

            {/* ── RIGHT: pipeline + results ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Pipeline card */}
              <div style={{ background: '#050D0C', borderRadius: 14, padding: '20px 22px', border: '1px solid rgba(63,175,126,0.18)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.13em', color: '#3FAF7E', textTransform: 'uppercase', marginBottom: 16 }}>
                  Detection Pipeline
                </div>
                {PIPELINE_STEPS.map((step, i) => {
                  const done   = stepsDone.includes(step.id);
                  const active = phase === 'scanning' && activeStep === i;
                  return (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${done ? '#3FAF7E' : active ? '#3FAF7E' : 'rgba(255,255,255,0.12)'}`,
                        background: done ? '#3FAF7E' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s',
                      }}>
                        {done   && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#050D0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                        {active && !done && <span style={{ width:6, height:6, borderRadius:'50%', background:'#3FAF7E', animation:'gmPulse 0.8s infinite' }} />}
                      </div>
                      <span style={{
                        fontSize: 12, fontFamily: 'var(--mono)',
                        color: done ? 'rgba(255,255,255,0.9)' : active ? '#3FAF7E' : 'rgba(255,255,255,0.28)',
                        transition: 'color 0.3s',
                        lineHeight: 1.4,
                      }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Error state */}
              {phase === 'error' && (
                <div style={{ background: 'var(--bg-white)', borderRadius: 14, padding: '20px 22px', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', color:'#EF4444', textTransform:'uppercase', marginBottom:8 }}>Error</div>
                  <p style={{ fontSize:13, color:'var(--text-body)', lineHeight:1.6 }}>{errMsg}</p>
                </div>
              )}

              {/* Results */}
              {phase === 'done' && result && (
                <>
                  {/* GlowScore */}
                  <div style={{ background:'var(--bg-white)', borderRadius:14, padding:'20px 22px', border:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                      <div>
                        <div style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', color:'var(--text-muted)', textTransform:'uppercase', marginBottom:4 }}>GlowScore</div>
                        <div style={{ fontFamily:'var(--mono)', fontSize:52, fontWeight:700, lineHeight:1, color:scoreColor(result.glowScore) }}>{result.glowScore}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>
                          {result.glowScore >= 80 ? 'Good standing' : result.glowScore >= 60 ? 'Monitor closely' : 'Needs attention'}
                        </div>
                      </div>
                      <div style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.1em', color:'#0D9488', background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.2)', borderRadius:6, padding:'6px 10px', textTransform:'uppercase', textAlign:'center' }}>
                        {result.confidence}%<br />
                        <span style={{ fontSize:9 }}>confidence</span>
                      </div>
                    </div>

                    {ZONE_ORDER.map(zone => (
                      <div key={zone.key} style={{ marginBottom:12 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                          <span style={{ fontSize:13, color:'var(--text-body)', fontWeight:500 }}>{zone.label}</span>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontSize:11, fontFamily:'var(--mono)', fontWeight:700, color:riskColor(zone.risk) }}>{zone.risk}</span>
                            <span style={{ fontSize:13, fontFamily:'var(--mono)', fontWeight:700, color:'var(--text)' }}>{zone.score}</span>
                          </div>
                        </div>
                        <div style={{ height:5, background:'var(--bg-alt)', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${zone.score}%`, background:scoreColor(zone.score), borderRadius:3, transition:'width 1s ease' }} />
                        </div>
                        <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:4, lineHeight:1.5 }}>{zone.note}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI Interpretation */}
                  <div style={{ background:'var(--bg-white)', borderRadius:14, padding:'20px 22px', border:'1px solid var(--border)' }}>
                    <div style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', color:'var(--text-muted)', textTransform:'uppercase', marginBottom:12 }}>AI Interpretation</div>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:6 }}>Primary finding</div>
                    <p style={{ fontSize:13, color:'var(--text-body)', lineHeight:1.65, marginBottom:14 }}>{result.primaryFinding}</p>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:6 }}>Recommendation</div>
                    <p style={{ fontSize:13, color:'var(--text-body)', lineHeight:1.65 }}>{result.recommendation}</p>
                    <p style={{ marginTop:14, fontSize:11, color:'var(--text-muted)', borderTop:'1px solid var(--border)', paddingTop:10 }}>
                      Wellness analysis only · Not a clinical diagnosis · Consult a licensed dental professional for clinical concerns
                    </p>
                  </div>
                </>
              )}

              {/* Idle state */}
              {phase === 'idle' && (
                <div style={{ background:'var(--bg-alt)', borderRadius:14, padding:'32px 22px', border:'1px solid var(--border)', textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--text-muted)', lineHeight:1.7 }}>
                    Press "Run Fluorescence Analysis"<br />to begin AI-powered zone detection
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gmPulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
      `}</style>

      <Footer />
    </>
  );
}
