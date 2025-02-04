import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, logout } from './features/auth/authSlice';
import { RootState, AppDispatch } from './store';
import { Link, useNavigate } from "react-router-dom";

import "./Header.css";

const HeaderLinks = () => {
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
    axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true })
      .then(() => {
        navigate("/"); // ログアウト後にログイン画面へ遷移
      })
      .catch(error => {
        console.error("ログアウトに失敗しました:", error);
      });
  };

  return (
    <nav className="HeaderLinks">
      {currentUser ? (
        <>
          <span className="pixel-font">{currentUser.username}</span>
          <Link to="/dashboard" className="pixel-font">ダッシュボード</Link>
          <button onClick={handleLogout} className="logout-button pixel-font">
            ログアウト
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="pixel-font">ログイン</Link>
          <Link to="/account-register" className="pixel-font">アカウントを登録</Link>
        </>
      )}
    </nav>
  );
};

export default HeaderLinks;
