import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import TiltSurface from './TiltSurface';
import '../styles/Experience.css';

const experienceEnglish: Record<string, { location: string; period: string; description: string[] }> = {
  'Türkiye İş Bankası': {
    location: 'Istanbul, Turkey',
    period: 'Current',
    description: [
      'Supporting corporate security processes as part of the information security team',
      'Gaining hands-on exposure to security operations, risk management, and defensive practices'
    ]
  },
  Vulnerday: {
    location: 'Turkey',
    period: 'November 2023 - May 2024',
    description: [
      'Performed penetration tests for internal and external systems',
      'Identified vulnerabilities and presented remediation recommendations',
      'Reported security vulnerabilities through bug bounty programs',
      'Built experience in attack-vector analysis and security strategy design'
    ]
  }
};

const Experience: React.FC = () => {
  const { language, t } = useLanguage();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: timelineRef, isVisible: timelineVisible, getDelay } = useStaggerReveal(
    portfolioData.experiences.length,
    { threshold: 0.12 }
  );

  return (
    <section id="experience" className="experience">
      <div className="experience-orb" aria-hidden="true" />
      <div className="container">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="section-kicker">{t('experience.kicker')}</span>
          <h2 className="section-title">{t('experience.title')}</h2>
        </div>

        <div ref={timelineRef} className="experience-timeline">
          {portfolioData.experiences.map((experience, index) => {
            const english = experienceEnglish[experience.company];
            const description = language === 'en' && english ? english.description : experience.description;

            return (
              <TiltSurface
                key={`${experience.company}-${experience.title}`}
                className={`experience-entry reveal-child ${timelineVisible ? 'visible' : ''}`}
                style={getDelay(index)}
                intensity={5}
              >
                <article className="experience-card">
                  <div className="experience-marker" aria-hidden="true">
                    <i className={index === 0 ? 'fas fa-shield-alt' : 'fas fa-terminal'} />
                  </div>
                  <div className="experience-card-header">
                    <div>
                      <span className="experience-period">
                        {language === 'en' && english ? english.period : experience.period}
                      </span>
                      <h3>{experience.title}</h3>
                      <p className="experience-company">{experience.company}</p>
                    </div>
                    <span className="experience-location">
                      <i className="fas fa-map-marker-alt" />
                      {language === 'en' && english ? english.location : experience.location}
                    </span>
                  </div>
                  <ul>
                    {description.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </TiltSurface>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
