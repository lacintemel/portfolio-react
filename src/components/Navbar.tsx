import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useActiveSection } from '../hooks/useScrollReveal';
import '../styles/Navbar.css';

const sectionIds = ['home', 'about', 'featured', 'projects', 'skills', 'contact'];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" className="logo">LT</a>
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          {sectionIds.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={closeMenu}
                className={activeSection === id ? 'active' : ''}
              >
                {t(`nav.${id === 'featured' ? 'featured' : id}`)}
              </a>
            </li>
          ))}
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
