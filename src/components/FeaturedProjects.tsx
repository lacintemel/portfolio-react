import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/FeaturedProjects.css';

interface Screenshot {
  src: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
}

interface FeaturedProject {
  name: string;
  taglineTr: string;
  taglineEn: string;
  descriptionTr: string;
  descriptionEn: string;
  featuresTr: string[];
  featuresEn: string[];
  technologies: string[];
  screenshots: Screenshot[];
  comingSoon?: boolean;
  github?: string;
  liveUrl?: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    name: "PayMaki",
    taglineTr: "Modern İK Yönetim Platformu",
    taglineEn: "Modern HR Management Platform",
    descriptionTr: "Kurumsal İK süreçlerini dijitalleştiren kapsamlı bir web uygulaması. Bordro yönetimi, izin takibi, satış performansı analizi ve çalışan yönetimi tek platformda.",
    descriptionEn: "A comprehensive web application that digitizes corporate HR processes. Payroll management, leave tracking, sales performance analysis, and employee management in one platform.",
    featuresTr: [
      "📊 Bordro & Maaş Yönetimi",
      "🏖️ İzin Takip Sistemi",
      "📈 Satış Performans Analizi",
      "⏰ Zaman & Mesai Takibi",
      "👥 Çalışan Yönetimi",
      "📄 Excel/PDF Export"
    ],
    featuresEn: [
      "📊 Payroll & Salary Management",
      "🏖️ Leave Tracking System",
      "📈 Sales Performance Analysis",
      "⏰ Time & Attendance Tracking",
      "👥 Employee Management",
      "📄 Excel/PDF Export"
    ],
    technologies: ["React", "Vite", "TailwindCSS", "Supabase", "PostgreSQL"],
    screenshots: [
      { src: "/images/PayMaki4.png", titleTr: "Genel Bakış", titleEn: "Dashboard", descriptionTr: "Ana dashboard ve finansal özet", descriptionEn: "Main dashboard and financial overview" },
      { src: "/images/PayMaki3.png", titleTr: "Çalışanlar", titleEn: "Employees", descriptionTr: "Personel yönetimi ve organizasyon", descriptionEn: "Personnel management and organization" },
      { src: "/images/PayMaki2.png", titleTr: "Zaman Takibi", titleEn: "Time Tracking", descriptionTr: "Mesai ve giriş-çıkış takibi", descriptionEn: "Shift and check-in/out tracking" },
      { src: "/images/PayMaki1.png", titleTr: "Performans", titleEn: "Performance", descriptionTr: "Haftalık verimlilik analizi", descriptionEn: "Weekly productivity analysis" }
    ],
    comingSoon: true,
    github: "https://github.com/lacintemel/PayMaki"
  },
  {
    name: "Kazıkmı.com",
    taglineTr: "AI Destekli Araç Fiyat Analiz Platformu",
    taglineEn: "AI-Powered Vehicle Price Analysis Platform",
    descriptionTr: "İkinci el araç piyasasında alıcıların bilinçli kararlar vermesini sağlayan yapay zekâ destekli fiyat analiz platformu. Makine öğrenmesi modelleri ile milyonlarca ilan verisi analiz edilerek doğru fiyat tahmini sunulur.",
    descriptionEn: "An AI-powered price analysis platform that enables buyers in the used vehicle market to make informed decisions. Machine learning models analyze millions of listing data to provide accurate price predictions.",
    featuresTr: [
      "📊 Kazık Skoru Analizi",
      "🔍 Piyasa Fiyat Karşılaştırması",
      "📈 Amortisman Tahmini",
      "🤖 ML Fiyat Modelleme",
      "🚗 Benzer Araç Eşleştirme",
      "📉 Pazar Trend Analizi"
    ],
    featuresEn: [
      "📊 Overpricing Score Analysis",
      "🔍 Market Price Comparison",
      "📈 Depreciation Prediction",
      "🤖 ML Price Modeling",
      "🚗 Similar Vehicle Matching",
      "📉 Market Trend Analysis"
    ],
    technologies: ["Python", "Playwright", "Pandas", "scikit-learn", "Supabase", "React", "TypeScript"],
    screenshots: [
      { src: "/images/kazikmi.png", titleTr: "Fiyat Analizi", titleEn: "Price Analysis", descriptionTr: "Araç fiyat analizi ve kazık skoru", descriptionEn: "Vehicle price analysis and overpricing score" }
    ],
    comingSoon: true,
    github: "https://github.com/lacintemel/kazikmi",
    liveUrl: "https://kazikmi.com"
  }
];

const FeaturedProjects: React.FC = () => {
  const { language, t } = useLanguage();
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
          {t('featured.title')}
        </h2>
        <p className="section-subtitle">{t('featured.subtitle')}</p>
        
        <div className="featured-grid">
          {featuredProjects.map((project, index) => (
            <div className="featured-card" key={index}>
              {project.comingSoon && (
                <div className="coming-soon-badge">
                  <span>{t('featured.comingSoon')}</span>
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
                        src={`${process.env.PUBLIC_URL || ''}${screenshot.src}`} 
                        alt={language === 'en' ? screenshot.titleEn : screenshot.titleTr}
                        loading="lazy"
                      />
                      <div className="screenshot-overlay">
                        <i className="fas fa-search-plus"></i>
                        <span>{language === 'en' ? screenshot.titleEn : screenshot.titleTr}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="featured-content">
                <div className="featured-header">
                  <h3>{project.name}</h3>
                  <span className="tagline">{language === 'en' ? project.taglineEn : project.taglineTr}</span>
                </div>
                
                <p className="featured-description">{language === 'en' ? project.descriptionEn : project.descriptionTr}</p>
                
                <div className="features-grid">
                  {(language === 'en' ? project.featuresEn : project.featuresTr).map((feature, fIndex) => (
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
                      {t('featured.liveDemo')}
                    </a>
                  )}
                  {project.comingSoon && !project.liveUrl && (
                    <span className="action-btn coming-btn disabled">
                      <i className="fas fa-clock"></i>
                      {t('featured.demoSoon')}
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
            <img src={`${process.env.PUBLIC_URL || ''}${selectedImage.src}`} alt={language === 'en' ? selectedImage.titleEn : selectedImage.titleTr} />
            <div className="lightbox-caption">
              <h4>{language === 'en' ? selectedImage.titleEn : selectedImage.titleTr}</h4>
              <p>{language === 'en' ? selectedImage.descriptionEn : selectedImage.descriptionTr}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedProjects;
