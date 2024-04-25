import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetRolesQuery } from '../store/api';  

const AdminPanel = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { data: roles, error, isLoading, refetch } = useGetRolesQuery(undefined, {
    skip: true,  // Initially skip the query to wait for token
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = await getAccessTokenSilently();
        refetch({
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    fetchRoles();
  }, [getAccessTokenSilently, refetch]);

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