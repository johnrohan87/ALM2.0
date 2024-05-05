import React from 'react';
import { isAdmin } from '../utils/auth';

const Admin = ({user}) => {
  if (!isAdmin){
    return <div><p> Admin Not Found </p></div>
  }
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user?.name}! You have administrative access.</p>
    </div>
  );
};
export default Admin