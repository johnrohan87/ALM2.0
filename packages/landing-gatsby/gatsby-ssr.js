import React from 'react';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { navigate } from 'gatsby';
import { configureStore } from '@reduxjs/toolkit';
import { api } from './src/ALM/store/api'

const onRedirectCallback = (appState) => navigate(appState?.returnTo || '/');

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const wrapRootElement = ({ element }) => {
  return (
    <Auth0Provider
      domain={process.env.GATSBY_AUTH0_DOMAIN}
      clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
      redirectUri={typeof window !== 'undefined' ? window.location.origin : ''}
      onRedirectCallback={onRedirectCallback}
      audience={process.env.GATSBY_AUTH0_AUDIENCE}
      scope="openid profile email"
    >
      <Provider store={store}>
        {element}
      </Provider>
    </Auth0Provider>
  );
};