import React from 'react';
import { useAuth } from '../utils/authContext';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  if (!isAdmin){
    return <div><p> Admin Not Found </p></div>
  }
  console.log(user)
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user?.name}! You have administrative access.</p>
      <div>{user ? JSON.stringify(user) : "No user info"}</div>
    </div>
  );
};
export default Admin