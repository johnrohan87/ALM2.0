import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetRolesQuery } from '../store/api'; 
 

const AdminPanel = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { data: roles, error, isLoading, refetch } = useGetRolesQuery(undefined, {
    skip: !isAuthenticated,
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
    if (isAuthenticated) { // Ensure this check is done, assuming `isAuthenticated` is available from useAuth0
      fetchRoles();
    }
  }, [getAccessTokenSilently, refetch, isAuthenticated]);

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