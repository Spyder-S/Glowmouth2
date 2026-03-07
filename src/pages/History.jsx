import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { getScans } from '../services/dataService.js';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    getScans(user.id)
      .then(r => setScans(r))
      .catch(err => setError(err.message || 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="page-loader">Loading history…</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="history-page wrap fade">
      <h1>Your Scan History</h1>
      {scans.length === 0 ? (
        <div className="empty-state">
          <p>No scans yet. Start by taking your first scan.</p>
          <button className="btn btn-teal" onClick={() => navigate('/scan')}>Scan now</button>
        </div>
      ) : (
        <div className="history-list">
          {scans.map(s => (
            <div
              key={s.id}
              className="history-item"
              onClick={() => navigate(`/results?id=${s.id}`)}
            >
              <div className="hist-score">{s.score}</div>
              <div className="hist-info">
                <div className="hist-tier">{s.tier_label || s.tier}</div>
                <div className="hist-date">{new Date(s.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .history-list { display:flex; flex-direction:column; gap:14px; margin-top:24px; }
        .history-item { display:flex; align-items:center; padding:18px; background:var(--bg2); border:1px solid var(--teal-border); border-radius:14px; cursor:pointer; transition:.2s; }
        .history-item:hover { background:#0d1d30; }
        .hist-score { font-family:var(--serif); font-size:32px; color:var(--teal); width:80px; text-align:center; }
        .hist-info { display:flex; flex-direction:column; gap:4px; }
        .hist-tier { font-size:15px; font-weight:600; }
        .hist-date { font-size:13px; color:var(--muted); }
        .empty-state { text-align:center; margin-top:40px; }
      `}</style>
    </div>
  );
}