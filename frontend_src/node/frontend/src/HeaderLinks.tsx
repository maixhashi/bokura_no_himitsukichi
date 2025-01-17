import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const HeaderLinks = () => (
  <nav className="HeaderLinks">
    <Link to="/login">
      ログイン
    </Link>
    <Link to="/account-register">
      アカウントを登録
    </Link>
  </nav>
);

export default HeaderLinks;
