import React, { useEffect } from 'react';
import { useAuth } from '../utils/authProvider';
import { navigate } from 'gatsby';

const LoginPage = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/account');
        } else {
            loginWithRedirect({ appState: { returnTo: '/account' } });
        }
    }, [isAuthenticated, loginWithRedirect]);

    return (
        <div>
            <h1>Logging in...</h1>
            <p>Please wait while we redirect you to the login page.</p>
        </div>
    );
};

export default LoginPage;
