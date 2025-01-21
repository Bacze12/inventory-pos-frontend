import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner, Center } from '@chakra-ui/react';

const PrivateRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const token = localStorage.getItem('token');
    const location = useLocation();
    
    // Verificar si está cargando el estado de autenticación
    const isLoading = useSelector((state) => state.auth.isLoading);

    console.log('Auth state:', { user, token, currentPath: location.pathname });

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!user || !token) {
        // Guarda la ruta actual para redireccionar después del login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;