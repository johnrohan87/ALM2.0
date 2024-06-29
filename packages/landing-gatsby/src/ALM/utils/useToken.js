import { useContext } from 'react';
import { AuthContext } from './authContext';

export const useToken = () => {
    const { token } = useContext(AuthContext);
    return token;
};