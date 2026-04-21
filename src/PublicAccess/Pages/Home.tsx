import React from 'react';
import FrontPagePublic from '../Features/FrontPage/FrontPagePublic'
import ErrorScreen from '../../ErrorBoundary/ErrorScreen';
import MyCarousel from '../Features/FrontPage/Carousel'
import Marketing from '../Features/FrontPage/Marketing';
import SocialNetworks from '../Features/FrontPage/SocialNetworks';
import Footer from '../../components/Layout/Footer';
import { useHomePageData } from '../../hooks/useHomePageData';
import Loader2 from '../../components/Loader2';

const Home: React.FC = () => {
    const {
    publicLanding,
    publicProducts,
    error,
    isInitialLoading
  } = useHomePageData()


  if (isInitialLoading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
     <Loader2/>
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