import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from './authProvider';

const withAuth = (Component) => (props) => {
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoggingOut) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, isLoggingOut]);

  if (isLoading || isLoggingOut) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated && !isLoggingOut) {
    return null;
  }

  return <Component {...props} />;
};

export default withAuth;