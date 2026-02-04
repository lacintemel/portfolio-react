import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import '../styles/About.css';

const About: React.FC = () => {
  const { language, t } = useLanguage();

  const bioTextEn = [
    "I'm a passionate professional committed to building a career in cybersecurity. I'm a fast learner with a team-oriented and collaborative approach.",
    "I have experience in TypeScript, Python, Java, and JavaScript. I focus on developing scalable and sustainable applications that prioritize user experience.",
    "I especially develop projects on AI integrations, Chrome extensions, and web applications."
  ];

  const bioTextTr = [
    portfolioData.bio,
    "TypeScript, Python, Java ve JavaScript gibi dillerde deneyimim var. Kullanıcı deneyimini ön planda tutan, ölçeklenebilir ve sürdürülebilir uygulamalar geliştirmeye odaklanıyorum.",
    "Özellikle AI entegrasyonları, Chrome eklentileri ve web uygulamaları konularında projeler geliştiriyorum."
  ];

  const bioText = language === 'en' ? bioTextEn : bioTextTr;

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">{t('about.title')}</h2>
        <div className="about-content">
          <div className="about-image">
            <div className="image-frame">
              <img src={portfolioData.avatar} alt={portfolioData.name} />
            </div>
          </div>
          <div className="about-text">
            {bioText.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.projects}</span>
                <span className="stat-label">{language === 'en' ? 'Projects' : 'Proje'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.contributions}</span>
                <span className="stat-label">{language === 'en' ? 'GitHub Contributions' : 'GitHub Katkısı'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{portfolioData.stats.technologies}</span>
                <span className="stat-label">{language === 'en' ? 'Technologies' : 'Teknoloji'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
