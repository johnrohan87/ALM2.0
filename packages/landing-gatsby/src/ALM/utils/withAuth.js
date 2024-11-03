import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from './authProvider';

const withAuth = (Component, requireAdmin = false) => (props) => {
  const { isAuthenticated, isLoading, isLoggingOut, isAdmin, loginWithRedirect } = useAuth();
  const [initialCheckCompleted, setInitialCheckCompleted] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggingOut) {
      setInitialCheckCompleted(true);

      if (!isAuthenticated && !isLoggingOut) {
        console.log('withAuth - Redirecting to OAuth login...');
        loginWithRedirect({ appState: { targetUrl: window.location.pathname } });
      } else if (isAuthenticated && requireAdmin && !isAdmin) {
        console.log('withAuth - Redirecting to account...');
        navigate('/account');
      }
    }
  }, [isAuthenticated, isLoading, isLoggingOut, isAdmin, loginWithRedirect]);

  if (isLoading || !initialCheckCompleted) {
    return <p>Loading...</p>;
  }

  return (isAuthenticated && (!requireAdmin || isAdmin)) ? <Component {...props} /> : null;
};

export default withAuth;