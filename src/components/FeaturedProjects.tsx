import React, { useState } from 'react';
import '../styles/FeaturedProjects.css';

interface Screenshot {
  src: string;
  title: string;
  description: string;
}

interface FeaturedProject {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  technologies: string[];
  screenshots: Screenshot[];
  comingSoon?: boolean;
  github?: string;
  liveUrl?: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    name: "PayMaki",
    tagline: "Modern İK Yönetim Platformu",
    description: "Kurumsal İK süreçlerini dijitalleştiren kapsamlı bir web uygulaması. Bordro yönetimi, izin takibi, satış performansı analizi ve çalışan yönetimi tek platformda.",
    features: [
      "📊 Bordro & Maaş Yönetimi",
      "🏖️ İzin Takip Sistemi",
      "📈 Satış Performans Analizi",
      "⏰ Zaman & Mesai Takibi",
      "👥 Çalışan Yönetimi",
      "📄 Excel/PDF Export"
    ],
    technologies: ["React", "Vite", "TailwindCSS", "Supabase", "PostgreSQL"],
    screenshots: [
      { src: "/images/PayMaki4.png", title: "Genel Bakış", description: "Ana dashboard ve finansal özet" },
      { src: "/images/PayMaki3.png", title: "Çalışanlar", description: "Personel yönetimi ve organizasyon" },
      { src: "/images/PayMaki2.png", title: "Zaman Takibi", description: "Mesai ve giriş-çıkış takibi" },
      { src: "/images/PayMaki1.png", title: "Performans", description: "Haftalık verimlilik analizi" }
    ],
    comingSoon: true,
    github: "https://github.com/lacintemel/PayMaki"
  }
];

const FeaturedProjects: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null);

  const openLightbox = (screenshot: Screenshot) => {
    setSelectedImage(screenshot);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="featured" className="featured-projects">
      <div className="container">
        <h2 className="section-title">
          <span className="star-icon">⭐</span>
          Öne Çıkan Projeler
        </h2>
        
        <div className="featured-grid">
          {featuredProjects.map((project, index) => (
            <div className="featured-card" key={index}>
              {project.comingSoon && (
                <div className="coming-soon-badge">
                  <span>🚀 Yakında</span>
                </div>
              )}
              
              <div className="featured-screenshots">
                <div className="screenshots-collage">
                  {project.screenshots.map((screenshot, sIndex) => (
                    <div 
                      className="screenshot-item" 
                      key={sIndex}
                      onClick={() => openLightbox(screenshot)}
                    >
                      <img 
                        src={screenshot.src} 
                        alt={screenshot.title}
                        loading="lazy"
                      />
                      <div className="screenshot-overlay">
                        <i className="fas fa-search-plus"></i>
                        <span>{screenshot.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="featured-content">
                <div className="featured-header">
                  <h3>{project.name}</h3>
                  <span className="tagline">{project.tagline}</span>
                </div>
                
                <p className="featured-description">{project.description}</p>
                
                <div className="features-grid">
                  {project.features.map((feature, fIndex) => (
                    <div className="feature-item" key={fIndex}>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="featured-tech">
                  {project.technologies.map((tech, tIndex) => (
                    <span className="tech-badge" key={tIndex}>{tech}</span>
                  ))}
                </div>
                
                <div className="featured-actions">
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-btn github-btn"
                    >
                      <i className="fab fa-github"></i>
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-btn live-btn"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      Canlı Demo
                    </a>
                  )}
                  {project.comingSoon && !project.liveUrl && (
                    <span className="action-btn coming-btn disabled">
                      <i className="fas fa-clock"></i>
                      Demo Yakında
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImage.src} alt={selectedImage.title} />
            <div className="lightbox-caption">
              <h4>{selectedImage.title}</h4>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedProjects;
