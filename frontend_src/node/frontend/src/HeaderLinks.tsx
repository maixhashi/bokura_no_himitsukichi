import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Header.css';

const HeaderLinks = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // ログイン中のユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // CSRFトークンを取得して設定
        const csrfResponse = await axios.get("http://localhost:8000/api/csrf/", {
          withCredentials: true, // Cookieを送信
        });
        axios.defaults.headers.common["X-CSRFToken"] = csrfResponse.data.csrfToken;

        // 現在のユーザー情報を取得
        const response = await axios.get("http://localhost:8000/api/current-user/", {
          withCredentials: true, // Cookieを送信
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setCurrentUser(null); // エラー時は未ログイン状態に戻す
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <nav className="HeaderLinks">
      {currentUser ? (
        // ログイン中
        <>
          <span>こんにちは、{currentUser.username} さん</span>
          <Link to="/logout">ログアウト</Link>
        </>
      ) : (
        // 未ログイン
        <>
          <Link to="/login">ログイン</Link>
          <Link to="/account-register">アカウントを登録</Link>
        </>
      )}
    </nav>
  );
};

export default HeaderLinks;
