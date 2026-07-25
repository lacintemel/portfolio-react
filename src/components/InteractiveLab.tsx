import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { portfolioData } from '../data/portfolioData';
import '../styles/InteractiveLab.css';

type LabMode = 'idle' | 'security' | 'ai' | 'build';

interface ModeCopy {
  title: string;
  shortTitle: string;
  description: string;
  status: string;
  icon: string;
}

type SceneStyle = CSSProperties & Record<`--${string}`, string | number>;

const careerLevels = ['EGE ÜNİVERSİTESİ', 'VULNERDAY', 'İŞ BANKASI', 'LAÇİN TEMEL'];

const neuralNodes = [
  { label: 'MODA', idleX: '-280px', idleY: '-110px', aiX: '-165px', aiY: '-86px', delay: '0s' },
  { label: 'InterviewAI', idleX: '250px', idleY: '-120px', aiX: '0px', aiY: '-126px', delay: '.15s' },
  { label: 'Kazıkmı', idleX: '-245px', idleY: '105px', aiX: '165px', aiY: '-86px', delay: '.3s' },
  { label: 'PayMaki', idleX: '285px', idleY: '110px', aiX: '185px', aiY: '66px', delay: '.45s' },
  { label: 'Portfolio AI', idleX: '-80px', idleY: '165px', aiX: '0px', aiY: '125px', delay: '.6s' },
  { label: 'Security', idleX: '75px', idleY: '-175px', aiX: '-185px', aiY: '66px', delay: '.75s' },
  { label: 'Python', idleX: '-330px', idleY: '10px', aiX: '-82px', aiY: '8px', delay: '.9s' },
  { label: 'React', idleX: '330px', idleY: '-10px', aiX: '82px', aiY: '8px', delay: '1.05s' }
];

const InteractiveLab: React.FC = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<LabMode>('idle');
  const [detailMode, setDetailMode] = useState<Exclude<LabMode, 'idle'> | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.08 });

  const modaProject = portfolioData.projects.find((project) => project.name === 'MODA')!;
  const detailProjects = ['MODA', 'PayMaki', 'Kazıkmı.com', 'InterviewAI'].flatMap((name) => {
    const project = portfolioData.projects.find((item) => item.name === name);
    return project ? [project] : [];
  });

  useEffect(() => {
    if (!detailMode) return;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDetailMode(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [detailMode]);

  const modeCopy: Record<Exclude<LabMode, 'idle'>, ModeCopy> = language === 'en' ? {
    security: {
      title: 'Analyze a malicious document with MODA',
      shortTitle: 'MODA Analysis',
      description: 'A suspicious Office document is separated into OOXML/OLE, macro, IOC, and YARA layers before receiving a risk score.',
      status: 'MODA STATIC ANALYSIS',
      icon: 'fa-shield-alt'
    },
    ai: {
      title: 'Connect Laçin\'s project ecosystem',
      shortTitle: 'Project Network',
      description: 'MODA, InterviewAI, Kazıkmı, PayMaki, and Portfolio AI connect through their shared Python, React, AI, and security stack.',
      status: 'LAÇİN / PROJECT NETWORK',
      icon: 'fa-brain'
    },
    build: {
      title: 'Build the career journey',
      shortTitle: 'Career Journey',
      description: 'Ege University, Vulnerday, and Türkiye İş Bankası come together as the layers shaping Laçin\'s cybersecurity career.',
      status: 'CAREER PATH ASSEMBLED',
      icon: 'fa-cubes'
    }
  } : {
    security: {
      title: 'MODA ile zararlı belgeyi analiz et',
      shortTitle: 'MODA Analizi',
      description: 'Şüpheli Office belgesi OOXML/OLE, makro, IOC ve YARA katmanlarına ayrılır; ardından risk puanı oluşturulur.',
      status: 'MODA STATİK ANALİZ',
      icon: 'fa-shield-alt'
    },
    ai: {
      title: 'Laçin\'in proje ekosistemini bağla',
      shortTitle: 'Proje Ağı',
      description: 'MODA, InterviewAI, Kazıkmı, PayMaki ve Portfolio AI; Python, React, AI ve güvenlik teknolojileri üzerinden birbirine bağlanır.',
      status: 'LAÇİN / PROJE AĞI',
      icon: 'fa-brain'
    },
    build: {
      title: 'Kariyer yolculuğunu inşa et',
      shortTitle: 'Kariyer Yolculuğu',
      description: 'Ege Üniversitesi, Vulnerday ve Türkiye İş Bankası; Laçin\'in siber güvenlik kariyerini oluşturan katmanlar olarak birleşir.',
      status: 'KARİYER YOLU TAMAMLANDI',
      icon: 'fa-cubes'
    }
  };

  const idleCopy = language === 'en' ? {
    title: 'Laçin\'s portfolio is ready',
    description: 'Choose a real project or career story to transform the scene.',
    status: 'LAÇİN TEMEL / PORTFOLIO'
  } : {
    title: 'Laçin\'in portfolyosu hazır',
    description: 'Sahneyi dönüştürmek için gerçek bir proje veya kariyer hikâyesi seç.',
    status: 'LAÇİN TEMEL / PORTFOLYO'
  };

  const activeCopy = mode === 'idle' ? idleCopy : modeCopy[mode];

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !viewportRef.current) return;

    const bounds = viewportRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    viewportRef.current.style.setProperty('--room-rotate-y', `${((x - 0.5) * 8).toFixed(2)}deg`);
    viewportRef.current.style.setProperty('--room-rotate-x', `${((0.5 - y) * 5).toFixed(2)}deg`);
    viewportRef.current.style.setProperty('--pointer-x', `${(x * 100).toFixed(1)}%`);
    viewportRef.current.style.setProperty('--pointer-y', `${(y * 100).toFixed(1)}%`);
  };

  const resetPerspective = () => {
    viewportRef.current?.style.setProperty('--room-rotate-y', '0deg');
    viewportRef.current?.style.setProperty('--room-rotate-x', '0deg');
  };

  return (
    <section id="lab" className={`interactive-lab lab-mode-${mode}`} ref={sectionRef}>
      <div className="lab-background-grid" aria-hidden="true" />
      <div className="container">
        <header className={`lab-intro reveal ${isVisible ? 'visible' : ''}`}>
          <span className="section-kicker">{language === 'en' ? 'Laçin Temel / Interactive Story' : 'Laçin Temel / Etkileşimli Hikâye'}</span>
          <h2 className="section-title">{language === 'en' ? 'Explore My Digital Journey' : 'Dijital Yolculuğumu Keşfet'}</h2>
          <p>
            {language === 'en'
              ? 'Explore how my projects, technologies, and career milestones connect by moving over the three stories below.'
              : 'Aşağıdaki üç hikâyenin üzerine gelerek projelerimin, teknolojilerimin ve kariyer adımlarımın nasıl bağlandığını keşfet.'}
          </p>
        </header>

        <div className={`lab-experience reveal-scale ${isVisible ? 'visible' : ''}`}>
          <div
            className="lab-viewport"
            ref={viewportRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPerspective}
          >
            <div className="lab-ambient-light" aria-hidden="true" />
            <div className="lab-room" aria-hidden="true">
              <div className="lab-wall">
                <span className="wall-light wall-light-left" />
                <span className="wall-light wall-light-right" />
                <div className="wall-display wall-display-left">
                  <span>LAÇİN / PORTFOLIO</span>
                  <i className="fas fa-fingerprint" />
                </div>
                <div className="wall-display wall-display-right">
                  <span>CYBER · AI · SOFTWARE</span>
                  <span className="display-bars"><i /><i /><i /><i /></span>
                </div>
              </div>
              <div className="lab-floor"><span /></div>
            </div>

            <div className="lab-console" aria-hidden="true">
              <div className="console-top">
                <div className="console-screen">
                  <div className="screen-topline">
                    <span className="screen-dot" />
                    <span>{activeCopy.status}</span>
                  </div>
                  <div className="screen-symbol">
                    <i className={`fas ${mode === 'security' ? 'fa-file-shield' : mode === 'ai' ? 'fa-diagram-project' : mode === 'build' ? 'fa-briefcase' : 'fa-terminal'}`} />
                  </div>
                  <div className="screen-readout"><i /><i /><i /><i /><i /></div>
                </div>
                <div className="console-frame" />
              </div>
              <div className="console-neck" />
              <div className="console-desk">
                <span className="desk-keyboard" />
                <span className="desk-line" />
              </div>
            </div>

            <div className="security-system" aria-hidden="true">
              <div className="moda-file-card">
                <i className="fas fa-file-word" />
                <span>sample.docm</span>
                <small>MACRO ENABLED</small>
              </div>
              <div className="moda-risk-card">
                <span>MODA RISK</span>
                <strong>87</strong>
                <small>/ 100</small>
              </div>
              <div className="security-orbit orbit-one" />
              <div className="security-orbit orbit-two" />
              <div className="shield-panel shield-panel-left"><span>OOXML · OLE</span><small>STRUCTURE</small></div>
              <div className="shield-core"><i className="fas fa-shield-alt" /></div>
              <div className="shield-panel shield-panel-right"><span>IOC · YARA</span><small>INTELLIGENCE</small></div>
              <div className="scan-beam" />
              {Array.from({ length: 5 }).map((_, index) => (
                <span className={`threat-point threat-${index + 1}`} key={index}><i className="fas fa-bug" /></span>
              ))}
            </div>

            <div className="neural-system" aria-hidden="true">
              <div className="neural-core"><span>LT</span><i /><i /><i /></div>
              <div className="neural-rings"><i /><i /><i /></div>
              {neuralNodes.map((node, index) => (
                <span
                  className="neural-node"
                  key={index}
                  style={{
                    '--idle-x': node.idleX,
                    '--idle-y': node.idleY,
                    '--ai-x': node.aiX,
                    '--ai-y': node.aiY,
                    '--node-delay': node.delay
                  } as SceneStyle}
                >
                  <i />
                  <small>{node.label}</small>
                </span>
              ))}
            </div>

            <div className="portfolio-preview-system" aria-hidden="true">
              <figure className="portfolio-preview preview-paymaki">
                <img src={`${process.env.PUBLIC_URL || ''}/images/PayMaki4.png`} alt="" />
                <figcaption>PayMaki</figcaption>
              </figure>
              <figure className="portfolio-preview preview-kazikmi">
                <img src={`${process.env.PUBLIC_URL || ''}/images/kazikmi.png`} alt="" />
                <figcaption>Kazıkmı.com</figcaption>
              </figure>
              <figure className="portfolio-preview preview-interview">
                <img src={`${process.env.PUBLIC_URL || ''}/images/InterviewAi.png`} alt="" />
                <figcaption>InterviewAI</figcaption>
              </figure>
            </div>

            <div className="project-assembly" aria-hidden="true">
              <div className="assembly-spine" />
              {careerLevels.map((project, index) => (
                <div
                  className="project-level"
                  key={project}
                  style={{ '--level': index } as SceneStyle}
                >
                  <span>{project}</span>
                  <i className={index === 0 ? 'fas fa-graduation-cap' : index === 1 ? 'fas fa-user-secret' : index === 2 ? 'fas fa-building-columns' : 'fas fa-fingerprint'} />
                </div>
              ))}
              <div className="assembly-beacon"><i className="fas fa-code" /></div>
            </div>

            <div className="lab-scene-caption">
              <span className="caption-index">0{mode === 'idle' ? 0 : mode === 'security' ? 1 : mode === 'ai' ? 2 : 3}</span>
              <div>
                <strong>{activeCopy.title}</strong>
                <p>{activeCopy.description}</p>
              </div>
            </div>
          </div>

          <div className="lab-controls">
            <div className="lab-controls-heading">
              <span>{language === 'en' ? 'SELECT MODE' : 'MOD SEÇ'}</span>
              <small>{language === 'en' ? 'Hover to preview · click for details' : 'Önizleme için üzerine gel · detay için tıkla'}</small>
            </div>
            {(Object.keys(modeCopy) as Array<Exclude<LabMode, 'idle'>>).map((item, index) => (
              <button
                key={item}
                type="button"
                className={`lab-mode-button ${mode === item ? 'active' : ''}`}
                onPointerEnter={() => setMode(item)}
                onFocus={() => setMode(item)}
                onClick={() => {
                  setMode(item);
                  setDetailMode(item);
                }}
                aria-pressed={mode === item}
                aria-haspopup="dialog"
              >
                <span className="mode-button-number">0{index + 1}</span>
                <span className="mode-button-icon"><i className={`fas ${modeCopy[item].icon}`} /></span>
                <span className="mode-button-copy">
                  <strong>{modeCopy[item].shortTitle}</strong>
                  <small>{modeCopy[item].title}</small>
                </span>
                <i className="fas fa-up-right-from-square mode-arrow" />
              </button>
            ))}
            <button type="button" className="lab-reset-button" onClick={() => setMode('idle')}>
              <i className="fas fa-undo-alt" />
              {language === 'en' ? 'Reset scene' : 'Sahneyi sıfırla'}
            </button>
          </div>
        </div>
      </div>

      {detailMode && createPortal(
        <div className={`lab-detail-overlay detail-${detailMode}`} onClick={() => setDetailMode(null)}>
          <div
            className="lab-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="lab-detail-close"
              onClick={() => setDetailMode(null)}
              aria-label={language === 'en' ? 'Close details' : 'Detayları kapat'}
            >
              <i className="fas fa-times" />
            </button>

            <header className="lab-detail-header">
              <span>0{detailMode === 'security' ? 1 : detailMode === 'ai' ? 2 : 3} / {language === 'en' ? 'DEEP DIVE' : 'DETAY GÖRÜNÜMÜ'}</span>
              <div className="lab-detail-title-row">
                <div className="lab-detail-icon"><i className={`fas ${modeCopy[detailMode].icon}`} /></div>
                <div>
                  <h3 id="lab-detail-title">{modeCopy[detailMode].shortTitle}</h3>
                  <p>{modeCopy[detailMode].title}</p>
                </div>
              </div>
            </header>

            {detailMode === 'security' && (
              <div className="lab-detail-body moda-detail-body">
                <div className="moda-detail-visual">
                  <div className="moda-detail-document">
                    <i className="fas fa-file-word" />
                    <span>sample.docm</span>
                  </div>
                  <div className="moda-detail-flow">
                    <span>OOXML / OLE</span><i />
                    <span>MACRO</span><i />
                    <span>IOC / YARA</span><i />
                    <strong>87<small>/100</small></strong>
                  </div>
                </div>
                <div className="moda-detail-copy">
                  <p>{modaProject.longDescription}</p>
                  <div className="lab-detail-metrics">
                    <div><strong>25+</strong><span>{language === 'en' ? 'Document formats' : 'Belge formatı'}</span></div>
                    <div><strong>0–100</strong><span>{language === 'en' ? 'Risk scoring' : 'Risk puanlama'}</span></div>
                    <div><strong>4</strong><span>{language === 'en' ? 'Report formats' : 'Rapor formatı'}</span></div>
                  </div>
                  <div className="lab-detail-actions">
                    <a href={modaProject.github} target="_blank" rel="noopener noreferrer" className="lab-detail-primary">
                      <i className="fab fa-github" /> {language === 'en' ? 'View MODA' : 'MODA\'yı İncele'}
                    </a>
                    <a href="#projects" onClick={() => setDetailMode(null)} className="lab-detail-secondary">
                      {language === 'en' ? 'All projects' : 'Tüm projeler'} <i className="fas fa-arrow-down" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {detailMode === 'ai' && (
              <div className="lab-detail-body project-detail-body">
                <div className="lab-project-detail-intro">
                  <p>
                    {language === 'en'
                      ? 'Four real products, connected by cybersecurity, artificial intelligence, and full-stack engineering.'
                      : 'Siber güvenlik, yapay zekâ ve full-stack geliştirme ortak paydasında buluşan dört gerçek proje.'}
                  </p>
                  <a href="#projects" onClick={() => setDetailMode(null)}>
                    {language === 'en' ? 'Open project section' : 'Projeler bölümünü aç'} <i className="fas fa-arrow-down" />
                  </a>
                </div>
                <div className="lab-project-detail-grid">
                  {detailProjects.map((project) => (
                    <a
                      className="lab-project-detail-card"
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={project.name}
                    >
                      <div className="lab-project-detail-image">
                        {project.image ? (
                          <img src={`${process.env.PUBLIC_URL || ''}${project.image}`} alt={project.name} />
                        ) : (
                          <i className="fas fa-shield-alt" />
                        )}
                      </div>
                      <div className="lab-project-detail-content">
                        <span>{project.categories.join(' · ')}</span>
                        <h4>{project.name}</h4>
                        <p>{project.description}</p>
                        <div>{project.technologies.slice(0, 3).map((tech) => <small key={tech}>{tech}</small>)}</div>
                      </div>
                      <i className="fas fa-arrow-up-right-from-square card-external-icon" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {detailMode === 'build' && (
              <div className="lab-detail-body career-detail-body">
                <div className="career-detail-line" aria-hidden="true" />
                <article className="career-detail-item current">
                  <div className="career-detail-marker"><i className="fas fa-building-columns" /></div>
                  <div>
                    <span>{language === 'en' ? 'CURRENT' : 'GÜNCEL'}</span>
                    <h4>Information Security Intern</h4>
                    <p>Türkiye İş Bankası</p>
                    <small>{language === 'en' ? 'Corporate information security and defensive operations' : 'Kurumsal bilgi güvenliği ve savunma operasyonları'}</small>
                  </div>
                </article>
                <article className="career-detail-item">
                  <div className="career-detail-marker"><i className="fas fa-user-secret" /></div>
                  <div>
                    <span>2023 — 2024</span>
                    <h4>Cyber Security Analyst</h4>
                    <p>Vulnerday</p>
                    <small>{language === 'en' ? 'Penetration testing, vulnerability analysis, and bug bounty' : 'Penetrasyon testi, zafiyet analizi ve bug bounty'}</small>
                  </div>
                </article>
                <article className="career-detail-item">
                  <div className="career-detail-marker"><i className="fas fa-graduation-cap" /></div>
                  <div>
                    <span>2022 — 2027</span>
                    <h4>{language === 'en' ? 'Computer Engineering' : 'Bilgisayar Mühendisliği'}</h4>
                    <p>{language === 'en' ? 'Ege University' : 'Ege Üniversitesi'}</p>
                    <small>{language === 'en' ? 'Software, networks, AI, and cybersecurity foundation' : 'Yazılım, ağlar, AI ve siber güvenlik temeli'}</small>
                  </div>
                </article>
                <a href="#experience" onClick={() => setDetailMode(null)} className="career-detail-link">
                  {language === 'en' ? 'View full experience' : 'Tüm deneyimi gör'} <i className="fas fa-arrow-down" />
                </a>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default InteractiveLab;
