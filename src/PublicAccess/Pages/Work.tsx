import { getPublicWorks } from '../Features/Work/workSlice';
import OurWork from '../Features/Work/OurWork';
import Header from '../../components/Layout/Header';
import { getPublicLanding } from '../Features/FrontPage/homeSlice';
import { useReduxFetch } from '../../hooks/useReduxFetch'
import { mockWork } from '../../Admin/Features/Work/components/mockWork';

const Work: React.FC = () => {
  const { publicWorks } = useReduxFetch({ action: getPublicWorks, selector: (state) => state.work })
  const { publicLanding } = useReduxFetch({ action: getPublicLanding, selector: (state) => state.home })
  const publicMeta = publicLanding[0]?.info_header || 'Tambien puedes coordinar con nosotros una visita a nuestras instalaciones';
  const infoWorks = Array.isArray(publicWorks)? publicWorks : mockWork
  return (
    <>
      <title>Nomades Cabañas de pastores Nuestro trabajo</title>
      <meta name="description" content={publicMeta as string} />
      <div className="imageBack">
        <Header/>
        <OurWork featurettes={infoWorks} />
      </div>
    </>
  )
}

export default Work