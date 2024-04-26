import React, {useEffect} from 'react';
import { login, logout, isAuthenticated } from "../utils/auth";
import AdminPanel from '../components/AdminPanel';

const Admin = () => {
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
      <h1>Admin Dashboard</h1>
      <AdminPanel />
    </div>
  );
};
export default Admin