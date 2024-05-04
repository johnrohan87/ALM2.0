import auth0 from 'auth0-js';
import { navigate } from 'gatsby';
import { jwtDecode } from 'jwt-decode';

export const isBrowser = typeof window !== 'undefined';

const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.GATSBY_AUTH0_DOMAIN,
      clientID: process.env.GATSBY_AUTH0_CLIENT_ID,
      redirectUri: process.env.GATSBY_AUTH0_CALLBACK,
      responseType: 'token id_token',
      scope: 'openid profile email',
      audience: `${process.env.GATSBY_AUTH0_AUDIENCE}`,
    })
  : {};

let user = {};

export const login = () => {
  if (!isBrowser) {
    return;
  }
  auth.authorize();
};

const setSession = (cb = () => {}) => (err, authResult) => {
  if (err) {
    console.error('Authentication Error:', err);
    navigate('/');
    cb();
    return;
  }
  if (!isBrowser) {
    return
  }
  if (authResult && authResult.accessToken && authResult.idToken) {
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    const decodedIdToken = jwtDecode(authResult.idToken);
    user = {
      ...decodedIdToken,
      roles: decodedIdToken['https://voluble-boba-2e3a2e.netlify.app/roles'] || [],
    };

    localStorage.setItem('isLoggedIn', true);
    navigate('/account');
    cb();
  }
};

export const isAuthenticated = () => {
  return isBrowser && localStorage.getItem('isLoggedIn') === 'true';
};

export const getProfile = () => {
  return user;
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  auth.logout({
    returnTo: process.env.GATSBY_AUTH0_LOGOUT_URL,
  });
};

export const silentAuth = callback => {
  if (!isAuthenticated()) return callback();
  auth.checkSession({}, setSession(callback));
};

export const handleAuthentication = () => {
  if (!isBrowser) {
    return;
  }
  auth.parseHash(setSession());
};