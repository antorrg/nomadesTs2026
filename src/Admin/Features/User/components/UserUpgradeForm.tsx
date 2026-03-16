import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import showConfirmationDialog from "../../../Endpoints/sweetAlert";
import Loading from "../../Loading";
import {userUpgrade} from "../../../Endpoints/endpoints";
import {useReduxFetch} from '../../../hooks/useReduxFetch'
import { getUserById, cleanState} from "../../../redux/actions";

const UserUpgrade = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user1 = useReduxFetch({actionFn: getUserById, param:id, deps: [id], sliceName: 'UserById', cleanActionFn: cleanState})


  const [load, setLoad] = useState(false)


  const onClose = () => {
    navigate(-1);
    setLoad(false)
  };
  const onRetry = ()=>{
    setTimeout(()=>{
      onClose()
    },3000)
  }
  const [user, setUser] = useState({
    role: "",
    enable: "",
  });

  useEffect(() => {
    if (user1) {
      setUser({
        role: user1.role || "",
        enable: typeof user1.enable === "boolean"? user1.enable : false,
      });
    }
  }, [user1]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de actualizar este usuario?"
    );
    if (confirmed) {
      await userUpgrade(id, user, onClose, onRetry);
      setLoad(true)
    }
  };

  return (
    <div className="imageBack">
      {load?
      <Loading/>
      :
      <div className="coverBack">
        <div className="container-md modal-content colorBack formProductContainer rounded-4 shadow">
          <div className="container mt-5">
            <h1>Cambio de roles, bloqueo:</h1>
            <section
              className="needs-validation"
              id="updateItemForm"
              noValidate
            >
              <div className="row">
                <div className="col-md-6 mb-3"></div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Rol:
                  </label>
                  <select
                    name="role"
                    className="form-control"
                    value={user.role}
                    onChange={handleInputChange}
                  >
                    <option value={"Administrador"}>Administrador</option>
                    <option value={"Usuario"}>Usuario</option>
                    <option value={"Moderador"}>Moderador</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="enable" className="form-label">
                    Estado:
                  </label>
                  <select
                    name="enable"
                    className="form-control"
                    value={user.enable}
                    onChange={handleInputChange}
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Bloqueado</option>
                  </select>
                </div>

                <div className="d-flex flex-row me-3">
                  <button
                    className="btn btn-sm btn-primary mb-3 me-2"
                    type="button"
                    id="submitButton"
                    onClick={handleSubmit}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn btn-sm btn-secondary mb-3"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
        }
    </div>
  );
};

export default UserUpgrade;
