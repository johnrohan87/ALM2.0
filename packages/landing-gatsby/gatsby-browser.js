/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from 'react';
import IndexRoutes from './src/pages/index';

import { Auth0Provider } from '@auth0/auth0-react';
import { navigate } from 'gatsby';

const onRedirectCallback = (appState) => {
  navigate(appState?.returnTo || '/', { replace: true });
 };

export const wrapRootElement = ({ element }) => {
  return (<Auth0Provider
    domain={process.env.GATSBY_AUTH0_DOMAIN}
    clientId={process.env.GATSBY_AUTH0_CLIENTID}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    ><IndexRoutes>{element}</IndexRoutes></Auth0Provider>);
};