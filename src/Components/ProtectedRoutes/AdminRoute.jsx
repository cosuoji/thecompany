import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { LoadingScreen } from "../LoadingScreen";


const AdminRoute = ({ children }) => {
    const { user, checkingAuth } = useUserStore();
    const location = useLocation();
    console.log("Auth check:", checkingAuth, "User:", user);

  
    if (checkingAuth) {
      return <LoadingScreen message="Checking admin access..." />;
    }
    
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;    }
  
    if (user.user.role !== 'admin') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  };
  
  export default AdminRoute;