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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth0Loading) {
      if (isAuthenticated && user && !auth.token) {
        getAccessTokenSilently()
          .then((accessToken) => {
            dispatch(setCredentials({ user, token: accessToken, isAuthenticated, isAdmin: user['https://voluble-boba-2e3a2e.netlify.app/roles']?.includes('Admin') }));
            // Redirect to account page if returning from login
            if (window.location.pathname === '/logged-out') {
              navigate('/account');
            }
          })
          .catch((error) => {
            console.error('Error fetching access token:', error);
            dispatch(reduxLogout());
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch, auth0Loading, auth.token]);

  return (
    <AuthContext.Provider value={{
      user: auth.user,
      token: auth.token,
      isAuthenticated: auth.isAuthenticated,
      isAdmin: auth.isAdmin,
      isLoading: auth0Loading || isLoading,
      isLoggingOut,
      logout: () => {
        console.log('AuthProvider logout');
        setIsLoggingOut(true); 

        // Dispatch Redux logout to update the application state
        dispatch(reduxLogout());

        // Ensure state updates before redirecting
        setTimeout(() => {
          setIsLoggingOut(false);
          auth0Logout({ returnTo: window.location.origin + '/logged-out' });
        }, 500);
      },
      loginWithRedirect,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);