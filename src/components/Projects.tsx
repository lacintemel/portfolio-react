import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Projects.css';

const iconMap: Record<string, string> = {
  'brain': 'fa-brain',
  'youtube': 'fa-youtube',
  'city': 'fa-city',
  'ticket': 'fa-ticket-alt',
  'credit-card': 'fa-credit-card',
  'home': 'fa-home',
  'users': 'fa-users'
};

// English project descriptions
const projectDescriptionsEN: Record<string, string> = {
  'InterviewAI': 'NLP-based intelligent interview simulation app',
  'PayMaki': 'Modern Human Resources Management System',
  'ThatTicket.com': 'Java Swing ticket reservation system',
  'MSRS - Municipal Service Request System': 'Municipal service request system',
  'Gayrimenkul Merkezim': 'Management portal for apartment residents'
};

const Projects: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{t('projects.title')}</h2>
        <div className="projects-grid">
          {portfolioData.projects.map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-image">
                <div className="project-overlay">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                </div>
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="project-logo"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const icon = target.parentElement?.querySelector('.project-icon') as HTMLElement;
                      if (icon) icon.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="project-icon" style={{ display: project.image ? 'none' : 'flex' }}>
                  <i className={`fas ${iconMap[project.icon] || 'fa-code'}`}></i>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{language === 'en' ? (projectDescriptionsEN[project.name] || project.description) : project.description}</p>
                <div className="project-tags">
                  {project.technologies.map((tech, techIndex) => (
                    <span className="tag" key={techIndex}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
