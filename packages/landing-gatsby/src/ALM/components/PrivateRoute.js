
const PrivateRoute = ({ component: Component, user, allowedRoles, ...rest }) => {
    const roles = user?.['https://voluble-boba-2e3a2e.netlify.app/roles'] || [];
    const isAllowed = roles.some(role => allowedRoles.includes(role));
  
    return isAllowed ? <Component user={user} {...rest} /> : <Redirect from="" to="/account" noThrow />;
  }
export default PrivateRoute