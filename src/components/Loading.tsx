import React from 'react'
//Depende de loading


const Loading:React.FC = () => {
  return (
    <div className='coverBack'>
      <div style={{minHeight:'60vh',display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <h2 className='loaderFont'>Aguarde un momento...</h2>
    <div className="loader"></div>
    </div>
    </div>
  )
}

export default Loading