import React from 'react';
import { Router } from '@reach/router';
import Home from '../ALM/pages/hosting';
import Login from '../ALM/pages/login';
import Account from '../ALM/pages/account';
import Admin from '../ALM/pages/admin';
import Rss from '../ALM/pages/rss';
import RequireAuth from '../ALM/utils/requireAuth';

const IndexRoutes = () => {
    return (
        <Router>
            <Home path="/" default />
            <Login path="/login" />
            <RequireAuth component={Account} path="/account" />
            <RequireAuth component={Admin} path="/admin" />
            <RequireAuth component={Rss} path="/rss" />
        </Router>
    );
};

export default IndexRoutes;