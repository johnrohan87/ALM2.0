import React from "react";
import { useAuth } from "../utils/authProvider";
import NavigationBar from "../components/NavigationBar";
import Spinner from "../components/Spinner/Spinner";
import withAuth from "../utils/withAuth";

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spinner />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div>
        <p>Access Denied: Admin privileges required.</p>
        <button onClick={() => window.location.href = "/account"}>Go to Account</button>
      </div>
    );
  }

  return (
    <div>
      <NavigationBar />
      <h1>Admin Panel</h1>
      <p>Welcome, {user?.name}! You have administrative access.</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default withAuth(Admin, true);