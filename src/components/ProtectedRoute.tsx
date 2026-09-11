import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

const ProtectedRoute = ({ requiredRoles = [] }: ProtectedRouteProps) => {
  const { isLoggedIn, roles, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading spinner while checking auth status
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-10 w-10 text-accent-deep" />
      </div>
    );
  }

  if (!isLoggedIn) {
    // Giriş yapılmamış: hedeflenen sayfayı taşı ki girişten sonra oraya dönülebilsin.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some((role) => roles.includes(role));

  if (!hasRequiredRole) {
    // Giriş yapılmış ama yetkisiz: "from" taşımıyoruz, aksi halde girişten sonra
    // tekrar aynı yetkisiz sayfaya dönüp sonsuz döngüye girer.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
