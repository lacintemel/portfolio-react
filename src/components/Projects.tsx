import React from 'react';
import { portfolioData } from '../data/portfolioData';
import '../styles/Projects.css';

const iconMap: Record<string, string> = {
  'brain': 'fa-brain',
  'youtube': 'fa-youtube',
  'city': 'fa-city',
  'ticket': 'fa-ticket-alt',
  'credit-card': 'fa-credit-card',
  'home': 'fa-home'
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Projelerim</h2>
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
                <div className="project-icon">
                  <i className={`fas ${iconMap[project.icon] || 'fa-code'}`}></i>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
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
