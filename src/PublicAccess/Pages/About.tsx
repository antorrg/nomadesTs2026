import React from 'react';
import Header from '../../components/Layout/Header';
import AboutFeature from '../Features/About/About';
import { useAboutPageData } from '../../hooks/useAboutPageData';
import { mockAbout } from '../Features/About/mockAbout';

const About: React.FC = () => {
  const { publicAbout, publicLanding, isInitialLoading } = useAboutPageData();

  const publicMeta = publicLanding[0]?.info_header || 'Conocé quiénes somos y nuestra historia fabricando cabañas de madera con materiales de calidad.';
  const aboutItem = Array.isArray(publicAbout) && publicAbout.length > 0 ? publicAbout[0] : mockAbout[0];

  return (
    <>
      <title>Nomades Cabañas de pastores - Quienes somos</title>
      <meta name="description" content={publicMeta as string} />
      <div className="imageBack">
        <Header />
        <AboutFeature feature={aboutItem} isLoading={isInitialLoading} />
      </div>
    </>
  );
};

export default About;