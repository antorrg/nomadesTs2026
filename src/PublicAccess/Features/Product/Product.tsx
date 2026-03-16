import { useNavigate, Link } from "react-router-dom"
import type { IItem, IProduct } from "../../../types/product"

type ProductProps ={
    info: IProduct
    items: IItem[]
}

const Product = ({ info, items }:ProductProps) => {
    const navigate = useNavigate()
  return (
       <>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Proyecto: {info?.title}</h1>
            <img
                  className={`bd-placeholder-img-fluid ${info && !info.enabled? 'deactivate' : ''}`}
                  src={info?.picture!}
                  alt="Imagen"
                  style={{ maxWidth: "22rem" }}
                />
            <p className="lead text-muted">{info?.info_body}</p>
            <Link className="btn btn-sm btn-outline-secondary my-2" to="/">
              Volver
            </Link>
          </div>
        </div>
      </section>
      <section className="album.py-5.bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {items?.map((item) => (
                 <div key={item.id} className="col">
                 <div className="card shadow-sm">
                   <img className={`card-img-top ${item && !item.enabled? 'deactivate' : ''}`} src={item.picture!} alt="Card image" style={{aspectRatio:'4/3', objectFit: 'contain' }}/>
                   <div className="card-body">
                     <p className="card-text">{item.text}</p>
                     <div className="d-flex justify-content-between align-items-center">
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
    </>
  )
}

export default Product