import {useEffect} from 'react'
import {useLocation, Link, useNavigate} from 'react-router-dom'
//import './styles/error.css'


const Error = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(()=>{
        const timer = setTimeout(() => navigate('/'), 5000)
        return () => clearTimeout(timer)
    },[])
  
    const error = location.state ||{ status: '404', message: 'Pagina no encontrada' };
  return (
    <div className='error-page'>
    <h1>Error {error.status}</h1>
    <p>{error.message}</p>
    <Link to={'/'}>Volver a inicio...</Link>
    </div>
  )
}

export default Error
