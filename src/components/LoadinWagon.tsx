import React from 'react'
//depende de: './loadingWagon.css'

const LoadingWagon:React.FC = () => {
  return (
    <div className='coverBack'>
      <div style={{minHeight:'60vh',display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <h2 className='loaderFont'>Aguarde un momento...</h2>
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
  )
}

export default LoadingWagon