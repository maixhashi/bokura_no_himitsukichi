import './Footer.css';

const APP_NAME = 'movieDIG!';
const currentYear = new Date().getFullYear();

const Footer = () => (
  <footer>
    <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
  </footer>
);

export default Footer;
