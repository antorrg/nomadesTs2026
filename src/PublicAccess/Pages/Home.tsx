import React from 'react';
import FrontPagePublic from '../Features/FrontPage/FrontPagePublic'
import { getPublicLanding, clearError } from '../Features/FrontPage/homeSlice';
import { getPublicProducts } from '../Features/Product/productSlice';
import ErrorScreen from '../../ErrorBoundary/ErrorScreen';
import Loading from '../../components/Loading';
import { useReduxFetch } from '../../hooks/useReduxFetch';
import MyCarousel from '../Features/FrontPage/Carousel'
import Marketing from '../Features/FrontPage/Marketing';
import SocialNetworks from '../Features/FrontPage/SocialNetworks';
import Footer from '../../components/Layout/Footer';

const Home: React.FC = () => {
  const { publicLanding, publicLoading, error } = useReduxFetch({
    action: getPublicLanding,
    selector: (state) => state.home,
    cleanupAction: clearError // Limpiamos errores al desmontar
  });
  const { publicProducts } = useReduxFetch({
    action: getPublicProducts,
    selector: (state) => state.product,
    cleanupAction: clearError
  })

  if (publicLoading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
     <Loading/>
    </div>;
  }

  if (error) {
    return (
      <div className='min-vh-100 d-flex w-100 p-3 mx-auto ms-3 flex-column'>
        <ErrorScreen />
      </div>
    );
  }

  const publicMeta = publicLanding[0]?.info_header || 'Fabricamos cabañas de madera con materiales de calidad';
  return (
    <div>
      <title>Nomades Cabañas de pastores</title>
      <meta name="description" content={publicMeta as string} />
      <section>
        <FrontPagePublic publicLand={publicLanding} />
        <div className='mx-2 '></div>
      </section>
      <section>
        <br className='feturette-divider'></br>

        <MyCarousel products={publicProducts} />
        <Marketing products={publicProducts} />

      </section>
      <hr className='featurette-divider'></hr>
      <SocialNetworks />
      <Footer />
    </div>
  )
}

export default Home