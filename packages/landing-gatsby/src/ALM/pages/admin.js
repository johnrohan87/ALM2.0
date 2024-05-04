import React, {useEffect} from 'react';
import { login, isAuthenticated } from "../utils/auth";

const Admin = ({user}) => {
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    if (!isAuthenticated()) {
      login();
    }
  }, [isBrowser]);

  if (!isAuthenticated()) {
    return null; 
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user?.name}! You have administrative access.</p>
    </div>
  );
};
export default Admin