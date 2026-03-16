
type MailRejectProps = {
  retry: ()=>void
}

const MailReject = ({retry}:MailRejectProps) => {
  return (
        <div className="container-md modal-content colorBack contactContainer rounded-4 shadow">
          <div className="container mt-5">
            <h1>Error en el envio:</h1>
            <section style={{ height: "60vh" }}>
              
                <strong className='mt-3 mb-3 d-block fs-4'>
                  No pudimos enviar su correo electrónico en este momento.
                </strong>
                <p className="fs-5">
                Es posible que el servidor esté experimentando un problema o que
                haya una alta demanda. Le pedimos disculpas por las molestias.
                Por favor, inténtelo nuevamente en unos minutos...
              </p>
              <button
                  className="btn btn-sm btn-danger mb-3 me-2"
                  type="button" 
                  onClick={retry}
                >
                  Salir
                </button>
            </section>
          </div>
        </div>
  );
};

export default MailReject;
