import React from "react";
import { Link } from "gatsby";
import { useAuth } from "../utils/authContext";  

const NavigationBar = () => {
    const { logout, isAdmin } = useAuth();
    return (
      <nav style={navStyle}>
        <Link to="/account" style={linkStyle}>Home</Link>
        {isAdmin && <Link to="/admin" style={linkStyle}>Admin</Link>}
        <Link to="/rss" style={linkStyle}>RSS</Link>
        <button onClick={logout} style={buttonStyle}>Log Out</button>
      </nav>
    );
  };

  const navStyle = {
    background: '#f0f0f0',
    padding: '10px 20px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center'
};

const linkStyle = {
    marginRight: '10px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px'
};

const buttonStyle = {
    padding: '5px 10px',
    background: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

  export default NavigationBar