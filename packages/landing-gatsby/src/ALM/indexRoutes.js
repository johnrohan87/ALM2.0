import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import Home from '../ALM/pages/hosting';
import Portfolio from '../ALM/pages/portfolio';
import Login from '../ALM/pages/login';
import PrivateRoute from '../ALM/pages/hosting';

const IndexRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/private"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </>
  );
};

export default IndexRoutes;