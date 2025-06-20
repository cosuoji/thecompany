import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";


const AdminRoute = ({ children }) => {
    const { user, checkingAuth } = useUserStore();
    const location = useLocation();
  
    if (checkingAuth) {
      return <div>Checking Auth</div>;
    }
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;    }
  
    if (user.role !== 'admin') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  };
  
  export default AdminRoute;