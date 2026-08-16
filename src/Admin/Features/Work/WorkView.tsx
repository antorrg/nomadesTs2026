import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useReduxFetch } from "../../../hooks/useReduxFetch";
import { useAppDispatch } from "../../../store/hooks";
import { getAllWorks, deleteWork } from "./workAdminSlice";
import { workApi } from "../../AdminApi/workApi";
import { mockWork } from "./components/mockWork";
import Loader2 from "../../../components/Loader2";

const WorkView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const { works} = useReduxFetch({
    action: getAllWorks,
    selector: (state) => state.adminWork
  });

  const deleteWorkItem = async (id: number) => {
    const confirmed = await workApi.confirmAction({
      title: "¿Está seguro de eliminar este item?"
    });
    if (confirmed) {
      try {
        setDeletingId(id);
        await dispatch(deleteWork(Number(id))).unwrap();
      } finally {
        setDeletingId(null);
      }
    }
  };


  const info = Array.isArray(works)? works : mockWork

  const goToCreate = ()=> navigate("/admin/trabajo/creacion")

  // if (adminLoading && (!works || works.length === 0)) {
  //   return <Loader2 fullScreen={true} text="Cargando trabajos..." />;
  // }

  return (
    <>
      <section className="container album py-5 mb-3">
        <div className="">
          <div className="col-lg-6 col-md-8 mx-auto text-center">
            <h2 className="fw-light">Nuestro trabajo</h2>
            <button
              className="btn btn-sm btn-outline-success mb-2"
              onClick={goToCreate}
            >
              Crear Item
            </button>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {info?.map((work) => {
              const isLoading = deletingId === work.id;

              return (
                <div className="col" key={work.id}>
                  <div className="card shadow-sm position-relative overflow-hidden">
                    {/* Overlay atenuado + Loader encima de la imagen */}
                    {isLoading && (
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
                        style={{ zIndex: 10 }}
                      >
                        <Loader2
                          fullScreen={false}
                          scale={0.4}
                          text=""
                          className="loader2Working"
                        />
                      </div>
                    )}

                    <img
                      className={`card-img-top ${!work.enabled ? 'deactivate' : ''}`}
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
                          disabled={work.id===0}
                          onClick={() => deleteWorkItem(work.id)}
                        >
                          Eliminar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-3"
                          disabled={work.id===0}
                          onClick={() => navigate(`/admin/trabajo/${work.id}/edicion`)}
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default WorkView