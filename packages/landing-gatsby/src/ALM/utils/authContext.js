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

  /*const handleLogout = (returnTo = '/') => {
    const logoutURL = process.env.GATSBY_AUTH0_LOGOUT_URL;
    console.log('Logging out, redirecting to:', logoutURL);

    try {
        if (!returnTo.startsWith('/')) {
            returnTo = '/' + returnTo;
        }
        const fullLogoutUrl = new URL(returnTo, logoutURL).href;

        logout({
            returnTo: fullLogoutUrl,
            onRedirectCallback: () => {
                console.log('Logout completed, navigating to:', returnTo);
                navigate(returnTo);
            }
        });
    } catch (error) {
        console.error('Error constructing logout URL:', error);
        navigate('/');
    }
  };*/
  const handleLogout = () =>{
    console.log('authContext window.location.origin = ', window.location.origin)
    logout({ returnTo: window.location.origin });
  }

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
