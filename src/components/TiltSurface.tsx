import React, { CSSProperties, ReactNode } from 'react';

interface TiltSurfaceProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  intensity?: number;
}

type TiltStyle = CSSProperties & {
  '--tilt-x'?: string;
  '--tilt-y'?: string;
  '--glare-x'?: string;
  '--glare-y'?: string;
};

const TiltSurface: React.FC<TiltSurfaceProps> = ({
  children,
  className = '',
  style,
  intensity = 7
}) => {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const tiltX = (0.5 - y) * intensity;
    const tiltY = (x - 0.5) * intensity;

    event.currentTarget.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`);
    event.currentTarget.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`);
  };

  const resetTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
    event.currentTarget.style.setProperty('--glare-x', '50%');
    event.currentTarget.style.setProperty('--glare-y', '50%');
  };

  const tiltStyle: TiltStyle = {
    '--tilt-x': '0deg',
    '--tilt-y': '0deg',
    '--glare-x': '50%',
    '--glare-y': '50%',
    ...style
  };

  return (
    <div
      className={`tilt-scene ${className}`.trim()}
      style={tiltStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="tilt-surface-inner">
        {children}
        <span className="tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
};

export default TiltSurface;
