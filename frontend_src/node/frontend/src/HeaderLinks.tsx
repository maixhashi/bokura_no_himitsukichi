import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, logout } from './features/auth/authSlice';
import { RootState, AppDispatch } from './store';
import { Link, useNavigate } from "react-router-dom";

import "./Header.css";

const HeaderLinks = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // ページ遷移用フック

  const dispatch: AppDispatch = useDispatch();
  const { currentUser, status } = useSelector((state: RootState) => state.auth);

  // ログイン中のユーザー情報を取得
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, status]);

  const handleLogout = () => {
    dispatch(logout());
    // ログアウト処理をサーバーに送信
    axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true });
  };

  return (
    <nav className="HeaderLinks">
      {currentUser ? (
        // ログイン中
        <>
          <span className="pixel-font">{currentUser.username}</span>
          <Link to="/dashboard" className="pixel-font">ダッシュボード</Link>
          <button onClick={handleLogout} className="logout-button pixel-font">
            ログアウト
          </button>
        </>
      ) : (
        // 未ログイン
        <>
          <Link to="/login" className="pixel-font">ログイン</Link>
          <Link to="/account-register" className="pixel-font">アカウントを登録</Link>
        </>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {success && <p className="success-message">{success}</p>}
    </nav>
  );
};

export default HeaderLinks;
