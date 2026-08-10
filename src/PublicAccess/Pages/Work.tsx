import React from 'react';
import OurWork from '../Features/Work/OurWork';
import Header from '../../components/Layout/Header';
import { useWorkPageData } from '../../hooks/useWorkPageData';
import { mockWork } from '../../Admin/Features/Work/components/mockWork';

const Work: React.FC = () => {
  const { publicWorks, publicLanding, isInitialLoading } = useWorkPageData();

  const publicMeta = publicLanding[0]?.info_header || 'Tambien puedes coordinar con nosotros una visita a nuestras instalaciones';
  const infoWorks = Array.isArray(publicWorks) && publicWorks.length > 0 ? publicWorks : mockWork;

  return (
    <>
      <title>Nomades Cabañas de pastores Nuestro trabajo</title>
      <meta name="description" content={publicMeta as string} />
      <div className="imageBack">
        <Header/>
        <OurWork featurettes={infoWorks} isLoading={isInitialLoading} />
      </div>
    </>
  );
};

export default Work;