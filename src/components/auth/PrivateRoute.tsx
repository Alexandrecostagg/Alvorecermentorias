import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login page, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
