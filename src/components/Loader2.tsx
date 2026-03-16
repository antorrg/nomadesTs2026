import React from 'react'
//depende de: './loadingWagon.css'

interface LoaderProps {
  scale?: number;
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loader2: React.FC<LoaderProps> = ({
  scale = 1,
  fullScreen = true,
  text = "Aguarde un momento...",
  className = ""
}) => {
  const containerStyle: React.CSSProperties = fullScreen
    ? { minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }
    : { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' };

  return (
    <div className={`${fullScreen ? 'coverBack' : ''} ${className}`}>
      <div style={containerStyle}>
        {text && <h2 className='loaderFont'>{text}</h2>}
        <div className="loader2-container" style={{ fontSize: `${scale * 10}px` }}>
          <div className="loader2"></div>
          <div className="wagon-loader" role="status" aria-label="Cargando">
            <div className="wagon-rustic">
              <div className="door"></div>
              <div className="window window--left"></div>
              <div className="window window--right"></div>
              <span className="wheel wheel--left"></span>
              <span className="wheel wheel--right"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loader2