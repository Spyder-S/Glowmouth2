import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/public/Home';
import HowItWorks from './pages/public/HowItWorks';
import Science from './pages/public/Science';
import Pricing from './pages/public/Pricing';
import FAQ from './pages/public/FAQ';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import Dashboard from './pages/app/Dashboard';
import Scan from './pages/app/Scan';
import Results from './pages/app/Results';
import History from './pages/app/History';
import Progress from './pages/app/Progress';
import Insights from './pages/app/Insights';
import Reports from './pages/app/Reports';
import Settings from './pages/app/Settings';
import Upgrade from './pages/app/Upgrade';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/science" element={<Science />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected App Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
