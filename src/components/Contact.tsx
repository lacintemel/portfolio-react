import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Contact.css';

const Contact: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">{t('contact.title')}</h2>
        <div className="contact-content">
          <p className="contact-text">
            {language === 'en' 
              ? "Don't hesitate to get in touch for your projects!" 
              : "Projeleriniz için benimle iletişime geçmekten çekinmeyin!"}
          </p>
          
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-details">
                <h4>{t('contact.email')}</h4>
                <a href={`mailto:${portfolioData.email}`}>{portfolioData.email}</a>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="contact-details">
                <h4>{t('contact.phone')}</h4>
                <a href={`tel:${portfolioData.phone.replace(/\s/g, '')}`}>{portfolioData.phone}</a>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-details">
                <h4>{t('contact.location')}</h4>
                <span>{language === 'en' ? 'Turkey' : portfolioData.location}</span>
              </div>
            </div>
          </div>

          <div className="contact-links">
            <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="contact-btn">
              <i className="fab fa-github"></i>
              GitHub
            </a>
            <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="contact-btn">
              <i className="fab fa-linkedin"></i>
              LinkedIn
            </a>
            <a href={`mailto:${portfolioData.email}`} className="contact-btn primary">
              <i className="fas fa-envelope"></i>
              {t('contact.sendEmail')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
