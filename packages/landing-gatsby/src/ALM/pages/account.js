import React, { useEffect } from "react";
import { useGetRolesQuery } from '../store/api';
import { Router } from "@reach/router";
import { login, logout, isAuthenticated, isBrowser } from "../utils/auth";
import { Link } from "gatsby";
import { getStore } from '../store/store';
import { Provider } from 'react-redux';

const Home = ({ user }) => {
  return (<div>
    <img src={user.picture?user.picture:""} alt={user.name?user.name:""}/>
    <p>Hi, {user.name ? user.name : "friend"}!</p>
    <p>domain: {process.env.GATSBY_AUTH0_DOMAIN}!</p>
    <p>clientID: {process.env.GATSBY_AUTH0_CLIENTID}!</p>
    <p>redirectUri: {process.env.GATSBY_AUTH0_CALLBACK}!</p>
  </div>)
}

const AccountComponent = ({ user }) => {
  const { data, error, isLoading } = useGetRolesQuery();

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    if (!isAuthenticated()) {
      login();
    }
  }, []);

  if (!isAuthenticated()) {
    return null; 
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  const userRoles = data.roles ?? [];
  const isAdmin = userRoles.includes('admin');

  return (
    <>
      <nav>
        <Link to="/account">Home</Link>
        {isAdmin && (
          <Link to="/admin">Admin Dashboard</Link>
        )}
        <a href="#logout" onClick={e => {
            logout();
            e.preventDefault();
          }}>
          Log Out
        </a>
      </nav>
      <Router>
        <Home path="/account" user={user} />
        {isAdmin && (
          <Home path="/admin" user={user} />
        )}
      </Router>
    </>
  );
}

const store = getStore();

export default () => (
  <Provider store={store}>
    <AccountComponent />
  </Provider>
);
