import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from './authContext';
import NavigationBar from '../components/NavigationBar';

const RequireAuth = ({ component: Component, ...rest }) => {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        console.log("Checking auth status:", { isAuthenticated, isLoading });
        if (!isLoading && !isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, isLoading]);

    console.log("RequireAuth rendering state:", { isAuthenticated, isLoading });


    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return null;
    }
    
    return isAuthenticated ? (
        <div>
            <NavigationBar />
            <Component {...rest} />
        </div>
    ) : null;
};

export default RequireAuth;
