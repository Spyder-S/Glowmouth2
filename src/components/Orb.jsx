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

export default Orb;