import React, { useEffect } from "react"
import { Router, navigate } from "@reach/router"
import { login, logout, isAuthenticated, getProfile, isBrowser } from "../utils/auth"
import { useDispatch, useSelector } from "react-redux"
import fetchUserRoles from "../store/apiSlice"
import { Link } from "gatsby"

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
  const dispatch = useDispatch()
  const user = getProfile()
  const roles = useSelector(state => state.userRoles.roles)

  useEffect(() => {
    if (!isBrowser) {
      return
    }
    dispatch(fetchUserRoles())
  }, [dispatch])

  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  return (
    <>
      <nav>
        <Link to="/account">Home</Link>{" "}
        <Link to="/account/settings">Settings</Link>{" "}
        <Link to="/account/billing">Billing</Link>{" "}
        <a
          href="#logout"
          onClick={e => {
            logout()
            e.preventDefault()
          }}
        >
          Log Out
        </a>
      </nav>
      <Router>
        <Home path="/account" user={user} />
        {roles.includes("admin") && <Settings path="/account/settings" />}
        <Billing path="/account/billing" />
      </Router>
    </>
  )
}

export default Account