import React, { useEffect } from "react";
import { Router } from "@reach/router";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "gatsby";
import { useSafeGetRolesQuery } from '../hooks/useSafeGetRolesQuery';
import jwtDecode from 'jwt-decode';

const getTokenRoles = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded['https://voluble-boba-2e3a2e.netlify.app/roles'] || [];
  } catch (error) {
    console.error("Error decoding token: ", error);
    return [];
  }
};

const Home = ({ user }) => {

  const roles = user?.['https://voluble-boba-2e3a2e.netlify.app/roles'] || [];
  //console.log(user)

  return (
    <div>
      <img src={user?.picture || ""} alt={user?.name || "friend"} />
      <p>Hi, {user?.name || "friend"}!</p>
      <p>Domain: {process.env.GATSBY_AUTH0_DOMAIN}</p>
      <p>Client ID: {process.env.GATSBY_AUTH0_CLIENT_ID}</p>
      <p>Redirect URI: {process.env.GATSBY_AUTH0_CALLBACK}</p>
      <p>Your roles: {roles?.length > 0 ? roles?.join(', ') : "No specific roles"}</p>
      <p>Your user info: <ul>{user ? JSON.stringify(user) : "No user info"}</ul></p>
    </div>
  );
}

const AccountComponent = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  //const { data: roles, error, isLoading } = useSafeGetRolesQuery();
  
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  if (!isAuthenticated) {
    return <div>Loading your profile...</div>;
  }

  
  const handleLogout = () => {
    logout({ returnTo: process.env.GATSBY_AUTH0_DOMAIN });
  };

  return (
    <>
      <nav>
        <Link to="/account">Home</Link>
        <button onClick={handleLogout}>Log Out</button>
      </nav>
      <Router>
        <Home path="/account" user={user} />
      </Router>
    </>
  );
}

export default AccountComponent;