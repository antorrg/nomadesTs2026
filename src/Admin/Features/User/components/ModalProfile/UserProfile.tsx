import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import { booleanState } from '../../../Media/helperVideo'
import type { IUser } from '../../../../../types/user'
import EditPassword from '../EditPasswordForm'

type UserProfileParams = {
    goToBack: ()=>void
    user: IUser
}

const UserProfile = ({goToBack, user}: UserProfileParams) => {
const navigate = useNavigate()
const [showPasswordModal, setShowPasswordModal] = useState(false)

  const goToEdition = (id: string)=>{
    navigate(`usuarios/edicion/${id}`)
    goToBack()
  }

  return (
    <Modal show={true} onHide={goToBack} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Perfil de Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
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
            <dd className="col-sm-9">{user?.role}</dd>
            
            <dt className="col-sm-3">Nombre:</dt>
            <dd className="col-sm-9">{user?.name}</dd>
            
            <dt className="col-sm-3">Estado:</dt>
            <dd className="col-sm-9">{user && booleanState(user.enabled!)}</dd>
          </dl>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div>
        <Button variant="outline-success" onClick={goToBack}>
          Volver
        </Button>
        <Button variant="outline-primary" className="ms-3" onClick={() => user?.id && goToEdition(user.id)}>
          Editar
        </Button>
        </div>
        <Button variant="outline-danger" onClick={() => setShowPasswordModal(true)}>
          Cambiar Contraseña
        </Button>
      </Modal.Footer>
      
      {showPasswordModal && user && (
        <EditPassword 
          show={showPasswordModal}
          handleClose={() => setShowPasswordModal(false)}
          user={user}
          onSuccess={() => {
            setShowPasswordModal(false);
          }}
        />
      )}
    </Modal>
  )
}

export default UserProfile
