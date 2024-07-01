import React, { useEffect } from "react";
import { navigate } from "gatsby";
import { useAuth } from "../utils/authProvider";

const Callback = () => {
  const { user, token, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('callback - !isLoading && isAuthenticated')
      navigate("/account");
    }
  }, [isLoading, isAuthenticated]);

  return <p>Loading...</p>;
};

export default Callback;