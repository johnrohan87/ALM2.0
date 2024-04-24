import React, { useEffect } from "react"
import { Router, navigate } from "@reach/router"
import { login, logout, isAuthenticated, getProfile, isBrowser } from "../utils/auth"
import { Link } from "gatsby"
import { getStore } from '../store/store'
import { Provider, connect } from 'react-redux';

const Home = ({ user }) => {
  return (<div>
    <img src={user.picture?user.picture:""} alt={user.name?user.name:""}/>
    <p>Hi, {user.name ? user.name : "friend"}!</p>
    <p>domain: {process.env.GATSBY_AUTH0_DOMAIN}!</p>
    <p>clientID: {process.env.GATSBY_AUTH0_CLIENTID}!</p>
    <p>redirectUri: {process.env.GATSBY_AUTH0_CALLBACK}!</p>
  </div>)
}
const Settings = () => <p>Settings</p>
const Billing = () => <p>Billing</p>

const AccountComponent = ({ apiState, user }) => {
  useEffect(() => {
    if (!isBrowser) {
      return
    }
    if (!isAuthenticated()) {
      login()
      return <p>Redirecting to login...</p>
    }
  }, [])

  if (!isAuthenticated()) {
    return null; // Don't render anything if not authenticated
  }

  if (!apiState) {
    //return <p>No data available</p>;
    console.log('!apiState',apiState)
  }

  let data, error, isLoading;

  if (apiState) {
    ({ data, error, isLoading } = apiState);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const userRoles = data.roles;

  // Check if the user has an admin role
  const isAdmin = userRoles.includes('admin');
  console.log(data)

  return (
    <>
    <nav>
      <Link to="/account">Home</Link>{" "}
      {/*<Link to="/account/settings">Settings</Link>{" "}
      <Link to="/account/billing">Billing</Link>{" "}*/}
      {isAdmin && (
        <Link to="/admin">Admin Dashboard</Link>
      )}
      <a
        href="#logout"
        onClick={e => {
          logout()
          e.preventDefault()
        }}
      >
        Log Out
      </a>
      <div>
        <img src={user.picture?user.picture:""} alt={user.name?user.name:""}/>
        <p>Hi, {user.name ? user.name : "friend"}!</p>
      </div>
    </nav>
    <Router>
      <Home path="/account" user={user} />
      {/*<Settings path="/account/settings" />
      <Billing path="/account/billing" />*/}
      {isAdmin && (
        <Home path="/account/billing" user={user} />
      )}
    </Router>
    </>
  )
}

const mapStateToProps = state => {
  return { apiState: state.api.getRoles };
};

const Account = connect(mapStateToProps)(AccountComponent);

const store = getStore();

export default () => (
  <Provider store={store}>
    <Account />
  </Provider>
)