import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Construct the payload based on the role
    const payload = {
      email: role === 'admin' ? null : email, // Send null for admin email
      username: role === 'admin' ? username : null, // Send null for non-admin username
      password,
      role,
    };

    try {
      // The backend endpoint will likely be /auth/login and take the role in the body
      const response = await apiClient.post('/auth/login', payload);

      // Assuming the backend returns a token
      const { token } = response.data;
      localStorage.setItem('token', token); // Store the token

      // Redirect to the correct dashboard
      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error('Login API Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div onChange={(e) => setRole(e.target.value)}>
        <input type="radio" value="candidate" name="role" defaultChecked /> Candidate
        <input type="radio" value="company" name="role" /> Company
        <input type="radio" value="admin" name="role" /> Admin
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        {role === 'admin' ? (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;