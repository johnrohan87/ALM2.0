import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { navigate } from 'gatsby';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  logout: () => {},
  loginWithRedirect: () => {}
});

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, logout, loginWithRedirect } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsAdmin(user[`${process.env.GATSBY_AUTH0_AUDIENCE}`]?.includes('Admin'));
    }
  }, [user, isAuthenticated]);

  const handleLogout = (returnTo = '/') => {
    setIsAdmin(false);
    logout({
      returnTo: `${window.location.origin}${returnTo}`
    });
    navigate(returnTo);
  };

  return (
    <AuthContext.Provider value={{
      user, 
      isAuthenticated, 
      isAdmin, 
      isLoading, 
      logout: handleLogout, 
      loginWithRedirect,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
