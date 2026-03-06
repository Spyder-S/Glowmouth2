import { useEffect, useRef } from "react";

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

function Pricing() {
  const pageRef = useRef(null);
  useFade(pageRef);

  return (
    <div ref={pageRef}>
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
                <button className={`price-btn ${p.btn}`} onClick={() => alert("Signup modal")}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;