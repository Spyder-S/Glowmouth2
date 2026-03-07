import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { analyzeImages } from '../services/scanService.js';
import { addScan } from '../services/dataService.js';

const STEPS = [
  { key: 'front', label: 'Front' },
  { key: 'upper', label: 'Upper' },
  { key: 'lower', label: 'Lower' },
  { key: 'left', label: 'Left' },
  { key: 'right', label: 'Right' },
];

export default function Scan() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [loadingCamera, setLoadingCamera] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [captured, setCaptured] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  useEffect(() => {
    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = s;
        setStream(s);
      } catch (err) {
        setCameraError(err.message || 'Camera permission denied or no camera available');
      } finally {
        setLoadingCamera(false);
      }
    }
    start();
    return () => {
      stream && stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  const captureStep = stepKey => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const data = canvas.toDataURL('image/jpeg');
    setCaptured(prev => ({ ...prev, [stepKey]: data }));
  };

  const handleRetake = stepKey => {
    setCaptured(prev => {
      const clone = { ...prev };
      delete clone[stepKey];
      return clone;
    });
  };

  const handleFinish = async () => {
    setAnalyzing(true);
    setAnalysisError('');
    try {
      const images = Object.values(captured);
      const result = await analyzeImages(images);
      const scanRecord = {
        user_id: user.id,
        score: result.score,
        tier: result.tier,
        tier_label: result.tierLabel,
        observations: result.observations,
        indicators: result.indicators,
        confidence: result.confidence,
        analysisTime: result.analysisTime,
        generatedAt: result.generatedAt,
        image_urls: images,
      };
      const saved = await addScan(scanRecord);
      navigate(`/results?id=${saved.id}`);
    } catch (err) {
      setAnalysisError(err.message || 'Failed to analyze scan');
    } finally {
      setAnalyzing(false);
    }
  };

  const currentStepIndex = STEPS.findIndex(s => !captured[s.key]);
  const isComplete = currentStepIndex === -1;
  const currentStep = isComplete ? null : STEPS[currentStepIndex];

  return (
    <div className="scan-page">
      <div className="wrap">
        <h1 className="fade">Oral Scan</h1>
        {loadingCamera && <p>Accessing camera…</p>}
        {cameraError && (
          <div className="error">
            <p>{cameraError}</p>
            <button className="btn btn-outline" onClick={() => {
              setCameraError('');
              setLoadingCamera(true);
              navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(s => { if (videoRef.current) videoRef.current.srcObject = s; setStream(s); })
                .catch(err => setCameraError(err.message || 'Camera permission denied or no camera available'))
                .finally(() => setLoadingCamera(false));
            }}>Retry</button>
          </div>
        )}
        {!loadingCamera && !cameraError && (
          <div className="scan-content fade">
            {!isComplete && (
              <div className="video-container">
                <video ref={videoRef} autoPlay playsInline muted />
                <div className="capture-overlay">
                  <span>{currentStep.label} view</span>
                  <button className="btn btn-teal" onClick={() => captureStep(currentStep.key)}>
                    Capture
                  </button>
                </div>
              </div>
            )}
            <div className="thumbs">
              {STEPS.map(s => (
                <div key={s.key} className="thumb">
                  {captured[s.key] ? (
                    <>
                      <img src={captured[s.key]} alt={s.label} />
                      <button onClick={() => handleRetake(s.key)} className="btn btn-ghost btn-small">
                        Retake
                      </button>
                    </>
                  ) : (
                    <span className="pending">{s.label} pending</span>
                  )}
                </div>
              ))}
            </div>
            {isComplete && (
              <div className="actions">
                {analysisError && <p className="error">{analysisError}</p>}
                <button className="btn btn-teal" onClick={handleFinish} disabled={analyzing}>
                  {analyzing ? 'Analyzing…' : 'Finish & Analyze'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        .video-container { position:relative; max-width:600px; margin:0 auto; }
        .video-container video { width:100%; border-radius:14px; background:#000; }
        .capture-overlay { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:10px; }
        .thumbs { display:flex; flex-wrap:wrap; gap:12px; margin-top:24px; justify-content:center; }
        .thumb { width:100px; text-align:center; }
        .thumb img { width:100%; border-radius:8px; }
        .thumb .pending { color:var(--muted); font-size:13px; }
        .actions { text-align:center; margin-top:20px; }
        .error { color:#ff6b6b; margin-top:12px; }
        .btn-small { padding:4px 10px; font-size:12px; }
      `}</style>
    </div>
  );
}