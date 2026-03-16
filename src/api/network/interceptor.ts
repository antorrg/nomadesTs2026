import axios from 'axios'
import { toast } from 'react-toastify';
import { type LogoutFunction, type RedirectToError } from '../../types/auth';



const interceptor = (logout:LogoutFunction, redirectToError: RedirectToError) => {

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401 || error.response && error.response.status === 403) {
        const { status, data } = error.response;
        const message = data.message || 'Acceso no autorizado'; // Puedes personalizar el mensaje

        // Llamamos a la función de redirección con el status y message
        redirectToError(status, message);
        // Acceso no autorizado, redirigir al inicio de sesión
        redirectToLogin(logout)
      }
      toast.error(error);
      return Promise.reject(error);
    }
  );
};

const redirectToLogin =(logout:LogoutFunction)=>{
  setTimeout(()=>{
    logout();
  },4000)
}
export default interceptor