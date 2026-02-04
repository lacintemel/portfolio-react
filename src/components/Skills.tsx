import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Skills.css';

const Skills: React.FC = () => {
  const { language, t } = useLanguage();

  const skillCategories = [
    {
      title: t('skills.languages'),
      icon: 'fa-code',
      skills: portfolioData.skills.languages
    },
    {
      title: t('skills.security'),
      icon: 'fa-shield-alt',
      skills: portfolioData.skills.security
    },
    {
      title: t('skills.ai'),
      icon: 'fa-brain',
      skills: portfolioData.skills.ai
    },
    {
      title: t('skills.backend'),
      icon: 'fa-server',
      skills: portfolioData.skills.backend
    },
    {
      title: t('skills.frontend'),
      icon: 'fa-laptop-code',
      skills: portfolioData.skills.frontend
    },
    {
      title: t('skills.tools'),
      icon: 'fa-tools',
      skills: portfolioData.skills.tools
    },
    {
      title: language === 'en' ? 'Spoken Languages' : 'Konuştuğum Diller',
      icon: 'fa-language',
      skills: portfolioData.spokenLanguages
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">{t('skills.title')}</h2>
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div className="skill-category" key={index}>
              <h3>
                <i className={`fas ${category.icon}`}></i>
                {category.title}
              </h3>
              <div className="skill-items">
                {category.skills.map((skill, skillIndex) => (
                  <div className="skill-item" key={skillIndex}>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
