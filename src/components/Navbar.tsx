import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#home" className="logo">LT</a>
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={closeMenu}>{t('nav.home')}</a></li>
          <li><a href="#about" onClick={closeMenu}>{t('nav.about')}</a></li>
          <li><a href="#featured" onClick={closeMenu}>{t('nav.featured')}</a></li>
          <li><a href="#projects" onClick={closeMenu}>{t('nav.projects')}</a></li>
          <li><a href="#skills" onClick={closeMenu}>{t('nav.skills')}</a></li>
          <li><a href="#contact" onClick={closeMenu}>{t('nav.contact')}</a></li>
        </ul>
        <div className="nav-right">
          <button className="language-switcher" onClick={toggleLanguage} aria-label="Change language">
            <span className={`lang-option ${language === 'tr' ? 'active' : ''}`}>TR</span>
            <span className="lang-divider">/</span>
            <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
          </button>
          <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
