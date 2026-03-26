import { Link } from "react-router-dom";
import { useReduxFetch } from "../../../hooks/useReduxFetch";
import { getAllUsers } from "./userAdminSlice";
import { booleanState } from "../../AdminUtils/helpers";
import { userApi } from "../../AdminApi/userApi";
import { useAuth } from "../../../context/AuthContext";
//imports experimentales



const UserView = () => {
  const { user: authUser } = useAuth()
const { users } = useReduxFetch({
  action: getAllUsers,
  selector: (state) => state.user
})

  const deleteUser = async (id:string) => {
    const confirmed = await userApi.confirmAction({
      title: "¿Está seguro de eliminar el usuario?"
  });
    if (confirmed) {
      await userApi.delete(id);
    }
  };
  
  return (
    <section className="container album py-1 mb-3 ">
      <div className=" row py-lg-5">
        <div className="col-lg-6 col-md-8 col-sm-12 mx-auto text-center">
          <h2 className="fw-light">Usuarios:</h2>
         {(authUser?.role === 'ADMIN')?
          <Link
            className="btn btn-sm btn-outline-success me-3 mb-3"
            to="/admin/usuarios/creacion"
          >
            Crear Usuario
          </Link>
          : null
          }
        </div>
        <div className="">
          {users?.map((info) => (
            <div
              className="d-flex flex-column flex-md-row justify-content-between align-items-start w-100 mb-3 shadow-sm card"
              key={info?.id}
              style={{ borderRadius: "0.5rem" }}
            >
              <img
                className={`bd-placeholder-img-fluid ms-2 ${
                  info && !info.enabled ? "deactivate" : ""
                }`}
                src={info?.picture!}
                alt="Imagen"
                style={{ maxWidth: "10rem", borderRadius: "0.5rem 0 0 0.5rem" }}
              />
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100">
                <div className="col-lg-5 ms-2">
                  <h2 className="fw-normal">
                    {info.name ? info.name : info.nickname}
                  </h2>
                  <p>
                    {" "}
                    <strong>Email: </strong>
                    {info?.email}
                  </p>
                  <p>
                    {" "}
                    <strong>Rol: </strong>
                    {info?.role}
                  </p>
                  <p>
                    <strong>Estado: </strong>
                    {booleanState(info.enabled)}
                  </p>
                </div>
                <div className="mt-3 mt-lg-0">
                  {(authUser?.role=== 'ADMIN')?
                  <button
                    className="btn btn-sm btn-outline-danger me-3"
                    onClick={() => deleteUser(info.id)}
                  >
                    Eliminar
                  </button>
                  : <></>
                  }
                </div>
                <p className="mt-3 mt-lg-0">
                  <Link
                    className="btn btn-sm btn-outline-secondary me-3"
                    to={`/admin/usuarios/detalles/${info?.id}`}
                  >
                    Ver detalles
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserView;
