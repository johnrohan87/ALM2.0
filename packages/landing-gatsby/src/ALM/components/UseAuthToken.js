import { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from 'react-redux';
import { setToken } from '../store/authSlice';

const UseAuthToken = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        dispatch(setToken(token));
      } catch (error) {
        console.error('Error fetching access token:', error);
        dispatch(setToken(null));
      }
    };

    fetchToken();
  }, [getAccessTokenSilently, dispatch]);

  return null;
};

export default UseAuthToken;