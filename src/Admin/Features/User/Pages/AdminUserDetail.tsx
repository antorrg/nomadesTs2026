import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { booleanState } from '../../../AdminUtils/helpers'
import { useReduxFetch } from '../../../../hooks/useReduxFetch'
import { useAppDispatch } from '../../../../store/hooks'
import { getUserById } from '../userAdminSlice'
import { banned, showButton } from '../../../AdminUtils/helpers'
import ChangeRole from '../components/ModalsEdition/ChangeRole'
import UserBlocker from '../components/ModalsEdition/UserBlocker'
import { useAuth } from '../../../../context/AuthContext'
import { userApi } from '../../../AdminApi/userApi'




const AdminUserDetail = () => {
const { user: userAuth} = useAuth()
const navigate = useNavigate()
const dispatch = useAppDispatch()
const [showChangeRole, setShowChangeRole] = useState(false)
const [showUserBlocker, setShowUserBlocker] = useState(false)
const {id} = useParams()
const { selectedUser } = useReduxFetch({
  action: getUserById,
  arg: id,
  selector: (state) => state.user,
  deps: [id],
  condition: !!id
})
const user = selectedUser

const goToBack= ()=>navigate(-1)

  const goToEdition = (id: string)=>{
    navigate(`/admin/usuarios/edicion/${id}`)
  }
const resetPassword = async(id:string):Promise<void>=>{
    const confirmed = await userApi.confirmAction({ title: 'Esta seguro de resetear la contraseña?' });
      if (!confirmed) return;
          try {
            await userApi.resetPassword(id);
          } catch (error) {
            console.error(error);
          } finally {
          }

}
const switched = banned(user?.enabled ?? false)
const showBtn = showButton(userAuth?.role)
  return (
    <div className='imageBack'>
     <div className='coverBack'>
      <div className="container-md modal-content colorBack formProductContainer rounded-3 shadow p-4 mb-3">

      <div className="d-flex flex-column align-items-center">
        <img
          className="img-fluid rounded mb-3"
          src={user?.picture!}
          alt={`${user?.nickname}'s profile`}
          style={{ maxWidth: '250px' }}
        />
        <div className="w-100">
          <dl className="row user-info-list text-start">
            <dt className="col-sm-3">Email:</dt>
            <dd className="col-sm-9">{user?.email}</dd>
            
            <dt className="col-sm-3">Apodo:</dt>
            <dd className="col-sm-9">{user?.nickname}</dd>
            
            <dt className="col-sm-3">Rol:</dt>
            <dd className="col-sm-9"><span>{user?.role}</span>
                {showBtn?
                  <button 
                    className="btn btn-sm btn-outline-primary ms-3"
                    onClick={() => setShowChangeRole(true)}
                  >
                    Cambiar rol
                  </button>
                  : null
                  }
            </dd>
            
            <dt className="col-sm-3">Nombre:</dt>
            <dd className="col-sm-9">{user?.name}
            </dd>
            
            <dt className="col-sm-3">Estado:</dt>
            <dd className="col-sm-9">
              <span>{user && booleanState(user.enabled)}</span>
              {showBtn?
                   <>
                  <button 
                    className={switched.styleButton}
                    onClick={() => setShowUserBlocker(true)}
                  >
                   {switched.title}
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={() => resetPassword(user!.id)}
                  >
                   Resetear contraseña
                  </button>
                  </>
                  :null
                  }
              </dd>
          </dl>
        </div>
        <div className="d-flex justify-content-between align-items-center">
        <div className="btn-group">
        <button className="btn btn-sm btn-outline-success me-3" onClick={goToBack}>
          Volver
        </button>
        <button className="btn btn-sm btn-outline-primary" onClick={() => user?.id && goToEdition(user.id)}>
          Editar
        </button>
        </div>
        </div>
      </div>

      {showChangeRole && user && (
        <ChangeRole 
          show={showChangeRole} 
          handleClose={() => setShowChangeRole(false)} 
          user={user} 
          onSuccess={() => {
            setShowChangeRole(false);
            if (id) dispatch(getUserById(id));
          }} 
        />
      )}

      {showUserBlocker && user && (
        <UserBlocker 
          show={showUserBlocker} 
          handleClose={() => setShowUserBlocker(false)} 
          user={user} 
          onSuccess={() => {
            setShowUserBlocker(false);
            if (id) dispatch(getUserById(id));
          }} 
        />
      )}
    </div>
    </div>
    </div>
  )
}

export default AdminUserDetail