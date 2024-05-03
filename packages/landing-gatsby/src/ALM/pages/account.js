import React, { useEffect } from "react";
import { Router } from "@reach/router";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "gatsby";
import { useSafeGetRolesQuery } from '../hooks/useSafeGetRolesQuery';

const Home = ({ user, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  const roles = user?.['https://voluble-boba-2e3a2e.netlify.app/roles'].join(', ') || "No specific roles";

  return (
    <div>
      <img src={user?.picture || ""} alt={user?.name || "friend"} />
      <p>Hi, {user?.name || "friend"}!</p>
      <p>Domain: {process.env.GATSBY_AUTH0_DOMAIN}</p>
      <p>Client ID: {process.env.GATSBY_AUTH0_CLIENT_ID}</p>
      <p>Redirect URI: {process.env.GATSBY_AUTH0_CALLBACK}</p>
      <p>Your roles: {roles}</p>
    </div>
  );
}

const AccountComponent = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  if (!isAuthenticated) {
    return <div>Loading your profile...</div>;
  }

  const { data: roles, error, isLoading } = useSafeGetRolesQuery();
  
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <>
      <nav>
        <Link to="/account">Home</Link>
        <button onClick={handleLogout}>Log Out</button>
      </nav>
      <Router>
        <Home path="/account" user={user} isAuthenticated={isAuthenticated} />
      </Router>
    </>
  );
}

export default AccountComponent;
