import React from 'react';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#home" className="logo">LT</a>
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={closeMenu}>Ana Sayfa</a></li>
          <li><a href="#about" onClick={closeMenu}>Hakkımda</a></li>
          <li><a href="#projects" onClick={closeMenu}>Projeler</a></li>
          <li><a href="#skills" onClick={closeMenu}>Yetenekler</a></li>
          <li><a href="#contact" onClick={closeMenu}>İletişim</a></li>
        </ul>
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
