import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

const ProtectedRoute = ({ requiredRoles = [] }: ProtectedRouteProps) => {
  const { isLoggedIn, roles, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading spinner while checking auth status
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-10 w-10 text-emerald-600" />
      </div>
    );
  }

  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some((role) => roles.includes(role));

  if (!isLoggedIn || !hasRequiredRole) {
    // Redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
