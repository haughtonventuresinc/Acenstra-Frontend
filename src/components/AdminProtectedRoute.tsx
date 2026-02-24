import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

const AdminProtectedRoute = () => {
  const { isAdminAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
