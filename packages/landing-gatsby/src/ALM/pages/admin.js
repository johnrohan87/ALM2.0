import React from 'react';
import { useAuth } from '../utils/authProvider';
import NavigationBar from "../components/NavigationBar";
import withAuth from '../utils/withAuth';

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  if (!isAdmin){
    return <div><p> Admin Not Found </p></div>
  }

  if (isLoading) {
    return <div>Loading your profile...</div>;
  }
  
  return (
    <div>
      <NavigationBar />
      <h1>Admin Panel</h1>
      <p>Welcome, {user?.name}! You have administrative access.</p>
      <div>{user ? JSON.stringify(user) : "No user info"}</div>
    </div>
  );
};
export default withAuth(Admin, true);