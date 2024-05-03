import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/ALM/store/store';
import { Auth0Provider } from '@auth0/auth0-react';
import { navigate } from 'gatsby';

const onRedirectCallback = (appState) => navigate(appState?.returnTo || '/');

export const wrapRootElement = ({ element }) => {
  const isBrowser = typeof window !== 'undefined';
  console.log(isBrowser)
  return (
    <Auth0Provider
      domain={process.env.GATSBY_AUTH0_DOMAIN}
      clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <Provider store={store}>
        {element}
      </Provider>
    </Auth0Provider>
  );
};