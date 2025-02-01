import React from "react";
//import { navigate } from "gatsby";
//import { useSelector } from 'react-redux';
import { useAuth } from "../utils/authProvider";
import NavigationBar from "../components/NavigationBar";
import Spinner from "../components/Spinner/Spinner"
import withAuth from "../utils/withAuth";

const AccountComponent = () => {
  const { user, token, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Spinner />
      <p>Loading your profile...</p>
    </div>)
  }
  if (!isAuthenticated) {
    return (
      <div>
        <p>Please log in to view this page.</p>
        <button onClick={() => window.location.href = "/login"}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <NavigationBar />
      <img src={user?.picture || ""} alt={user?.name || "friend"} />
      <p>Hi, {user?.name || "friend"}!</p>
      <p>Your roles: {user?.['https://voluble-boba-2e3a2e.netlify.app/roles']?.join(', ') || "User role"}</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default withAuth(AccountComponent);
