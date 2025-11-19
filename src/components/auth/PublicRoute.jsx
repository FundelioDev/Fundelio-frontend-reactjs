import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * PublicRoute Component
 * Restricts access to certain routes when user is not logged in
 * Allows only landing page and home when not authenticated
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.requiresAuth - If true, requires login to access
 */
export function PublicRoute({ children, requiresAuth = false }) {
    const { isLoggedIn } = useAuth();

    // If route requires auth but user is not logged in
    if (requiresAuth && !isLoggedIn) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}
