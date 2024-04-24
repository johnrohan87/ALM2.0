import React from 'react';
import { useGetRolesQuery } from '../store/api';

const Admin = () => {
  const { data, error, isLoading } = useGetRolesQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const userRoles = data.roles;

  if (!userRoles.includes('admin')) {
    return <p>You do not have access to this page.</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
};
export default Admin