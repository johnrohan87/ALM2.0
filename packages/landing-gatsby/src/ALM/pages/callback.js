import React, { useEffect } from "react";
import { navigate } from "gatsby";
import { useAuth0 } from "@auth0/auth0-react";

const Callback = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/account");
    }
  }, [isLoading, isAuthenticated]);

  return <p>Loading...</p>;
};

export default Callback;