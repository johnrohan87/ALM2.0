// Login.js
import React, { useState } from 'react';
import { useLoginMutation } from '../store/apiService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, isError }] = useLoginMutation();

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={isLoading}>
        Login
      </button>
      {isError && <div>Failed to login. Please check your credentials.</div>}
    </div>
  );
};

export default Login;
