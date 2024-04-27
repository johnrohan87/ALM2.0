import React, { useEffect } from "react";
import { Router } from "@reach/router";
import { useAuth0 } from "@auth0/auth0-react";  // Import useAuth0
import { Link } from "gatsby";
import { getStore } from '../store/store';
import { Provider } from 'react-redux';
import AdminPanel from "../components/AdminPanel";
import UseAuthToken from "../components/UseAuthToken";

const store = getStore();

const Home = () => {
  const { user } = useAuth0();  // Use useAuth0 to get user data

  return (
    <div>
      <img src={user?.picture || ""} alt={user?.name || "friend"} />
      <p>Hi, {user?.name || "friend"}!</p>
      <p>domain: {process.env.GATSBY_AUTH0_DOMAIN}</p>
      <p>clientID: {process.env.GATSBY_AUTH0_CLIENT_ID}</p>
      <p>redirectUri: {process.env.GATSBY_AUTH0_CALLBACK}</p>
      <UseAuthToken />
    </div>
  );
}

const AccountComponent = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();  // Use hooks from Auth0

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();  // Use loginWithRedirect for handling login
    }
  }, [isAuthenticated, loginWithRedirect]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <>
      <nav>
        <Link to="/account">Home</Link>
        <Link to="/admin">Admin Dashboard</Link>
        <a href="#logout" onClick={() => logout({ returnTo: process.env.GATSBY_AUTH0_LOGOUT_URL })}>
          Log Out
        </a>
      </nav>
      <Router>
        <Home path="/account" />
        <AdminPanel path="/admin" />
      </Router>
    </>
  );
}

export default () => (
  <Provider store={store}>
    <AccountComponent />
  </Provider>
);
