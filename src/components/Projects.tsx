import React, { useState } from 'react';
import { portfolioData, Project } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Projects.css';

const iconMap: Record<string, string> = {
  'brain': 'fa-brain',
  'youtube': 'fa-youtube',
  'city': 'fa-city',
  'ticket': 'fa-ticket-alt',
  'credit-card': 'fa-credit-card',
  'home': 'fa-home',
  'users': 'fa-users',
  'briefcase': 'fa-briefcase',
  'shopping-cart': 'fa-shopping-cart',
  'building': 'fa-building',
  'shopping-bag': 'fa-shopping-bag'
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">{t('projects.title')}</h2>
        <div className="projects-grid">
          {portfolioData.projects.map((project, index) => (
            <div className="project-card" key={index} onClick={() => setSelectedProject(project)} style={{ cursor: 'pointer' }}>
              <div className="project-image">
                <div className="project-overlay">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fab fa-github"></i>
                  </a>
                </div>
                {project.image ? (
                  <img 
                    src={`${process.env.PUBLIC_URL || ''}${project.image}`} 
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

      {/* Project Modal */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="project-modal-close" onClick={() => setSelectedProject(null)}>
              <i className="fas fa-times"></i>
            </button>
            {selectedProject.image ? (
              <div className="project-modal-image">
                <img src={`${process.env.PUBLIC_URL || ''}${selectedProject.image}`} alt={selectedProject.name} />
              </div>
            ) : (
              <div className="project-modal-image-placeholder">
                <i className={`fas ${iconMap[selectedProject.icon] || 'fa-code'}`}></i>
              </div>
            )}
            <div className="project-modal-info">
              <h3>{selectedProject.name}</h3>
              <p className="project-modal-description">
                {language === 'en' ? (projectDescriptionsEN[selectedProject.name] || selectedProject.description) : selectedProject.description}
              </p>
              <p className="project-modal-long-description">
                {selectedProject.longDescription}
              </p>
              <div className="project-tags" style={{ marginBottom: '20px' }}>
                {selectedProject.technologies.map((tech, techIndex) => (
                  <span className="tag" key={techIndex}>{tech}</span>
                ))}
              </div>
              <a 
                href={selectedProject.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-modal-btn"
              >
                <i className="fab fa-github" style={{ marginRight: '8px' }}></i>
                {language === 'en' ? 'View Source' : 'Kaynak Kodu Gör'}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
