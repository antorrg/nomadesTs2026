import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/user';
import Loading from '../components/Loading'


interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        //return <div>Cargando...</div>; // O un spinner
        return <Loading />
    }

    if (!isAuthenticated) {
        // Redirigir al login pero guardando la ubicación actual
        return <Navigate to="/ingresar" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Si no tiene el rol permitido, redirigir a una página de acceso denegado o al inicio
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
