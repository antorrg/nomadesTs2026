import { Link } from "react-router-dom";
import { useReduxFetch } from '../../../hooks/useReduxFetch';
import { getAllLanding } from './homeaAdminSlice';
import Loader2 from '../../../components/Loader2';
import FrontPageSwitcher from "./FrontPageSwitcher";
//import "../../../views/styles/item.css"

  const mockHome = {
    id: 0,
    title: 'Aguarde un momento', 
    picture: '',
    info_header: 'Nomades...',
    description: 'Sin descripcion',
    enabled: true,
    showMarketing:true,
    showHighLights: true
   

  }

const AdminFrontPage= () => {

  const {landing, adminLoading } = useReduxFetch({
    action: getAllLanding,
    selector: (state) => state.adminHome,
  })
      const loaderSelect = adminLoading ?? false
 

  const info =  landing? landing[0] : mockHome
 

  return (
  <section className="container">
        {loaderSelect? 
          <Loader2
        fullScreen={false}
        scale={0.5}
        />
        :
        
    <div className=" py-5 row py-lg-5">
        <div className="col-lg-6 col-md-8 col-sm-12 mx-auto text-center">
          {info && (
            <FrontPageSwitcher
            key={info.id}
            data={info}
            />
          )}
            {(info?.id !==0)?
              <> 
              <h2 className="fw-light">Gestion de portada:</h2>
              <Link className="btn btn-sm btn-outline-success mb-3" to={`/admin/front-page/${info?.id}/edicion`}>Editar</Link>
              </>
              :
              <Link className="btn btn-sm btn-outline-danger me-3 mb-3" to='/admin/front-page/creacion'>Crear</Link>
              }
        <h4>Titulo:</h4>
            <p className="lead text-muted">{info?.title}</p>
        <img
              className="bd-placeholder-img-fluid mb-3"
              src={info?.picture}
              alt="Imagen"
              style={{ maxWidth: "100%", height:'auto' }}
            />
            <h4>Info posicionamiento:</h4>
            <p className="lead text-muted">{info?.info_header}</p>
            <hr></hr>
            <h4>Descripcion:</h4>
        <p className="lead text-muted">{info?.description}</p>
      </div>
    </div>
      }
  </section>
  );
};

export default AdminFrontPage;