import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, checkingAuth, loading} = useUserStore();

  if (checkingAuth || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute