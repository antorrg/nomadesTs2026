import { Carousel } from 'react-bootstrap';
import { type ProductsResponse } from '../../../types/product';
import { mockProduct } from './mockProduct';

export type ProducTypes = {
  products: ProductsResponse[]
}

const MyCarousel = ({ products }:ProducTypes) => {
 
  const info = (!products|| products.length === 0)? mockProduct : products
  return (
    <Carousel>
      {info?.map((item, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={item.picture!}
            alt={item.title!}
            loading="lazy"
            width= '100%'
            style={{ objectFit: 'cover' }}
          />
          <Carousel.Caption className='carousel-caption'>
            <h2 className='h3'>{item.title}</h2>
            <p>{item.info_header}</p>
            <p>
              <a className="btn btn-lg btn-ligth fw-bold border-white bg-white" href={`/detalle/${item.id}`} rel="noreferrer">
                Vea mas...
              </a>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
