import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout as reduxLogout } from '../store/authSlice';
import { useAuth0 } from '@auth0/auth0-react';
import { navigate } from 'gatsby';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, getAccessTokenSilently, logout: auth0Logout, loginWithRedirect, isLoading: auth0Loading } = useAuth0();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth0Loading && isAuthenticated && user) {
      getAccessTokenSilently()
        .then((accessToken) => {
          console.log("Access Token before dispatching:", accessToken);
          dispatch(setCredentials({ user, token: accessToken, isAuthenticated, isAdmin: user['https://voluble-boba-2e3a2e.netlify.app/roles']?.includes('Admin') }));
        })
        .catch((error) => {
          console.error('Error fetching access token:', error);
          dispatch(reduxLogout());
        });
    }
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch, auth0Loading]);

  console.log("AuthProvider token =", auth.token);

  return (
    <AuthContext.Provider value={{
      user: auth.user,
      token: auth.token,
      isAuthenticated: auth.isAuthenticated,
      isAdmin: auth.isAdmin,
      isLoading: auth0Loading,
      logout: () => {
        console.log('AuthProvider logout')
        auth0Logout({ returnTo: window.location.origin });
        dispatch(reduxLogout());
      },
      loginWithRedirect,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);