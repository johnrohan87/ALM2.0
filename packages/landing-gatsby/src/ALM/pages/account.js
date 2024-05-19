import React, { useEffect } from "react";
import { Router } from "@reach/router";
import { Link } from "gatsby";
import Admin from "./admin";
import Rss from "./rss";
import { AuthProvider, useAuth } from "../utils/authContext";

const Home = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const roles = user?.['https://voluble-boba-2e3a2e.netlify.app/roles'] || [];

  if (isLoading) {
    return <div>Loading your profile...</div>;
  }
  if (!isAuthenticated) {
    return <div>Loading your profile...</div>;
  }

  return (
    <div>
      <img src={user?.picture || ""} alt={user?.name || "friend"} />
      <p>Hi, {user?.name || "friend"}!</p>
      <p>Domain: {process.env.GATSBY_AUTH0_DOMAIN}</p>
      <p>Client ID: {process.env.GATSBY_AUTH0_CLIENT_ID}</p>
      <p>Redirect URI: {process.env.GATSBY_AUTH0_CALLBACK}</p>
      <p>Your roles: {roles.join(', ') || "No specific roles"}</p>
      <div><p>Your user info: </p><ul>{JSON.stringify(user || "No user info")}</ul></div>
    </div>
  );
};

const AccountComponent = () => {
  const { user, isAuthenticated, loginWithRedirect, isAdmin, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect({appState: { returnTo: '/account' }});
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return <div>Loading your profile...</div>;
  }

  const handleLogout = () => {
    logout('/');
  };

  return (
    <AuthProvider>
      <nav>
        <Link to="/account">Home</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        <Link to="/rss">RSS</Link>
        <button onClick={handleLogout}>Log Out</button>
      </nav>
      <Router>
        <Home path="/account" />
        {isAdmin && <Admin path="/admin" />}
        <Rss path="/rss" />
      </Router>
    </AuthProvider>
  );
};

export default AccountComponent;