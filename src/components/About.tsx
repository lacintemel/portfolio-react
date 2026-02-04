import React from 'react';
import { portfolioData } from '../data/portfolioData';
import '../styles/About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">Hakkımda</h2>
        <div className="about-content">
          <div className="about-image">
            <div className="image-frame">
              <img src={portfolioData.avatar} alt={portfolioData.name} />
            </div>
          </div>
          <div className="about-text">
            <p>{portfolioData.bio}</p>
            <p>
              TypeScript, Python, Java ve JavaScript gibi dillerde deneyimim var.
              Kullanıcı deneyimini ön planda tutan, ölçeklenebilir ve sürdürülebilir
              uygulamalar geliştirmeye odaklanıyorum.
            </p>
            <p>
              Özellikle AI entegrasyonları, Chrome eklentileri ve web uygulamaları
              konularında projeler geliştiriyorum.
            </p>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.projects}</span>
                <span className="stat-label">Proje</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.contributions}</span>
                <span className="stat-label">GitHub Katkısı</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.technologies}</span>
                <span className="stat-label">Teknoloji</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
