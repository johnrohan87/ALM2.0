import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { navigate } from "gatsby";

const Admin = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Redirect non-admin users to the account page
  if (isAuthenticated && !user?.role?.includes('admin')) {
    navigate('/account');
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>This page is only accessible to users with admin privileges.</p>
    </div>
  );
};

export default withAuthenticationRequired(Admin);