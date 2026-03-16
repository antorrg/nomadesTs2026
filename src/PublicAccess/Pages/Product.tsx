import React from 'react'
import { useParams } from 'react-router-dom'
import { useReduxFetch } from '../../hooks/useReduxFetch'
import { getPublicProductById, clearSelectedProduct } from '../Features/Product/productSlice'
import ProductFeature from '../Features/Product/Product' // Renamed to avoid conflict
import Footer from '../../components/Layout/Footer'
import Loader2 from '../../components/Loader2'

const Product: React.FC = () => {
  const { id } = useParams()

  const { selectedPublicProduct, publicLoading } = useReduxFetch({
    action: getPublicProductById,
    arg: Number(id),
    selector: (state) => state.product,
    deps: [id],
    cleanupAction: clearSelectedProduct
  })

  // Optional: Handle metadata here using selectedPublicProduct?.info_header

  if (publicLoading) return <Loader2 />

  if (!selectedPublicProduct) return null // Or a "Not Found" component

  return (
    <>
      <title>{selectedPublicProduct.title ?? 'Cabaña'}</title>
      <meta name="description" content={selectedPublicProduct.info_header ?? 'Mas informacion en nuestra web...'} />
      <ProductFeature
        info={selectedPublicProduct}
        items={selectedPublicProduct.Items || []}
      />
      <Footer/>
    </>
  )
}

export default Product