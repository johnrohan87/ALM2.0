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
    console.log("User roles:", user?.['https://voluble-boba-2e3a2e.netlify.app/roles']); 
    if (isAuthenticated && user) {
        const adminRolePresent = user['https://voluble-boba-2e3a2e.netlify.app/roles']?.includes('Admin');
        setIsAdmin(adminRolePresent);
        console.log("Is Admin:", adminRolePresent);
    }
  }, [user, isAuthenticated]);

  const handleLogout = (returnTo = '/') => {
    const isProduction = process.env.NODE_ENV === 'production';
    const logoutURL = isProduction ? 'https://voluble-boba-2e3a2e.netlify.app' : 'http://localhost:8000';
    
    console.log('Logging out, redirecting to:', logoutURL + returnTo);
    
    logout({
      returnTo: logoutURL + returnTo
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
