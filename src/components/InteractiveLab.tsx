import React, { CSSProperties, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
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

const projectLevels = ['MODA', 'KAZIKMI', 'PAYMAKI', 'INTERVIEW AI'];

const neuralNodes = [
  { idleX: '-280px', idleY: '-110px', aiX: '-165px', aiY: '-86px', delay: '0s' },
  { idleX: '250px', idleY: '-120px', aiX: '0px', aiY: '-126px', delay: '.15s' },
  { idleX: '-245px', idleY: '105px', aiX: '165px', aiY: '-86px', delay: '.3s' },
  { idleX: '285px', idleY: '110px', aiX: '185px', aiY: '66px', delay: '.45s' },
  { idleX: '-80px', idleY: '165px', aiX: '0px', aiY: '125px', delay: '.6s' },
  { idleX: '75px', idleY: '-175px', aiX: '-185px', aiY: '66px', delay: '.75s' },
  { idleX: '-330px', idleY: '10px', aiX: '-82px', aiY: '8px', delay: '.9s' },
  { idleX: '330px', idleY: '-10px', aiX: '82px', aiY: '8px', delay: '1.05s' }
];

const InteractiveLab: React.FC = () => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<LabMode>('idle');
  const viewportRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.08 });

  const modeCopy: Record<Exclude<LabMode, 'idle'>, ModeCopy> = language === 'en' ? {
    security: {
      title: 'Defend the system',
      shortTitle: 'Security Scan',
      description: 'The lab lights switch to defense mode, the shield assembles, and a live threat scan begins.',
      status: 'THREAT SCAN ACTIVE',
      icon: 'fa-shield-alt'
    },
    ai: {
      title: 'Activate the intelligence network',
      shortTitle: 'AI Network',
      description: 'Scattered data points connect around the model core and become an active neural network.',
      status: 'NEURAL CORE ONLINE',
      icon: 'fa-brain'
    },
    build: {
      title: 'Build the portfolio',
      shortTitle: 'Build Projects',
      description: 'Independent projects move into place and assemble into one layered digital structure.',
      status: 'PORTFOLIO ASSEMBLED',
      icon: 'fa-cubes'
    }
  } : {
    security: {
      title: 'Sistemi savun',
      shortTitle: 'Güvenlik Taraması',
      description: 'Laboratuvar ışıkları savunma moduna geçer, kalkan parçaları birleşir ve canlı tehdit taraması başlar.',
      status: 'TEHDİT TARAMASI AKTİF',
      icon: 'fa-shield-alt'
    },
    ai: {
      title: 'Zekâ ağını etkinleştir',
      shortTitle: 'AI Ağı',
      description: 'Dağınık veri noktaları model çekirdeğinin etrafında bağlanarak aktif bir sinir ağına dönüşür.',
      status: 'YAPAY ZEKÂ ÇEKİRDEĞİ AKTİF',
      icon: 'fa-brain'
    },
    build: {
      title: 'Portfolyoyu inşa et',
      shortTitle: 'Projeleri İnşa Et',
      description: 'Bağımsız projeler yerlerine hareket ederek katmanlı tek bir dijital yapıda birleşir.',
      status: 'PORTFOLYO YAPISI TAMAMLANDI',
      icon: 'fa-cubes'
    }
  };

  const idleCopy = language === 'en' ? {
    title: 'Digital Lab waiting',
    description: 'Hover over a mode or select it to transform the scene.',
    status: 'SYSTEM IDLE'
  } : {
    title: 'Dijital laboratuvar beklemede',
    description: 'Sahneyi dönüştürmek için bir modun üzerine gel veya seç.',
    status: 'SİSTEM BEKLEMEDE'
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
          <span className="section-kicker">{language === 'en' ? 'Interactive 3D Experience' : 'Etkileşimli 3D Deneyim'}</span>
          <h2 className="section-title">{language === 'en' ? 'Digital Security Lab' : 'Dijital Güvenlik Laboratuvarı'}</h2>
          <p>
            {language === 'en'
              ? 'Move your pointer over a mode. Watch the same workspace transform for security, AI, and software development.'
              : 'Bir modun üzerine gel. Aynı çalışma alanının siber güvenlik, AI ve yazılım geliştirme için nasıl dönüştüğünü izle.'}
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
                  <span>LT / LAB</span>
                  <i className="fas fa-fingerprint" />
                </div>
                <div className="wall-display wall-display-right">
                  <span>LIVE SYSTEM</span>
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
                    <i className={`fas ${mode === 'security' ? 'fa-shield-alt' : mode === 'ai' ? 'fa-brain' : mode === 'build' ? 'fa-cubes' : 'fa-terminal'}`} />
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
              <div className="security-orbit orbit-one" />
              <div className="security-orbit orbit-two" />
              <div className="shield-panel shield-panel-left" />
              <div className="shield-core"><i className="fas fa-shield-alt" /></div>
              <div className="shield-panel shield-panel-right" />
              <div className="scan-beam" />
              {Array.from({ length: 5 }).map((_, index) => (
                <span className={`threat-point threat-${index + 1}`} key={index}><i className="fas fa-bug" /></span>
              ))}
            </div>

            <div className="neural-system" aria-hidden="true">
              <div className="neural-core"><span>AI</span><i /><i /><i /></div>
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
                </span>
              ))}
            </div>

            <div className="project-assembly" aria-hidden="true">
              <div className="assembly-spine" />
              {projectLevels.map((project, index) => (
                <div
                  className="project-level"
                  key={project}
                  style={{ '--level': index } as SceneStyle}
                >
                  <span>{project}</span>
                  <i className={index === 0 ? 'fas fa-shield-alt' : index === 1 ? 'fas fa-chart-line' : index === 2 ? 'fas fa-users' : 'fas fa-brain'} />
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
              <small>{language === 'en' ? 'Hover or click' : 'Üzerine gel veya tıkla'}</small>
            </div>
            {(Object.keys(modeCopy) as Array<Exclude<LabMode, 'idle'>>).map((item, index) => (
              <button
                key={item}
                type="button"
                className={`lab-mode-button ${mode === item ? 'active' : ''}`}
                onPointerEnter={() => setMode(item)}
                onFocus={() => setMode(item)}
                onClick={() => setMode(item)}
                aria-pressed={mode === item}
              >
                <span className="mode-button-number">0{index + 1}</span>
                <span className="mode-button-icon"><i className={`fas ${modeCopy[item].icon}`} /></span>
                <span className="mode-button-copy">
                  <strong>{modeCopy[item].shortTitle}</strong>
                  <small>{modeCopy[item].title}</small>
                </span>
                <i className="fas fa-arrow-right mode-arrow" />
              </button>
            ))}
            <button type="button" className="lab-reset-button" onClick={() => setMode('idle')}>
              <i className="fas fa-undo-alt" />
              {language === 'en' ? 'Reset scene' : 'Sahneyi sıfırla'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveLab;
