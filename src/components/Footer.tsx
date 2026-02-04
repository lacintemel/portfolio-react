import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} Laçin Temel. {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
