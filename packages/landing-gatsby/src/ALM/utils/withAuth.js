import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from './authProvider';

const withAuth = (Component, requireAdmin = false) => (props) => {
  const { isAuthenticated, isLoading, isLoggingOut, isAdmin } = useAuth();
  const [initialCheckCompleted, setInitialCheckCompleted] = useState(false);

  useEffect(() => {
    console.log('withAuth - Checking auth status:', { isAuthenticated, isLoading, isLoggingOut, isAdmin });

    if (!isLoading && !isLoggingOut) {
      setInitialCheckCompleted(true);

      if (!isAuthenticated) {
        console.log('withAuth - Redirecting to login...');
        navigate('/login');
      } else if (isAuthenticated && !isAdmin && requireAdmin) {
        console.log('withAuth - Redirecting to account...');
        navigate('/account');
      }
    }
  }, [isAuthenticated, isLoading, isLoggingOut, isAdmin, requireAdmin]);

  console.log('withAuth - Checking auth status:', { isAuthenticated, isLoading, isLoggingOut, isAdmin });


  if (isLoading || !initialCheckCompleted) {
    return <p>Loading...</p>;
  }

  return (isAuthenticated && (!requireAdmin || isAdmin)) ? <Component {...props} /> : null;
};

export default withAuth;