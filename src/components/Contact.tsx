import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import '../styles/Contact.css';

const Contact: React.FC = () => {
  const { language, t } = useLanguage();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: contentRef, isVisible: contentVisible, getDelay } = useStaggerReveal(3, { threshold: 0.1 });

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <h2 className="section-title">{t('contact.title')}</h2>
        </div>
        
        <div ref={contentRef} className="contact-content">
          <p className={`contact-text reveal-child ${contentVisible ? 'visible' : ''}`} style={getDelay(0)}>
            {language === 'en' 
              ? "Don't hesitate to get in touch for your projects! Whether you have a question or just want to say hi, I'll try my best to get back to you." 
              : "Projeleriniz için benimle iletişime geçmekten çekinmeyin! Bir sorunuz varsa veya sadece merhaba demek isterseniz, size geri dönmek için elimden geleni yapacağım."}
          </p>
          
          <div className={`contact-info reveal-child ${contentVisible ? 'visible' : ''}`} style={getDelay(1)}>
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
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-details">
                <h4>{t('contact.location')}</h4>
                <span>{language === 'en' ? 'Turkey' : portfolioData.location}</span>
              </div>
            </div>
          </div>

          <div className={`contact-links reveal-child ${contentVisible ? 'visible' : ''}`} style={getDelay(2)}>
            <a href={`mailto:${portfolioData.email}`} className="contact-btn primary">
              <i className="fas fa-paper-plane"></i>
              {t('contact.sendEmail')}
            </a>
            {/* If there's a CV to download, it could go here as well, matching the Hero section CTA */}
            <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="contact-btn outline">
              <i className="fab fa-linkedin"></i>
              LinkedIn
            </a>
            <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="contact-btn outline">
              <i className="fab fa-github"></i>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
