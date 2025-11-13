import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/common/Loading';

/**
 * ProtectedRoute Component
 * Protects routes that require specific roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} props.requiredRole - Role(s) required to access the route
 * @param {string} props.redirectTo - Path to redirect if unauthorized (default: '/403')
 */
export function ProtectedRoute({
    children,
    requiredRole,
    redirectTo = '/403'
}) {
    const { user, isLoggedIn, hasRole } = useAuth();

    // Show loading while checking authentication
    if (user === undefined) {
        return <Loading />;
    }

    // Redirect to login if not logged in
    if (!isLoggedIn || !user) {
        return <Navigate to="/auth" replace />;
    }

    // Check if user has required role
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const hasRequiredRole = roles.some(role => hasRole(role));

        if (!hasRequiredRole) {
            return <Navigate to={redirectTo} replace />;
        }
    }

    return children;
}
