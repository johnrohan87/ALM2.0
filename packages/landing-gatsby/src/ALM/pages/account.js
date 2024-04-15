import React from "react";
import { Link } from "gatsby";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const Account = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const isAdmin = user?.app_metadata?.includes('admin');
  console.log(user)
  console.log(isAdmin)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {isAdmin && <Link to="/admin">Admin</Link>} 
        <p>Email: {user.email}</p>
      </nav>
    </>
  );
};

export default withAuthenticationRequired(Account); 