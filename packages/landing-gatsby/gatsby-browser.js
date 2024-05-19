import React from 'react';
import { navigate } from "gatsby";
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './src/ALM/utils/authContext';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './src/ALM/store/apiSlice'

export const wrapRootElement = ({ element }) => {

  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
  
  const onRedirectCallback = (appState) => {
    if (appState && appState.returnTo) {
      console.log('appState && appState.returnTo', appState, appState.returnTo)
      navigate(appState.returnTo);
  } else {
      console.error("appState or returnTo is undefined");
      navigate("/account");
  }
  };
  console.log('gatsby-browser window.location.origin = ', window.location.origin)
  return (
    <Auth0Provider
      domain={process.env.GATSBY_AUTH0_DOMAIN}
      clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? process.env.GATSBY_AUTH0_CALLBACK : '',
        audience: process.env.GATSBY_AUTH0_AUDIENCE,
        scope: 'openid profile email',
        response_type: 'code',
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <AuthProvider>
      <Provider store={store}>
        {element}
      </Provider>
      </AuthProvider>
    </Auth0Provider>
  );
};