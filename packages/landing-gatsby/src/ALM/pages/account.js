import React, { useEffect } from "react"
import { Router, navigate } from "@reach/router"
import { login, logout, isAuthenticated, getProfile, isBrowser } from "../utils/auth"
import { Link } from "gatsby"
//import { api } from '../store/api';
import { store } from '../store/store'
import { Provider, useSelector } from 'react-redux';

const Home = ({ user }) => {
  console.log(user)
  
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

const Account = () => {
  const user = getProfile()
  const apiState = useSelector((state) => state.api.getRoles);

  useEffect(() => {
    if (!isBrowser) {
      return
    }
    if (!isAuthenticated()) {
      login()
      return <p>Redirecting to login...</p>
    }
  }, [])

  if (!apiState) {
    return <p>No data available</p>;
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
    <Provider store={store}>
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
      </Provider>
    </>
  )
}

export default Account