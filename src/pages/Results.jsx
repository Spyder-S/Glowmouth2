import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getScanById } from '../services/dataService.js';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = new URLSearchParams(location.search);
  const id = query.get('id');

  useEffect(() => {
    if (!id) {
      setError('No scan ID provided');
      setLoading(false);
      return;
    }
    getScanById(id)
      .then(r => {
        setScan(r);
      })
      .catch(err => setError(err.message || 'Failed to load scan'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader">Loading results…</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (!scan) return <div className="page-error">Scan not found.</div>;

  const dateStr = new Date(scan.created_at).toLocaleString();

  return (
    <div className="results-page wrap fade">
      <h1>Scan Results</h1>
      <div className="results-card">
        <div className="score-section">
          <div className="score-num">{scan.score}</div>
          <div className="score-label">{scan.tier_label || scan.tier}</div>
          <div className="score-sub">{scan.confidence ? scan.confidence + ' confidence' : ''}</div>
          <div className="score-date">{dateStr}</div>
        </div>
        <div className="obs-section">
          <h3>Observations & Recommendations</h3>
          <ul>
            {scan.observations && scan.observations.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
        {scan.image_urls && scan.image_urls.length > 0 && (
          <div className="imgs-section">
            <h3>Captured images</h3>
            <div className="imgs-row">
              {scan.image_urls.map((u,i)=>(
                <img key={i} src={u} alt={`scan ${i+1}`} />
              ))}
            </div>
          </div>
        )}
        <p className="disclaimer">⚕ GlowMouth is for wellness screening only and is not a medical device.</p>
        <div className="results-ctas">
          <button className="btn btn-teal" onClick={() => navigate('/scan')}>New scan</button>
          <button className="btn btn-outline" onClick={() => navigate('/history')}>View history</button>
        </div>
      </div>
      <style>{`
        .results-card { margin-top:24px; padding:32px; background:var(--bg2); border:1px solid var(--teal-border); border-radius:18px; }
        .score-section { text-align:center; }
        .score-num { font-family:var(--serif); font-size:96px; color:var(--teal); }
        .score-label { font-size:20px; font-weight:600; margin-top:6px; }
        .score-sub { font-size:13px; color:var(--muted); margin-top:4px; }
        .score-date { font-size:11px; color:var(--faint); margin-top:2px; }
        .obs-section { margin-top:28px; }
        .obs-section ul { list-style:disc inside; color:var(--muted); }
        .disclaimer { font-size:11px; color:var(--faint); margin-top:20px; font-style:italic; }
        .results-ctas { display:flex; gap:16px; justify-content:center; margin-top:28px; flex-wrap:wrap; }
        .imgs-section { margin-top:24px; }
        .imgs-row { display:flex; gap:12px; flex-wrap:wrap; margin-top:12px; }
        .imgs-row img { width:100px; height:100px; object-fit:cover; border-radius:8px; }
      `}</style>
    </div>
  );
}