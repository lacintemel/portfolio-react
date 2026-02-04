import React from 'react';
import { portfolioData } from '../data/portfolioData';
import '../styles/Contact.css';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">İletişim</h2>
        <div className="contact-content">
          <p className="contact-text">
            Projeleriniz için benimle iletişime geçmekten çekinmeyin!
          </p>
          
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-details">
                <h4>E-posta</h4>
                <a href={`mailto:${portfolioData.email}`}>{portfolioData.email}</a>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div className="contact-details">
                <h4>Telefon</h4>
                <a href={`tel:${portfolioData.phone.replace(/\s/g, '')}`}>{portfolioData.phone}</a>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-details">
                <h4>Konum</h4>
                <span>{portfolioData.location}</span>
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
              E-posta Gönder
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
