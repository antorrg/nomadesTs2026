import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

type InputProps = {
  logoutFn: ()=> void
}

const AlertLogin:React.FC<InputProps> = ({logoutFn})=> {
    const navigate = useNavigate()
    
  const sessionCleaner = () => {
    //showSuccess("Sesión cerrada");
    navigate("/");
    setTimeout(() => {
      logoutFn();
    }, 1000);
  };

  return (
    <>
      <Alert variant="warning">
        <Alert.Heading>¡¡Advertencia!! </Alert.Heading>
        <p>
          Su sesion ya está iniciada ¿desea cerrar sesión?
        </p>
        <p>
        Si es asi pulse <strong>"Cerrar sesion"</strong>, parar cerrar esta ventana pulse <strong>"Salir"</strong>.
        </p>
        <hr />
        <div className="d-flex flex-row justify-content-between items-center">
          <Button onClick={() => navigate('/')} variant="outline-secondary" size="sm">
            Salir
          </Button>
          <Button onClick={() => sessionCleaner()} variant="outline-primary" size="sm">
            Cerrar sesion
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default AlertLogin;