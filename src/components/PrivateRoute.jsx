import React from 'react'; 
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner, Center } from '@chakra-ui/react';

const PrivateRoute = ({ children }) => {
    // Obtén el token desde el estado global de Redux
    const token = useSelector((state) => state.auth.token);
    const location = useLocation();
    const isLoading = useSelector((state) => state.auth.isLoading);

    // Muestra un spinner mientras se carga la autenticación
    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    // Si no hay token, redirige al login
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si hay token, muestra los hijos de esta ruta
    return children;
};

export default PrivateRoute;
