//import React from 'react';
//import { useSelector } from 'react-redux';
import { useSelector, useHistory } from 'gatsby';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const history = useHistory();
  if (!user) {
    history.push('/login');
  }
  return children;
};
export default ProtectedRoute;