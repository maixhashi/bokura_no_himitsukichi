import React, { useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './features/authSlice';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/auth/token/login/', {
        username,
        password,
      });
      const { auth_token } = response.data;
      localStorage.setItem('authToken', auth_token);
      alert('ログインに成功しました！');

      // ユーザー情報を取得
      dispatch(fetchCurrentUser());

      navigate('/');
    } catch (error) {
      setErrorMessage('ログインに失敗しました。もう一度お試しください。');
      console.error('Login error:', error);
    }
  };

  return (
    <Layout>
      <div className="container-account-register-page">
        <div className="account-register-page">
          <h2>ログイン</h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit">ログイン</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
