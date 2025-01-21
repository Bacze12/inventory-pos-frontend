import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    
    // Agrega un console.log para debuggear
    console.log('User state:', user);

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;