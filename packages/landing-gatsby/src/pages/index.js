import React from 'react';
import { Router, Navigate } from '@reach/router';

import Home from '../ALM/pages/hosting';
import Portfolio from '../ALM/pages/portfolio';
import Login from '../ALM/pages/login';
import PrivateRoute from '../ALM/pages/hosting';

const IndexRoutes = () => {
  return (
    <Router>
      <Home path="/" />
      <Portfolio path="/portfolio" />
      <Login path="/login" />
      <PrivateRoute
        path="/private"
        />
    </Router>
    
  );
};

export default IndexRoutes;