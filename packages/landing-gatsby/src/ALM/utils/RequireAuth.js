import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from './authProvider';
import NavigationBar from '../components/NavigationBar';

const RequireAuth = ({ component: Component, ...rest }) => {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        console.log("Checking auth status:", { isAuthenticated, isLoading });
        if (!isLoading && !isAuthenticated) {
            console.log('RequireAuth - !isLoading && !isAuthenticated')
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, isLoading]);

    console.log("RequireAuth rendering state:", { isAuthenticated, isLoading });


    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        console.log('RequireAuth - !isAuthenticated')
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
