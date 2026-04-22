import { Link } from 'react-router-dom'
import type { LandingResults } from '../../../types/landing';
import Header from '../../../components/Layout/Header';


type FrontPagePublicProps = {
  publicLand: LandingResults[]
}
const FrontPagePublic = ({ publicLand }: FrontPagePublicProps) => {
  //if (!publicLand || publicLand.length === 0) return null;
  const mockFrontPage: LandingResults[] = [
    {
            id: 0,
            title: 'Aguarde un momento',
            picture:'/public/cabañaBackground.webp',
            info_header: 'Nomades - Cabañas de pastores. Diseño, construcción y confort para tu espacio ideal.',
            description: 'Cargando...',
            enabled: true
    }]
  const info = (!publicLand || publicLand.length === 0)?  mockFrontPage[0] : publicLand[0]
  //const backgroundImageRender = info?.picture ? info.picture : '/public/cabañaBackground.webp';
 const backgroundImageRender = info?.picture
  return (
    <div className='min-vh-100 cover-container d-flex w-100 p-3 mx-auto flex-column'
      style={{ backgroundImage: `url(${backgroundImageRender})` }}>
        <Header/>
      <main className="px-3 text-center mt-5">
        <section>
          <div className='caption-title'>
            <h1>{info?.title}</h1>
            <p className='cover-p'>{info?.description}</p>
            <p className='lead'>
              <Link className='btn btn-lg fw-bold ourWorkBtn' to='/nuestro-trabajo' state={{ status: 404, message: "Página no encontrada" }}>
                Nuestro trabajo...
              </Link>
            </p>
          </div>
        </section>
        <div className='my-2'></div>
      </main>
    </div>
  );
};

export default FrontPagePublic;