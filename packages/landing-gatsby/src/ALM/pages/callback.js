import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { navigate } from 'gatsby';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';

const Callback = () => {
  const { user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      getAccessTokenSilently()
        .then((accessToken) => {
          dispatch(setCredentials({ user, token: accessToken, isAuthenticated, isAdmin: user['https://voluble-boba-2e3a2e.netlify.app/roles']?.includes('Admin') }));
          navigate('/account');
        })
        .catch((error) => {
          console.error('Error fetching access token:', error);
        });
    }
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch, isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated]);

  return <p>Loading...</p>;
};

export default Callback;
