import React, { useEffect } from "react";
//import { navigate } from "gatsby";
//import { useSelector } from 'react-redux';
import { useAuth } from "../utils/authProvider";
//import NavigationBar from "../components/NavigationBar";
import withAuth from "../utils/withAuth";

const AccountComponent = () => {
  const { user, token, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return <div>Loading your profile...</div>;
  }
  if (!isAuthenticated) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      {/*<NavigationBar />*/}
      <img src={user?.picture || ""} alt={user?.name || "friend"} />
      <p>Hi, {user?.name || "friend"}!</p>
      <p>Your roles: {user?.['https://voluble-boba-2e3a2e.netlify.app/roles']?.join(', ') || "No specific roles"}</p>
      <p>Your user info: {JSON.stringify(user)}</p>
      <p>Your user Token: {token}</p>
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
};

export default withAuth(AccountComponent);
