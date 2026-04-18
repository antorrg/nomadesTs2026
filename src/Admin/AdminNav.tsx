import React,  {useState} from 'react'
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useReduxFetch } from '../hooks/useReduxFetch';
import { getUserById, clearError } from './Features/User/userAdminSlice'
import { useAuth } from '../context/AuthContext'
import { type IUser } from '../types/user'
import UserProfile from './Features/User/components/ModalProfile/UserProfile';


const AdminNav: React.FC = () => {
  const { user: userAuth } = useAuth()
  const id = String(userAuth?.id)
  const [profile, setProfile] = useState<boolean>(false)

  const { selectedUser } = useReduxFetch({
    action: getUserById,
    arg: id,
    selector: (state) => state.user,
    deps: [id],
    condition: !!id,
    cleanupAction: clearError
  })
  
  const userMock = {
    id: 'no-id',
    email: 'no-email@example.com',
    picture: 'picture-not-found',
    nickname: 'usuario no hallado',
    name: 'usuario no hallado',
    role: 'USER' as const,
    enabled: true
  }

  const userProfile: IUser = selectedUser ? selectedUser : userMock

  const goToBack= ()=> setProfile(false)

  return (
    <nav
      className="navbar navbar-color"
      aria-label="Dark offcanvas navbar"
    >
      <div className="container-fluid">
        <p className="navbar-brand navbar-color text-start ms-1">Panel Administrador</p>
        
        <div className="d-flex justify-content-start">
          <Dropdown align="end" className="">
            <Dropdown.Toggle
              as="a"
              className="d-flex align-items-center text-white text-decoration-none nav-link"
            >
              <img
                src={userProfile.picture!}
                alt="Not found"
                width="32"
                height="32"
                className={`rounded-circle me-2 ${userProfile && !userProfile.enabled ? "deactivate" : ""
                  }`}
              />
              <strong>
                {userProfile.name ? userProfile.name : userProfile.nickname}
              </strong>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu text-small shadow">
              <Dropdown.Item>
                <p>Email: {userProfile?.email}</p>
                <p>Rol: {userProfile.role}</p>
                <p>Nombre:  {userProfile.name ? userProfile.name : userProfile.nickname}</p>
              </Dropdown.Item>
              <Dropdown.Item onClick={()=> setProfile(true)}>Perfil</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {profile && <UserProfile goToBack={goToBack} user={userProfile} />}

        <Link className="navbar-brand text-start ms-5" style={{textDecoration:'none', color:'whitesmoke'}} to="/">
          Ir a página principal
        </Link>
      </div>
    </nav>
  )
}

export default AdminNav