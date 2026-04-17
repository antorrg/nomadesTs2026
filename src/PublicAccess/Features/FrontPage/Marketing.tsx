import {Link} from 'react-router-dom'
import { type ProductsResponse } from '../../../types/product';

export type ProducTypes = {
  products: ProductsResponse[]
}

const Marketing = ({products}:ProducTypes) => {
  return (
    <div className='container marketing list-group-item'>
      <div className='row ps-3'>
        {products?.map((info)=>
        <div className='col-lg-5' key={info?.id}>
          <img className={`bd-placeholder-img-fluid ${!info.enabled? 'deactivate' : ''}`}  src={info?.picture!} alt='Imagen' style={{width: "100%", maxWidth: "22rem", objectFit: 'cover', objectPosition: 'center'}}/>
          <h3 className='fw-normal mt-1'>{info?.title}</h3>
          <p>{info?.info_header}</p>
          <p><Link className='btn btn-sm btn-outline-secondary' to={`/detalle/${info?.id}`}>Ver detalles</Link></p>
        </div>
        )}
      </div>
      </div>
  )
}

export default Marketing