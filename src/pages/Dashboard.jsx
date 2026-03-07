import { useAuth } from '../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import Orb from '../components/Orb.jsx';
import { calculateTrend } from '../services/scoreService.js';
import useFade from '../hooks/useFade.jsx';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    // load recent scans
    import('../services/dataService.js').then(ms => {
      ms.getScans(user.id)
        .then(r => setScans(r))
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [user, navigate]);


  useFade(pageRef);

  if (!user) return null;

  const latest = scans[0];
  const recent = scans.slice(0, 3);
  const trend = calculateTrend(scans);
  

  return (
    <div ref={pageRef} className="dashboard-page">
      <div className="wrap">
        <section className="dashboard-hero fade">
          <h1>Welcome, <em>{user.name}</em>!</h1>
          <p className="lead">Your GlowMouth dashboard is ready.</p>
        </section>

        <section className="dashboard-content fade">
          <div className="dashboard-grid">
            
            {/* Wellness Score Card */}
            <div className="card">
              <h3>📊 Your Wellness Score</h3>
              <div className="score-container">
                <Orb score={latest ? latest.score : '--'} />
              </div>
              {latest && <div className="latest-date">Last scan: {new Date(latest.created_at).toLocaleDateString()}</div>}
              {trend && (
                <div className="score-trend">
                  <small>{trend.message}</small>
                </div>
              )}
              <p className="card-desc">AI-powered daily wellness assessment based on your latest scan.</p>
              <button className="btn btn-teal" onClick={() => navigate('/scan')}>Scan Now</button>
            </div>

            {/* Recent Scans */}
            <div className="card">
              <h3>📷 Recent Scans</h3>
              <div className="scan-list">
                {loading && <p>Loading…</p>}
                {!loading && recent.length === 0 && <p>No scans yet.</p>}
                {!loading && recent.map(s => (
                  <div key={s.id} className="scan-item" onClick={() => navigate(`/results?id=${s.id}`)}>
                    <span className="scan-date">{new Date(s.created_at).toLocaleDateString()}</span>
                    <span className="scan-score">Score: {s.score}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline" onClick={() => navigate('/history')}>View All Scans</button>
            </div>

            {/* Educational Tips */}
            <div className="card">
              <h3>✨ Tips</h3>
              <ul className="habits-list">
                {latest && latest.observations && latest.observations.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
                {!latest && <li>No tips yet — take your first scan!</li>}
              </ul>
              <button className="btn btn-outline" onClick={() => navigate('/scan')}>Take a scan</button>
            </div>

            {/* Account Info */}
            <div className="card">
              <h3>👤 Account</h3>
              <div className="account-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Trial Status:</strong> 12 days remaining</p>
              </div>
              <button className="btn btn-outline" onClick={() => navigate('/pricing')}>View Plans</button>
            </div>

          </div>
        </section>

        <section className="dashboard-footer fade">
          <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
        </section>
      </div>

      <style>{`
        .dashboard-page {
          min-height: calc(100vh - 120px);
          padding: 60px 0;
        }

        .dashboard-hero {
          text-align: center;
          margin-bottom: 60px;
        }

        .dashboard-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .dashboard-hero em {
          color: var(--teal);
          font-style: normal;
          font-weight: 600;
        }

        .dashboard-content {
          margin-bottom: 40px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .card h3 {
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .score-container {
          display: flex;
          justify-content: center;
          margin: 30px 0;
          height: 200px;
        }
        .latest-date { text-align:center; color:var(--muted); font-size:0.85rem; margin-top:4px; }

        .card-desc {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .scan-list {
          margin-bottom: 24px;
        }

        .scan-item {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        .score-trend { color: var(--muted); margin-top: 6px; font-size: 0.85rem; }

        .scan-date {
          color: rgba(255, 255, 255, 0.7);
        }

        .scan-score {
          color: var(--teal);
          font-weight: 600;
        }

        .habits-list {
          list-style: none;
          margin-bottom: 24px;
        }

        .habits-list li {
          padding: 8px 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .account-info {
          margin-bottom: 24px;
        }

        .account-info p {
          margin: 12px 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .dashboard-footer {
          text-align: center;
        }

        @media (max-width: 768px) {
          .dashboard-hero h1 {
            font-size: 1.8rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
