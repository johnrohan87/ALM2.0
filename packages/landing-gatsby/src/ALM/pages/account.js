import React, { useEffect } from "react";
import { Router } from "@reach/router";
import { login, logout, isAuthenticated } from "../utils/auth";
import { Link } from "gatsby";
//import { useGetRolesQuery } from '../store/api';
import { getStore } from '../store/store';
import { Provider } from 'react-redux';
import AdminPanel from "../components/AdminPanel";
import UseAuthToken from "../components/UseAuthToken";

const Home = ({ user }) => {
  return (
    <div>
      <img src={user.picture ? user.picture : ""} alt={user.name ? user.name : "friend"} />
      <p>Hi, {user.name ? user.name : "friend"}!</p>
      <p>domain: {process.env.GATSBY_AUTH0_DOMAIN}</p>
      <p>clientID: {process.env.GATSBY_AUTH0_CLIENTID}</p>
      <p>redirectUri: {process.env.GATSBY_AUTH0_CALLBACK}</p>
      <UseAuthToken />
    </div>
  );
}

const AccountComponent = ({ user }) => {
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    if (!isAuthenticated()) {
      login();
    }
  }, [isBrowser]);

  if (!isAuthenticated()) {
    return null; 
  }

  return (
    <>
      <nav>
        <Link to="/account">Home</Link>
        <Link to="/admin">Admin Dashboard</Link>
        <a href="#logout" onClick={e => {
            logout();
            e.preventDefault();
          }}>
          Log Out
        </a>
      </nav>
      <Router>
        <Home path="/account" user={user} />
        <AdminPanel path="/admin" />
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
