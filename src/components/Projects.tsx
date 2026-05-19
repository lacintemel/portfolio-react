import React, { useState, useMemo } from 'react';
import { portfolioData, Project } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
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
  'shopping-bag': 'fa-shopping-bag',
  'chart-bar': 'fa-chart-bar'
};

// English project descriptions
const projectDescriptionsEN: Record<string, string> = {
  'Kazıkmı.com': 'AI-powered vehicle price analysis & valuation platform',
  'InterviewAI': 'NLP-based intelligent interview simulation app',
  'PayMaki': 'Modern Human Resources Management System',
  'ThatTicket.com': 'Java Swing ticket reservation system',
  'MSRS - Municipal Service Request System': 'Municipal service request system',
  'Gayrimenkul Merkezim': 'Management portal for apartment residents',
  'Sobutay Ticaret': 'Corporate website',
  'Gelatte': 'Multi-language luxury e-commerce platform',
  'Tufan Design': 'Luxury architecture portfolio website'
};

const CATEGORIES = ['All', 'Web', 'AI', 'Desktop', 'Security'];

const Projects: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  // Determine how many projects match to set staggered animation
  const filteredProjects = useMemo(() => {
    return activeCategory === 'All' 
      ? portfolioData.projects 
      : portfolioData.projects.filter(p => p.categories?.includes(activeCategory));
  }, [activeCategory]);

  const { ref: gridRef, isVisible: gridVisible, getDelay } = useStaggerReveal(filteredProjects.length, { threshold: 0.1 });

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <h2 className="section-title">
            {t('projects.title')}
            <span className="project-count">{filteredProjects.length}</span>
          </h2>
          
          <div className="project-filters">
            {CATEGORIES.map(category => (
              <button 
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div 
              className={`project-card reveal-child ${gridVisible ? 'visible' : ''}`} 
              key={`${project.name}-${index}`} 
              onClick={() => setSelectedProject(project)}
              style={getDelay(index)}
            >
              <div className="project-image">
                <div className="project-overlay">
                  <span className="view-details">
                    <i className="fas fa-expand"></i>
                  </span>
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
                <div className="project-category-badges">
                  {project.categories?.map((cat, i) => (
                    <span key={i} className="cat-badge">{cat}</span>
                  ))}
                </div>
              </div>
              
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{language === 'en' ? (projectDescriptionsEN[project.name] || project.description) : project.description}</p>
                <div className="project-tags">
                  {project.technologies.slice(0, 4).map((tech, techIndex) => (
                    <span className="tag" key={techIndex}>{tech}</span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="tag extra">+{project.technologies.length - 4}</span>
                  )}
                </div>
                
                <div className="project-card-actions">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="card-action-btn github"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fab fa-github"></i> Source
                  </a>
                  {/* Assuming liveUrl exists in Project type, though currently not in all data */}
                  <button className="card-action-btn details" onClick={() => setSelectedProject(project)}>
                    <i className="fas fa-info-circle"></i> Details
                  </button>
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
              <div className="project-tags" style={{ marginBottom: '24px' }}>
                {selectedProject.technologies.map((tech, techIndex) => (
                  <span className="tag" key={techIndex}>{tech}</span>
                ))}
              </div>
              <div className="modal-action-buttons">
                <a 
                  href={selectedProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-modal-btn github"
                >
                  <i className="fab fa-github"></i>
                  {language === 'en' ? 'View Source Code' : 'Kaynak Kodunu Gör'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
