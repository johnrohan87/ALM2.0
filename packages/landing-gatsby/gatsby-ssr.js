import React from 'react';
import { navigate } from "gatsby";
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './src/ALM/utils/authContext';
import { configureStore } from '@reduxjs/toolkit';
import { api } from './src/ALM/store/api'

export const wrapRootElement = ({ element }) => {

  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
  
  const onRedirectCallback = (appState) => {
    if (appState && appState.returnTo) {
      navigate(appState.returnTo);
  } else {
      console.error("appState or returnTo is undefined");
      navigate("/account");
  }
  };

  return (
    <Auth0Provider
      domain={process.env.GATSBY_AUTH0_DOMAIN}
      clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
      redirectUri={typeof window !== 'undefined' ? process.env.GATSBY_AUTH0_CALLBACK : ''}
      onRedirectCallback={onRedirectCallback}
      audience={process.env.GATSBY_AUTH0_AUDIENCE}
      scope="openid profile email"
    >
      <AuthProvider>
      <Provider store={store}>
        {element}
      </Provider>
      </AuthProvider>
    </Auth0Provider>
  );
};