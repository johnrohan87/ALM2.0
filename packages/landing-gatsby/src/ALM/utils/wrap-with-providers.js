// src/wrap-with-providers.js
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { navigate } from 'gatsby';
import { store } from '../store/store';

const onRedirectCallback = (appState) => navigate(appState?.returnTo || '/');

export const wrapRootElement = ({ element }) => {
  console.assert(store != null, "Redux store is not initialized");
  if (typeof window === 'undefined') {
    return <></>;
  }

  return (
    <Auth0Provider
      domain={process.env.GATSBY_AUTH0_DOMAIN}
      clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
      redirectUri={typeof window !== 'undefined' ? window.location.origin : ''}
      onRedirectCallback={onRedirectCallback}
      audience={process.env.GATSBY_AUTH0_AUDIENCE}
      scope="openid profile email"
    >
      <ReduxProvider store={store}>
        {element}
      </ReduxProvider>
    </Auth0Provider>
  );
};
