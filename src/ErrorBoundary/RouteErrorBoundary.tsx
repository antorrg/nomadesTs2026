import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom';

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('RouteErrorBoundary captured an error:', error);

  let title = 'Error';
  let message = 'Se ha producido un problema al cargar esta sección. La aplicación sigue activa.';
  let statusCode: number | string | null = null;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 404) {
      title = 'Página no encontrada (404)';
      message = 'La página o recurso que buscas no existe o ha sido movido.';
    } else if (error.status === 403) {
      title = 'Acceso Restringido (403)';
      message = 'No tienes permisos suficientes para acceder a esta sección.';
    } else {
      title = `Error del servidor (${error.status})`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  const handleRetry = () => {
    // Forzamos la recarga completa del navegador para actualizar assets o chunks JS si hubo cambios de despliegue
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center px-3 error-page">
      <div
        className="card border-0 shadow-sm p-4 p-md-5 text-center"
        style={{ maxWidth: '500px', width: '100%', borderRadius: '15px' }}
      >
        <div className="mb-3 text-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
        </div>
        {statusCode && (
          <div>
            <span className="badge bg-secondary mb-2 px-3 py-2 fs-6">Código: {statusCode}</span>
          </div>
        )}
        <h1 className="h3 fw-bold mb-2">{title}</h1>
        <p className="text-muted mb-4">{message}</p>

        {import.meta.env.DEV && error instanceof Error && (
          <details className="text-start mb-4 p-3 rounded small text-danger overflow-auto" style={{ maxHeight: '150px' }}>
            <summary className="cursor-pointer fw-semibold mb-1">Detalles del error (Modo desarrollo)</summary>
            <pre className="mb-0 text-wrap">{error.stack || error.message}</pre>
          </details>
        )}

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
            onClick={handleRetry}
          >
            Reintentar la página
          </button>
          <button
            type="button"
            className="btn btn-secondary px-4 py-2 rounded-pill fw-semibold"
            onClick={handleGoHome}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
