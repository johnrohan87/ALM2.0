import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout as reduxLogout } from '../store/authSlice';
import { useAuth0 } from '@auth0/auth0-react';
import { navigate } from 'gatsby';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, getAccessTokenSilently, logout: auth0Logout, loginWithRedirect, isLoading: auth0Loading } = useAuth0();
  const auth = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!auth0Loading && isAuthenticated && user) {
      getAccessTokenSilently()
        .then((accessToken) => {
          dispatch(setCredentials({ user, token: accessToken, isAuthenticated, isAdmin: user['https://voluble-boba-2e3a2e.netlify.app/roles']?.includes('Admin') }));
        })
        .catch((error) => {
          console.error('Error fetching access token:', error);
          dispatch(reduxLogout());
        });
    }
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch, auth0Loading]);

  const handleLogout = () => {
    console.log('AuthProvider logout');
    setIsLoggingOut(true);
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    auth0Logout({ returnTo: window.location.origin + '/logged-out' });
    dispatch(reduxLogout());
    console.log('isLoggingOut =', isLoggingOut);
  };

  return (
    <AuthContext.Provider value={{
      user: auth.user,
      token: auth.token,
      isAuthenticated: auth.isAuthenticated,
      isAdmin: auth.isAdmin,
      isLoading: auth0Loading,
      isLoggingOut,
      logout: handleLogout,
      loginWithRedirect,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);