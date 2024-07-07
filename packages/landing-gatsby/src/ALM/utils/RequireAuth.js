import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from './authProvider';

const RequireAuth = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log("RequireAuth - Checking auth status:", { isAuthenticated, isLoading });
    if (!isLoading && !isAuthenticated) {
      console.log('RequireAuth - User is not authenticated, redirecting to login...');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading]);

  console.log("RequireAuth rendering state:", { isAuthenticated, isLoading });

  if (isLoading) {
    console.log('RequireAuth - Authentication is loading...');
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    console.log('RequireAuth - User is not authenticated, showing login prompt...');
    return <p>Please log in to view this page.</p>;
  }

  console.log('RequireAuth - User is authenticated, rendering component...');
  return (
    <div>
      <Component {...rest} />
    </div>
  );
};

export default RequireAuth;