import React from 'react';
import { portfolioData } from '../data/portfolioData';
import '../styles/Skills.css';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: 'Programlama Dilleri',
      icon: 'fa-code',
      skills: portfolioData.skills.languages
    },
    {
      title: 'Siber Güvenlik',
      icon: 'fa-shield-alt',
      skills: portfolioData.skills.security
    },
    {
      title: 'Yapay Zeka & ML',
      icon: 'fa-brain',
      skills: portfolioData.skills.ai
    },
    {
      title: 'Backend',
      icon: 'fa-server',
      skills: portfolioData.skills.backend
    },
    {
      title: 'Frontend',
      icon: 'fa-laptop-code',
      skills: portfolioData.skills.frontend
    },
    {
      title: 'Araçlar',
      icon: 'fa-tools',
      skills: portfolioData.skills.tools
    },
    {
      title: 'Konuştuğum Diller',
      icon: 'fa-language',
      skills: portfolioData.spokenLanguages
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">Yeteneklerim</h2>
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
