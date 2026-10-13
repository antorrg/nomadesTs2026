import { useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useReduxFetch } from "../../../hooks/useReduxFetch";
import { useAppDispatch } from "../../../store/hooks";
import { getAllHighLights, deleteHighLight } from "./highLightAdminSlice";
import { highLightApi } from "../../AdminApi/highLightApi";
import { mockHighLight } from "./components/mockHighLight";
import type { IHightLight } from '../../../types/hightLight';
import Loader2 from "../../../components/Loader2";

/** Ordena por `order` ascendente; los que no tienen orden van al final, ordenados por `id`. */
const sortHighLights = (items: IHightLight[]): IHightLight[] =>
  [...items].sort((a, b) => {
    const aHas = typeof a.order === 'number';
    const bHas = typeof b.order === 'number';
    if (aHas && bHas && a.order !== b.order) return (a.order as number) - (b.order as number);
    if (aHas !== bHas) return aHas ? -1 : 1;
    return a.id - b.id;
  });

const HighLightView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { highLights } = useReduxFetch({
    action: getAllHighLights,
    selector: (state) => state.adminHigh
  });

  const deleteHighLightItem = async (id: number) => {
    const confirmed = await highLightApi.confirmAction({
      title: "¿Está seguro de eliminar este destacado?"
    });
    if (confirmed) {
      try {
        setDeletingId(id);
        await dispatch(deleteHighLight(Number(id))).unwrap();
      } finally {
        setDeletingId(null);
      }
    }
  };

  const info = useMemo(
    () => (Array.isArray(highLights) && highLights.length > 0 ? sortHighLights(highLights) : mockHighLight),
    [highLights]
  );

  const goToCreate = () => navigate("/admin/destacado/creacion")

  return (
    <>
      <section className="container album py-5 mb-3">
        <div className="">
          <div className="col-lg-6 col-md-8 mx-auto text-center">
            <h2 className="fw-light">Destacados</h2>
            <button
              className="btn btn-sm btn-outline-success mb-2"
              onClick={goToCreate}
            >
              Crear Destacado
            </button>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {info?.map((item) => {
              const isLoading = deletingId === item.id;
              const isMock = item.id === 0;

              return (
                <div className="col" key={item.id}>
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
                      className={`card-img-top ${!item.enabled ? 'deactivate' : ''}`}
                      src={item.picture}
                      alt={item.title}
                      style={{ maxWidth: "fit-content", height: "auto" }}
                    />
                    <div className="card-body">
                      {!isMock && (
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          <span className="badge text-bg-secondary">
                            {typeof item.order === 'number' ? `Orden: ${item.order}` : 'Sin orden'}
                          </span>
                          {!item.showTitle && <span className="badge text-bg-warning">Título oculto</span>}
                          {!item.enabled && <span className="badge text-bg-danger">Oculto</span>}
                        </div>
                      )}
                      <p className="card-text">{item.title}</p>
                      <hr></hr>
                      <p className="card-text text-truncate">{item.text ? item.text.replace(/<[^>]*>/g, '') : ''}</p>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-danger me-3"
                            disabled={isMock}
                            onClick={() => deleteHighLightItem(item.id)}
                          >
                            Eliminar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-3"
                            disabled={isMock}
                            onClick={() => navigate(`/admin/destacado/${item.id}/edicion`)}
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

export default HighLightView
