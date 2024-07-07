import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const LoggedOut = () => {
  useEffect(() => {
    navigate('/');
  }, []);

  return <p>You have been logged out. Redirecting...</p>;
};

export default LoggedOut;
