import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Login from '../Features/Auth/Login/Login'
import AlertLogin from '../Features/Auth/Login/AlertLogin'
import Loader2 from '../../components/Loader2'

const Access: React.FC = () => {
  const { login, logout, isAuthenticated } = useAuth()
  const [load, setLoad] = useState<boolean>(false);


  return (
    <div className="imageBack">
      <div className="coverBack">
        <div className="container-md modal-content backgroundFormColor loginContainer rounded-4 shadow">
          <div className="form-signin m-auto p-3">
            {isAuthenticated ?
              <AlertLogin logoutFn={logout} />
              :
              <>
                {load ?
                  <Loader2 scale={0.5} fullScreen={false} text="Aguarde..." />
                  :
                  <Login loginFn={login} setLoad={setLoad} />
                }
              </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Access