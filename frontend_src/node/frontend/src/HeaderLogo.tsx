import React from 'react';
import { Link } from 'react-router-dom';
import logo from './game-logo.png';
import './Header.css';

const HeaderLogo = () => (
  <div className="HeaderLogo">
    <Link to="/">
      <img src={logo} alt="Logo" className="logo-image" />
    </Link>
  </div>
);

export default HeaderLogo;
