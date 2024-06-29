import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { navigate } from 'gatsby';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  logout: () => {},
  loginWithRedirect: () => {}
});

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, logout, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    //console.log("User roles:", user?.['https://voluble-boba-2e3a2e.netlify.app/roles']); 
    if (isAuthenticated && user) {
        const adminRolePresent = user['https://voluble-boba-2e3a2e.netlify.app/roles']?.includes('Admin');
        setIsAdmin(adminRolePresent);
        //console.log("Is Admin:", adminRolePresent);
        fetchToken();
    }
  }, [user, isAuthenticated]);

  const fetchToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
    } catch (error) {
      console.error('Error fetching access token:', error);
      setToken(null);
    }
  };

  const handleLogout = (returnTo = '/') => {
    //console.log('Current window origin:', window.location.origin);
    const logoutURL = process.env.GATSBY_AUTH0_LOGOUT_URL || window.location.origin;
    //console.log('Using logout URL:', logoutURL);

    const fullLogoutUrl = new URL(returnTo, logoutURL).href;
    console.log('Logging out, redirecting to:', fullLogoutUrl);
    
      logout({
          returnTo: fullLogoutUrl,
          onRedirectCallback: () => navigate(returnTo)
      });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
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
