import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './features/authSlice';
import './Header.css';
import HeaderLogo from './HeaderLogo';
import HeaderGameTitle from './HeaderGameTitle';
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
      <HeaderGameTitle />
      <HeaderLinks />
    </header>
  );
};

export default Header;
