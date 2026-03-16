import React from 'react'

const ErrorScreen:React.FC = () => {
  return (
     <div className="error-page">
    <h1>Error</h1>
      <h2>Algo salió mal...</h2>
      <p>Estamos trabajando para solucionarlo.</p>
      <button className='btn btn-lg fw-bold ourWorkBtn'  onClick={() => window.location.reload()}>
        Reintentar
      </button>
    </div>
  )
}

export default ErrorScreen