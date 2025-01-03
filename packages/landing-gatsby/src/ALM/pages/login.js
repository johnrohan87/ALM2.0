import React, { useEffect } from 'react';
import { useAuth } from '../utils/authProvider';

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { targetUrl: '/account' },
      });
    }
  }, [isAuthenticated, loginWithRedirect]);

  return <p>Redirecting to login...</p>;
};

export default LoginPage;