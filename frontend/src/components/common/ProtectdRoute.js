import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // If authentication is still loading, show nothing
  if (loading) {
    return null;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if admin role is required but user is not admin
  if (requireAdmin && !isAdmin) {
    // Redirect to dashboard if admin access is required but user is not admin
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated and meets role requirements, render the children
  return children;
};

export default ProtectedRoute; 