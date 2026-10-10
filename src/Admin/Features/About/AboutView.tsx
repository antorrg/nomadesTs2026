import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { useReduxFetch } from '../../../hooks/useReduxFetch';
import { getAllAbout } from './aboutAdminSlice';
import Loader2 from '../../../components/Loader2';

const mockAbout = {
  id: 0,
  title: 'Aguarde un momento...',
  picture: '',
  text: 'Sin contenido aún',
  imgShow: true,
  enabled: true
};

const AboutView = () => {
  const { about, adminLoading } = useReduxFetch({
    action: getAllAbout,
    selector: (state) => state.adminAbout,
  });

  const loaderSelect = adminLoading ?? false;
  const info = Array.isArray(about) && about.length > 0 ? about[0] : mockAbout;

  return (
    <section className="container">
      <div className="py-5 row py-lg-5">
        {!loaderSelect ? (
          <div className="col-lg-8 col-md-10 col-sm-12 mx-auto text-center">
            <h2 className="fw-light mb-3">Acerca de:</h2>
            <div>
              {info?.id !== 0 ? (
                <Link className="btn btn-sm btn-outline-success mb-3" to={`/admin/about/${info?.id}/edicion`}>
                  Editar
                </Link>
              ) : (
                <Link className="btn btn-sm btn-outline-danger me-3 mb-3" to="/admin/about/creacion">
                  Crear
                </Link>
              )}
            </div>

            <h4 className="mt-3">Título:</h4>
            <p className="lead text-muted">{info?.title}</p>

            <div className="my-3">
              <span className={`badge ${info?.imgShow ? 'bg-primary' : 'bg-secondary'} me-2`}>
                {info?.imgShow ? 'Modo: Con Imagen' : 'Modo: Sólo Texto'}
              </span>
              <span className={`badge ${info?.enabled ? 'bg-success' : 'bg-warning'}`}>
                {info?.enabled ? 'Visible' : 'Oculto'}
              </span>
            </div>

            {info?.imgShow && info?.picture && (
              <div className="my-3">
                <h4>Imagen configurada:</h4>
                <img
                  className="bd-placeholder-img-fluid mb-3 rounded shadow-sm"
                  src={info?.picture}
                  alt="Imagen Acerca de"
                  style={{ maxWidth: "100%", maxHeight: "350px", height: "auto" }}
                />
              </div>
            )}

            <hr />
            <h4>Texto principal:</h4>
            <div
              className="lead text-muted rich-text-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(info?.text || '') }}
            />
          </div>
        ) : (
          <Loader2 />
        )}
      </div>
    </section>
  );
};

export default AboutView;