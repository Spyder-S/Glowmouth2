import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function ProtectedRoute({ redirectTo = '/' }) {
  const { user, loading } = useAuth();
  if (loading) {
    // simple full-screen loader
    return <div className="page-loader">Loading...</div>;
  }
  return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
