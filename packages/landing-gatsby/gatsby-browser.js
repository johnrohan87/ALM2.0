import React from 'react';
import auth0 from 'auth0-js';
import { navigate } from 'gatsby';
import jwtDecode from 'jwt-decode';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { api } from './path/to/your/apiSlice';  // Update the path to where your api slice is defined
import { Auth0Provider } from '@auth0/auth0-react';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const isBrowser = typeof window !== 'undefined';

const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.GATSBY_AUTH0_DOMAIN,
      clientID: process.env.GATSBY_AUTH0_CLIENT_ID,
      redirectUri: process.env.GATSBY_AUTH0_CALLBACK,
      responseType: 'token id_token',
      scope: 'openid profile email',
      audience: `${process.env.GATSBY_AUTH0_AUDIENCE}`,
    })
  : {};

const tokens = {
  accessToken: false,
  idToken: false,
  expiresAt: false,
};

let user = {
  roles: [],
};

export const isAuthenticated = () => {
  if (!isBrowser) {
    return false;
  }
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const login = () => {
  if (!isBrowser) {
    return;
  }
  auth.authorize();
};

const setSession = (cb = () => {}) => (err, authResult) => {
  if (err) {
    console.error('Authentication Error:', err);
    navigate('/');
    cb();
    return;
  }

  if (authResult && authResult.accessToken && authResult.idToken) {
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    tokens.accessToken = authResult.accessToken;
    tokens.idToken = authResult.idToken;
    tokens.expiresAt = expiresAt;

    const decodedIdToken = jwtDecode(authResult.idToken);
    user = {
      ...decodedIdToken,
      roles: decodedIdToken[`${process.env.GATSBY_AUTH0_DOMAIN}/api/claims/roles`] || [],
    };

    localStorage.setItem('isLoggedIn', true);
    navigate('/account');
    cb();
  }
};

export const silentAuth = callback => {
  if (!isAuthenticated()) return callback();
  auth.checkSession({}, setSession(callback));
};

export const handleAuthentication = () => {
  if (!isBrowser) {
    return;
  }
  auth.parseHash(setSession());
};

export const getProfile = () => {
  return user;
};

export const logout = () => {
  localStorage.setItem('isLoggedIn', false);
  auth.logout({ returnTo: process.env.GATSBY_AUTH0_LOGOUT_URL });
};

const onRedirectCallback = appState => {
  navigate(appState?.returnTo || "/");
};

export const wrapRootElement = ({ element }) => (
  <Auth0Provider
    domain={process.env.GATSBY_AUTH0_DOMAIN}
    clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
    redirectUri={process.env.GATSBY_AUTH0_CALLBACK}
    onRedirectCallback={onRedirectCallback}
    audience={process.env.GATSBY_AUTH0_AUDIENCE}
    scope="openid profile email"
  >
    <Provider store={store}>
      {element}
    </Provider>
  </Auth0Provider>
);