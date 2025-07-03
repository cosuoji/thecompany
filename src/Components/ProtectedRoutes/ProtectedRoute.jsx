import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { LoadingScreen } from "../LoadingScreen";


const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, checkingAuth} = useUserStore();

  if (checkingAuth) {
    return <LoadingScreen message="Checking user access..." />;
  }
  

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute