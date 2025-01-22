import React, { useState } from 'react';
import axios from 'axios';
import Layout from './Layout';

const AccountRegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
      });
      setMessage(response.data.message);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            Register
          </button>
        </form>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </Layout>
  );
};

export default AccountRegisterPage;
