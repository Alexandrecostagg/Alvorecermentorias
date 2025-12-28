import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: JSX.Element }) {
    const { user, userProfile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-slate-900" />
                    <p className="text-slate-500 font-medium">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    // Must be logged in AND have admin role
    if (!user || !userProfile || userProfile.role !== 'admin') {
        // Redirect to homepage if they are logged in but not admin
        // Redirect to login if not logged in
        if (user) {
            return <Navigate to="/" replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
