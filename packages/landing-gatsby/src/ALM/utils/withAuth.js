import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { useAuth } from "./authProvider";
import Spinner from "../components/Spinner/Spinner";

const withAuth = (Component, requireAdmin = false) => (props) => {
  const { isAuthenticated, isLoading, isAdmin, loginWithRedirect } = useAuth();
  const [initialCheckCompleted, setInitialCheckCompleted] = useState(false);

  useEffect(() => {

    if (!isLoading) {
      if (requireAdmin && isAdmin === undefined) return;
      setInitialCheckCompleted(true);

      if (!isAuthenticated) {
        console.log("withAuth - Redirecting to OAuth login...");
        loginWithRedirect({ appState: { targetUrl: window.location.pathname } });
      } else if (requireAdmin && !isAdmin) {
        console.log("withAuth - Redirecting to account...");
        navigate("/account");
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, loginWithRedirect]);

  if (isLoading || !initialCheckCompleted || (requireAdmin && isAdmin === undefined)) {
    console.log("[withAuth] Waiting for authentication state to resolve...");
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spinner />
        <p>Loading authentication state...</p>
      </div>
    );
  }

  return isAuthenticated && (!requireAdmin || isAdmin) ? <Component {...props} /> : null;
};

export default withAuth;