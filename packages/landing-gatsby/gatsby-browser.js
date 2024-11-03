import React from 'react';
import { navigate } from 'gatsby';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './src/ALM/utils/authProvider';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './src/ALM/store/authSlice';
import { api } from './src/ALM/store/api';

import 'antd/dist/reset.css'; // Or use 'antd/dist/antd.css' for a full reset

const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

const onRedirectCallback = (appState) => {
  const returnTo = appState?.targetUrl || '/account';
  console.log('onRedirectCallback returnTo:', returnTo);
  navigate(returnTo);
};

export const wrapRootElement = ({ element }) => {
  console.log('Auth0 Domain:', process.env.GATSBY_AUTH0_DOMAIN);
  console.log('Auth0 Client ID:', process.env.GATSBY_AUTH0_CLIENT_ID);
  console.log('Auth0 Audience:', process.env.GATSBY_AUTH0_AUDIENCE);

  return (
  <Auth0Provider
    domain={process.env.GATSBY_AUTH0_DOMAIN}
    clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: typeof window !== 'undefined' ? window.location.origin + '/callback' : '',
      audience: process.env.GATSBY_AUTH0_AUDIENCE,
      scope: 'openid profile email',
    }}
    onRedirectCallback={onRedirectCallback}
  >
    <Provider store={store}>
      <AuthProvider>
        {element}
      </AuthProvider>
    </Provider>
  </Auth0Provider>
)};