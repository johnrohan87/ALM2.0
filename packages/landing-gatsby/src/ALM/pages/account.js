import React, { useEffect, useState } from "react";
import { Router } from "@reach/router";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "gatsby";
import { getStore } from '../store/store';
import { Provider } from 'react-redux';
import AdminPanel from "../components/AdminPanel";
import UseAuthToken from "../components/UseAuthToken";
import jwtDecode from 'jwt-decode';
import { getTokenRoles } from "../utils/auth";

const store = getStore();

const Home = ({ user, roles }) => {
  return (
    <div>
      <img src={user?.picture || ""} alt={user?.name || "friend"} />
      <p>Hi, {user?.name || "friend"}!</p>
      <p>Domain: {process.env.GATSBY_AUTH0_DOMAIN}</p>
      <p>Client ID: {process.env.GATSBY_AUTH0_CLIENT_ID}</p>
      <p>Redirect URI: {process.env.GATSBY_AUTH0_CALLBACK}</p>
      <p>Roles: {roles.join(', ')}</p>
    </div>
  );
}

const AccountComponent = () => {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently, user } = useAuth0();
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const getUserRoles = async () => {
      try {
        const token = await getAccessTokenSilently();
        //const decoded = jwtDecode(token);
        //setUserRoles(decoded[`${process.env.GATSBY_AUTH0_DOMAIN}/api/claims/roles`] || []);
        const roles = getTokenRoles(token);
        setUserRoles(roles)
        console.log('roles', roles)
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    if (isAuthenticated) {
      getUserRoles();
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect, getAccessTokenSilently]);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <>
      <nav>
        <Link to="/account">Home</Link>
        {userRoles.includes('admin') && <Link to="/admin">Admin Dashboard</Link>}
        <button onClick={handleLogout}>Log Out</button>
      </nav>
      <Router>
        <Home path="/account" user={user} roles={userRoles} />
        {userRoles.includes('admin') && <AdminPanel path="/admin" />}
      </Router>
    </>
  );
}

export default () => (
  <Provider store={store}>
    <AccountComponent />
  </Provider>
);
