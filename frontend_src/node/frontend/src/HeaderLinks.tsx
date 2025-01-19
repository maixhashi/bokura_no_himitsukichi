import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from './features/authSlice'; // 適切な場所からインポートしてください
import './Header.css';

const HeaderLinks = () => {
  const user = useSelector((state) => state.auth.user); // 修正: コンポーネントの外側でコードを実行していたためエラーになっていました。
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {user ? (
        <div>
          <span className="username-on-HeaderLinks">{user.username}</span>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
      ) : (
        <nav className="HeaderLinks">
          <span>ログインしてください</span>
          <Link to="/login">ログイン</Link>
          <Link to="/account-register">アカウントを登録</Link>
        </nav>
      )}
    </div>
  );
};

export default HeaderLinks;
