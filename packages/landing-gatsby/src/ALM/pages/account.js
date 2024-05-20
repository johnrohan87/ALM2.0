import React, { useEffect } from "react";
import { navigate } from "gatsby";
import { useAuth } from "../utils/authContext";
import NavigationBar from "../components/NavigationBar";

const AccountComponent = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <div>Loading your profile...</div>;
  }
  if (!isAuthenticated) {
    return <div>Loading your profile...</div>;
  }

  return (
    <div>
      <NavigationBar />
      <img src={user?.picture || ""} alt={user?.name || "friend"} />
      <p>Hi, {user?.name || "friend"}!</p>
      <p>Your roles: {user?.roles?.join(', ') || "No specific roles"}</p>
      <p>Your user info: {JSON.stringify(user)}</p>
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
};

export default AccountComponent;
