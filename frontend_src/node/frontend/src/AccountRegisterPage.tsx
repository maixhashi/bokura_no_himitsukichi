import React, { useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import './Form.css';

const AccountRegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
      });
      setMessage(response.data.message);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="form">
          <h2>アカウントを作成</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label>ユーザー名</label>
              <input
                type="text"
                value={username}
                placeholder="ユーザー名を入力してください"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>パスワード</label>
              <input
                type="password"
                value={password}
                placeholder="パスワードを入力してください"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit">登録</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AccountRegisterPage;
