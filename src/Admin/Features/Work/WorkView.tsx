import { Link } from "react-router-dom";
import { useReduxFetch } from "../../../hooks/useReduxFetch";
import { getAllWorks } from "./workAdminSlice";
import { workApi } from "../../AdminApi/workApi";

const WorkView = () => {
 
  
  const { works } = useReduxFetch({
    action: getAllWorks,
    selector: (state) => state.adminWork
  })
  

  const deleteWorkItem = async (id: number) => {
    const confirmed = await workApi.confirmAction({
      title:   "¿Está seguro de eliminar este item?"
    })
    if (confirmed) {
      await workApi.delete(Number(id))
    }
  };

  return (
    <>
      <section className="container album py-5 mb-3">
        <div className="">
          <div className="col-lg-6 col-md-8 mx-auto text-center">
            <h2 className="fw-light">Nuestro trabajo</h2>
            <Link
              to="/admin/trabajo/creacion"
              className="btn btn-sm btn-outline-success mb-2"
            >
              Crear Item
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {works?.map((work) => (
              <div className="col" key={work.id}>
                <div className="card shadow-sm">
                  <img
                    className={`card-img-top ${!work.enabled? 'deactivate' : ''}`}
                    src={work.picture}
                    alt="Card image"
                    style={{ maxWidth: "fit-content", height: "auto" }}
                  />
                  <div className="card-body">
                    <p className="card-text">{work.title}</p>
                    <hr></hr>
                    <p className="card-text text-truncate">{work.text}</p>
                  
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-danger me-3"
                          onClick={() => deleteWorkItem(work.id)}
                        >
                          Eliminar
                        </button>
                        <Link
                          className="btn btn-sm btn-outline-primary me-3"
                          to={`/admin/trabajo/${work.id}/edicion`}
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WorkView