import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#home" className="footer-logo">LT</a>
            <p className="footer-tagline">
              {language === 'en' 
                ? 'Building secure, scalable, and modern digital experiences.' 
                : 'Güvenli, ölçeklenebilir ve modern dijital deneyimler inşa ediyorum.'}
            </p>
          </div>
          
          <div className="footer-links-group">
            <h4>{language === 'en' ? 'Quick Links' : 'Hızlı Bağlantılar'}</h4>
            <div className="footer-links">
              <a href="#about">{t('nav.about')}</a>
              <a href="#featured">{t('nav.featured')}</a>
              <a href="#projects">{t('nav.projects')}</a>
              <a href="#skills">{t('nav.skills')}</a>
            </div>
          </div>
          
          <div className="footer-social">
            <h4>{language === 'en' ? 'Connect' : 'Bağlantı Kur'}</h4>
            <div className="social-icons">
              <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={portfolioData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href={`mailto:${portfolioData.email}`} aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} {portfolioData.name}. {t('footer.rights')}</p>
          <p className="made-with">
            {t('footer.madeWith')} <span className="footer-heart">❤</span> in Izmir
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
