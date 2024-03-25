import React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
import store from '../ALM/store/store'

import Home from '../ALM/pages/hosting';
import Portfolio from '../ALM/pages/portfolio';
import Login from '../ALM/pages/login';
import PrivateRoute from '../ALM/pages/hosting';

const IndexRoutes = () => {
  return (
    <Provider store={store}>
    <Router>
      <Home path="/" />
      <Portfolio path="/portfolio" />
      <Login path="/login" />
      <PrivateRoute
        path="/private"
        />
    </Router>
    </Provider>
    
  );
};

export default IndexRoutes;