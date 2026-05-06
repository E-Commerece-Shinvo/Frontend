import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = () => {
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) {
        return null; // Or a small spinner
    }

    if (isLoggedIn) {
        return user?.role === 'admin' 
            ? <Navigate to="/admin/dashboard" replace /> 
            : <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
