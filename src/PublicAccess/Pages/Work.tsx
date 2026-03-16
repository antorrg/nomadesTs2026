import { getPublicWorks } from '../Features/Work/workSlice';
import OurWork from '../Features/Work/OurWork';
import { getPublicLanding } from '../Features/FrontPage/homeSlice';
import { useReduxFetch } from '../../hooks/useReduxFetch'
import Header from '../../components/Layout/Header'

const Work:React.FC = () => {
    const {publicWorks} = useReduxFetch({action: getPublicWorks, selector: (state) => state.work})
    const {publicLanding} = useReduxFetch({action: getPublicLanding , selector: (state) => state.home})
    const publicMeta = publicLanding[0]?.info_header || 'Tambien puedes coordinar con nosotros una visita a nuestras instalaciones';
  return (
  <>
    <title>Nomades Cabañas de pastores Nuestro trabajo</title>
    <meta name="description" content={publicMeta as string} />
      <div className="imageBack">
        <Header/>
        <OurWork featurettes={publicWorks}/>
      </div>
  </>
  )
}

export default Work