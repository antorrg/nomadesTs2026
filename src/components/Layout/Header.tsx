import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeSwitcher from '../ThemeSwitcher'




const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  const navigate = useNavigate();
  return (
    <header className="mb-auto">
      <div>
        <h1 className="h3 float-md-start mb-0 caption-nav colon-link">
          Nomades
            <Link className="nav-link d-inline" to="/ingresar">
              :
            </Link>
         
          {" "}Cabañas de pastores
        </h1>
        <nav className="nav nav-masthead justify-content-center float-md-end caption-nav">
          <Link className="nav-link fw-bold py-1 px-0 active me-2" to="/">
            Inicio
          </Link>
          {isAuthenticated ? (
            <>
                <button
                  className="nav-link fw-bold py-1 px-0 active border-0 bg-transparent me-2"
                  onClick={() => navigate("/admin")}
                >
                  Admin
                </button>
              {/* <button
                className="nav-link fw-bold py-1 px-0 active border-0 bg-transparent me-2"
                onClick={logout}
              >
                Cerrar Sesión
              </button> */}
            </>
          ) : null}
          <Link className="nav-link fw-bold py-1 px-0 me-2" to="/videos">
            Videos
          </Link>

          <Link className="nav-link fw-bold py-1 px-0 active me-2" to="/contacto">
            Contacto
          </Link>
          <Link className="nav-link fw-bold py-1 px-0 active me-2" to="/acerca">
            Acerca de{" "}
          </Link>
          <ThemeSwitcher/>
        </nav>
      </div>
    </header>
  );
}

export default Header