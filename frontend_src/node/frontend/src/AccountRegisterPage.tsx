import React, { useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import './AccountRegisterPage.css';

const AccountRegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/users/', {
        username,
        email,
        password,
      });
      alert('Account created successfully!');
      navigate('/');

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // ここでエラー詳細を出力
      }
    } catch (error) {
      setErrorMessage('Failed to create account. Please try again.');
      console.error('Request failed:', error);
    }
  };

  return (
    <Layout>
      <div className="container-account-register-page">
        <div className="account-register-page">
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
              <label>メールアドレス</label>
              <input
                type="email"
                value={email}
                placeholder="メールアドレスを入力してください"
                onChange={(e) => setEmail(e.target.value)}
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
            <div>
              <label>パスワードの確認</label>
              <input
                type="password"
                value={confirmPassword}
                placeholder='パスワードを入力してください'
                onChange={(e) => setConfirmPassword(e.target.value)}
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
