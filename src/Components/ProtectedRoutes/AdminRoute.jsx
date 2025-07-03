import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { LoadingScreen } from "../LoadingScreen";


const AdminRoute = ({ children }) => {
    const { user, checkingAuth } = useUserStore();
 
     if (checkingAuth) {
      return <LoadingScreen message="Checking admin access..." />;
    }
    


    if (checkingAuth) {
      return <div className="text-center py-10">Checking admin access...</div>;
    }
    
    if (!user || user.role !== 'admin') {
      return <Navigate to="/login" />;
    }
    
    return children;
  };
  
  export default AdminRoute;