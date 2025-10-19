import React from 'react';
import { Router } from '@reach/router';
import Home from '../ALM/pages/hosting';
import Login from '../ALM/pages/login';
import Account from '../ALM/pages/account';
import Admin from '../ALM/pages/admin';
//import Rss from '../ALM/pages/rss';

//https://www.miamidadearts.org/rss-feed.xml
//https://southmiamifl.gov/RSSFeed.aspx?ModID=76&CID=All-0
//https://www.prnewswire.com/rss/news-releases-list.rss

const IndexRoutes = () => {
    return (
        <Router>
            <Home path="/" default />
            <Login path="/login" />
            <Account path="/account" />
            <Admin path="/admin" />
        </Router>
    );
};

export default IndexRoutes;