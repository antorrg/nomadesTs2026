import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 

const showSuccess = (mensaje:string) => {
  toast.success(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};

const showError = (mensaje:string) => {
  toast.error(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
const showInfo = (mensaje:string) => {
  toast.info(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
const showWarn = (mensaje:string) => {
  toast.warn(mensaje, {
    //position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3000,
  });
};
export {
    showError,
    showInfo,
    showSuccess,
    showWarn
};