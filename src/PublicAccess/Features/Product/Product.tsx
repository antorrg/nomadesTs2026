import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import type { IItem, IProduct } from "../../../types/product"

type ProductProps ={
    info: IProduct
    items: IItem[]
}

const Product = ({ info, items }:ProductProps) => {
    const navigate = useNavigate()
    const [zoomedImg, setZoomedImg] = useState<string | null>(null);

  return (
       <>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Proyecto: {info?.title}</h1>
            <img
                  className={`bd-placeholder-img-fluid mx-auto d-block ${info && !info.enabled? 'deactivate' : ''}`}
                  src={info?.picture!}
                  alt="Imagen"
                  style={{ width: "100%", maxWidth: "22rem", objectFit: 'cover', objectPosition: 'center', cursor: 'zoom-in', transition: 'transform 0.2s ease-in-out' }}
                  onClick={() => info?.picture && setZoomedImg(info?.picture)}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            <p className="lead text-muted mt-3">{info?.info_body}</p>
            <Link className="btn btn-sm btn-outline-secondary my-2" to="/">
              Volver
            </Link>
          </div>
        </div>
      </section>
      <section className="album py-5 bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {items?.map((item) => (
                 <div key={item.id} className="col">
                 <div className="card shadow-sm h-100">
                   <img 
                      className={`card-img-top ${item && !item.enabled? 'deactivate' : ''}`} 
                      src={item.picture!} 
                      alt="Card image" 
                      style={{aspectRatio:'4/3', objectFit: 'contain', cursor: 'zoom-in', backgroundColor: '#f8f9fa'}}
                      onClick={() => item?.picture && setZoomedImg(item.picture)}
                    />
                   <div className="card-body d-flex flex-column">
                     <p className="card-text flex-grow-1">{item.text}</p>
                     <div className="d-flex justify-content-between align-items-center mt-3">
                       <div className="btn-group">
                         <button className="btn btn-sm btn-outline-secondary me-3" onClick={()=>navigate(`/detalle/item/${item.id}`)} disabled={item.id===0? true : false}>
                           Ver mas
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox / Overlay para las imágenes */}
      {zoomedImg && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out'
          }}
          onClick={() => setZoomedImg(null)}
        >
          <img 
            src={zoomedImg} 
            alt="Imagen Ampliada" 
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              borderRadius: '8px'
            }} 
          />
        </div>
      )}
    </>
  )
}

export default Product