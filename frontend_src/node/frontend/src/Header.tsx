import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './features/authSlice';
import './Header.css';
import HeaderLogo from './HeaderLogo';
import HeaderLinks from './HeaderLinks';

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header>
      <HeaderLogo />
      <HeaderLinks />
    </header>
  );
};

export default Header;
