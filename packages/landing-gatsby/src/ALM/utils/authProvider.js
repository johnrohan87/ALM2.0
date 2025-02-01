import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout as reduxLogout } from "../store/authSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { navigate } from "gatsby";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
    logout: auth0Logout,
    loginWithRedirect,
    isLoading: auth0Loading,
  } = useAuth0();

  const auth = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateAuthState = async () => {
      if (!auth0Loading) {
        if (isAuthenticated && user) {
          try {
            const accessToken = await getAccessTokenSilently();
            const userRoles = user["https://voluble-boba-2e3a2e.netlify.app/roles"] || [];
            const isAdmin = userRoles.includes("Admin");

            dispatch(
              setCredentials({
                user,
                token: accessToken,
                isAuthenticated,
                isAdmin,
              })
            );

            setTimeout(() => {
              setIsLoading(false);
            }, 50);
          } catch (error) {
            console.error("Error fetching access token:", error);
            dispatch(reduxLogout());
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    };

    updateAuthState();
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch, auth0Loading]);

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        isAuthenticated: auth.isAuthenticated,
        isAdmin: auth.isAdmin,
        isLoading: auth0Loading || isLoading,
        logout: () => {
          dispatch(reduxLogout());
          auth0Logout({ returnTo: window.location.origin + "/logged-out" });
        },
        loginWithRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);