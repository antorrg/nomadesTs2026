
type ConfigProps = {
  user: {
    id?: string | null | undefined,
    email?:string | null | undefined,
    role?: string | null | undefined
  }
}

const Config = ({user}: ConfigProps) => {

  return (
    <div>
      <h2>Configuración</h2>
    <p>Contenido específico para configuraciones en caso de futura ampliacion.</p>
      {(user && user.role === 'ADMIN')?
      <div style={{border:'solid', color:'GrayText',borderRadius:'2px'}}>
        <ul>
          <li><strong>Usuario activo:</strong></li>
          <li>(Esta ventana solo aparece si el usuario tiene rol de administrador)</li>
          <li>Id: {user.id}</li>
          <li>Email: {user.email}</li>
          <li>Rol: {user.role}</li>
        </ul>
      </div>
      : 
      null
      }

  </div>
  )
}

export default Config