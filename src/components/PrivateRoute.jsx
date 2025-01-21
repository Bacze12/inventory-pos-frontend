import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spinner, Center } from '@chakra-ui/react';

const PrivateRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const token = localStorage.getItem('token');
    const location = useLocation();
    const isLoading = useSelector((state) => state.auth.isLoading);

    console.log('Auth state:', { user, token, currentPath: location.pathname });

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;