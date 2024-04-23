import React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'react-redux';
import store from '../ALM/store/store'

import Home from '../ALM/pages/hosting';
import Portfolio from '../ALM/pages/portfolio';
//import Login from '../ALM/pages/login';
import Account from '../ALM/pages/account';
//import Admin from '../ALM/pages/admin';

const IndexRoutes = () => {
  return (
    <Provider store={store}>
      <Router>
        <Home path="/" />
        {/*<Portfolio path="/portfolio" />
        <Login path="/login" />
        <Admin path="/admin" />*/}
        <Account path="/account"/>
      </Router>
    </Provider>
    
  );
};

export default IndexRoutes;