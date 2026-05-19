import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import '../styles/About.css';

const About: React.FC = () => {
  const { language, t } = useLanguage();
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal();
  const { ref: statsRef, isVisible: statsVisible, getDelay } = useStaggerReveal(3, { threshold: 0.2 });

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

  const stats = [
    { number: portfolioData.stats.projects, label: language === 'en' ? 'Projects' : 'Proje' },
    { number: portfolioData.stats.contributions, label: language === 'en' ? 'GitHub Contributions' : 'GitHub Katkısı' },
    { number: portfolioData.stats.technologies, label: language === 'en' ? 'Technologies' : 'Teknoloji' },
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div ref={sectionRef} className={`reveal ${sectionVisible ? 'visible' : ''}`}>
          <h2 className="section-title">{t('about.title')}</h2>
        </div>
        <div className="about-content">
          <div className="about-image">
            <div className={`image-frame reveal-scale ${sectionVisible ? 'visible' : ''}`}>
              <img src={portfolioData.avatar} alt={portfolioData.name} />
            </div>
          </div>
          <div className={`about-text reveal ${sectionVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.15s' }}>
            {bioText.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
            <div ref={statsRef} className="stats">
              {stats.map((stat, index) => (
                <div
                  className={`stat-item reveal-child ${statsVisible ? '' : ''}`}
                  key={index}
                  style={getDelay(index)}
                >
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
