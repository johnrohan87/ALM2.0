import React from 'react';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './src/ALM/utils/authProvider';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './src/ALM/store/authSlice';
import { api } from './src/ALM/store/api';

let store
try {
  store = configureStore({
      reducer: {
          auth: authReducer,
          [api.reducerPath]: api.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
      devTools: process.env.NODE_ENV !== 'production',
  });

  
  console.log("Redux Store initialized in ssr", store.getState());
} catch (error) {
  console.error("Error initializing Redux store:", error);
}

export const wrapRootElement = ({ element }) => {
  //console.log('gatsby-browser window.location.origin = ', window.location.origin)
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
      //onRedirectCallback={onRedirectCallback}
    >
      <Provider store={store}>
      <AuthProvider>
        {element}
      </AuthProvider>
      </Provider>
    </Auth0Provider>
  );
};

export const {
  useFetchUserFeedQuery,
  useImportFeedMutation,
  useEditStoryMutation,
} = api;