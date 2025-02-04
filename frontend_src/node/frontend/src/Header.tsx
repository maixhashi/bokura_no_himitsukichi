import './Header.css';
import HeaderLogo from './HeaderLogo';
import HeaderGameTitle from './HeaderGameTitle';
import HeaderLinks from './HeaderLinks';

const Header = () => {
  return (
    <header>
      <HeaderLogo />
      <HeaderGameTitle />
      <HeaderLinks />
    </header>
  );
};

export default Header;
