import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} Laçin Temel. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
