import React from 'react'
import { useParams } from 'react-router-dom'
import { useReduxFetch } from '../../hooks/useReduxFetch'
import { getPublicProductById, clearSelectedProduct } from '../Features/Product/productSlice'
import ProductView from '../Features/Product/ProductView' // Renamed to avoid conflict
import Footer from '../../components/Layout/Footer'
import { mockProductWithItem} from '../../PublicAccess/Features/Product/mockProduct'

const Product: React.FC = () => {
  const { id } = useParams()

  const { selectedPublicProduct, publicLoading } = useReduxFetch({
    action: getPublicProductById,
    arg: Number(id),
    selector: (state) => state.product,
    deps: [id],
    cleanupAction: clearSelectedProduct
  })


   const publicProduct = (publicLoading || !selectedPublicProduct) ? mockProductWithItem : selectedPublicProduct

  return (
    <div className='coverBackPublic'>
      <title>{selectedPublicProduct?.title ?? 'Cabaña'}</title>
      <meta name="description" content={publicProduct?.info_header ?? 'Mas informacion en nuestra web...'} />
      <ProductView
        info={publicProduct!}
        items={publicProduct?.Items || []}
        infoImg={publicLoading|| !selectedPublicProduct}
      />
      <Footer/>
    </div>
  )
}

export default Product