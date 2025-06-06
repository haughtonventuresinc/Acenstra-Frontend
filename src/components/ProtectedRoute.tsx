import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading indicator while auth state is being determined
    // This is important to prevent a flash of the login page on refresh when already logged in
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    // Redirect to landing page (/) instead of /login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />; // Render the child route's element
};

export default ProtectedRoute;
