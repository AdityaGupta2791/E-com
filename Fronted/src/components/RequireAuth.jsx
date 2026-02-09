import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function RequireAuth({ children }) {
  const { isAuthed, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return <p className="text-sm text-slate-600">Checking session...</p>;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default RequireAuth;
