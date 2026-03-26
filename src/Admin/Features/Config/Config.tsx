import SystemLogsViewer from './SystemLogsViewer';

export type ConfigProps = {
  user: {
    id?: string | null | undefined,
    email?:string | null | undefined,
    role?: string | null | undefined
  }
}

const Config = ({user}: ConfigProps) => {

  return (
    <div className="container pb-5">
      <h2>Configuración</h2>
    <p>Contenido específico para configuraciones necesita permiso de administrador para entrar aqui.</p>
      {(user && user.role === 'ADMIN')?
      <>
        <div className='card mb-4' style={{border:'solid', color:'GrayText',borderRadius:'2px'}}>
          <div className="card-body">
            <ul>
              <li><strong>Usuario activo:</strong></li>
              <li>(Esta ventana solo aparece si el usuario tiene rol de administrador)</li>
              <li>Id: {user.id}</li>
              <li>Email: {user.email}</li>
              <li>Rol: {user.role}</li>
            </ul>
          </div>
        </div>
        <hr />
        <SystemLogsViewer />
      </>
      : 
      null
      }

  </div>
  )
}

export default Config