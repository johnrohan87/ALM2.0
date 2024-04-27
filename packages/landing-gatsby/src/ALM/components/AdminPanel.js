import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetRolesQuery } from '../store/api';

const AdminPanel = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [token, setToken] = useState(null);
  const {
    data: roles,
    error,
    isLoading,
    refetch
  } = useGetRolesQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: 'https://YOUR_AUTH0_DOMAIN/api/v2/',
          scope: 'read:users'
        });
        setToken(accessToken);
        console.log("Access Token:", accessToken);
        refetch({
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error fetching access token:', error);
        setToken(null);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [getAccessTokenSilently, isAuthenticated, refetch]);

  if (isLoading) return <p>Loading roles...</p>;
  if (error) return <p>Error fetching roles: {error.message}</p>;

  const isAdmin = roles?.some(role => role.name === 'admin');

  return (
    <div>
      {isAdmin ? (
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome to your admin panel.</p>
        </div>
      ) : (
        <p>You do not have admin privileges.</p>
      )}
    </div>
  );
};

export default AdminPanel;