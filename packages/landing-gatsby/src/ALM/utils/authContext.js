import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsAdmin(user[`${process.env.GATSBY_AUTH0_AUDIENCE}`]?.includes('Admin'));
    }
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
