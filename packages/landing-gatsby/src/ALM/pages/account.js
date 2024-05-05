import React from "react";
import { Router } from "@reach/router";
import { Link } from "gatsby";
import Admin from "./admin";
import { AuthProvider } from "../utils/authContext";
import { useAuth } from "../utils/authContext";

const Home = ({ user }) => {
  const roles = user?.['https://voluble-boba-2e3a2e.netlify.app/roles'] || [];
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
  const { user, isAdmin, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading your profile...</div>;
  }

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <AuthProvider>
      <nav>
        <Link to="/account">Home</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        <button onClick={handleLogout}>Log Out</button>
      </nav>
      <Router>
        <Home path="/account" user={user} />
        {isAdmin && <Admin path="/admin" user={user} />}
      </Router>
    </AuthProvider>
  );
};

export default AccountComponent;
