import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { navigate } from 'gatsby';

const LoginPage = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/account');
        } else {
            loginWithRedirect({appState: { returnTo: '/' }});
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
