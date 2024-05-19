import React from 'react';
import { Router } from '@reach/router';

import Home from '../ALM/pages/hosting';
//import Portfolio from '../ALM/pages/portfolio';
import Login from '../ALM/pages/login';
import Account from '../ALM/pages/account';
import Admin from '../ALM/pages/admin';
import Rss from '../ALM/pages/rss';

const IndexRoutes = () => {
  return (
      <Router>
        <Home path="/" />
        {/*<Portfolio path="/portfolio" />*/}
        <Login path="/login" />
        <Admin path="/admin" />
        <Account path="/account" />
        <Rss path="/rss"/>
      </Router>
  );
};

export default IndexRoutes;