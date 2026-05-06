import {Link} from 'react-router-dom'
import { type ProductsResponse } from '../../../types/product';
import { mockProduct } from './mockProduct';
import LoadingImage from '../../../components/LoadingImages/LoadingImage';

export type ProducTypes = {
  products: ProductsResponse[]
  infoImg: boolean
}

const Marketing = ({products, infoImg}:ProducTypes) => {

  const info = (!products|| products.length === 0)? mockProduct : products
  return (
    <div className='container marketing list-group-item'>
      <div className='row ps-3'>
        {info?.map((info)=>
        <div className='col-lg-5' key={info?.id}>
          {!infoImg?
          <img className={`bd-placeholder-img-fluid ${!info.enabled? 'deactivate' : ''}`}  
              src={info?.picture!} 
              alt='Imagen'
              width={600}
              loading="lazy"
              decoding="async" 
              style={{width: "100%", maxWidth: "22rem", objectFit: 'cover', objectPosition: 'center'}}/>
              :
              <LoadingImage
              className={`bd-placeholder-img-fluid ${!info.enabled? 'deactivate' : ''}`} 
              style={{width: "100%", maxWidth: "22rem", objectFit: 'cover', objectPosition: 'center'}} 
              />
            }
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