import {landingPublicApi} from '../../PublicAccess/publicApi/landingApi';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const urlFace = import.meta.env.VITE_URL_FACEBOOK;
  const urlInstagram = import.meta.env.VITE_URL_INSTAGRAM;
  const handleWhatsApp = landingPublicApi.handleWhatsApp

  return (
    <div className='text-muted py-5'>
      <div className='container'>
        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="d-flex flex-column flex-md-row gap-3 mb-3 mb-md-0">
                <a href={urlFace} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-decoration-none">
                  <i className="bi bi-facebook text-facebook me-2" style={{ fontSize: "1.5rem" }}></i>
                  Facebook
                </a>
                <a href={urlInstagram} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-decoration-none">
                  <i className="bi bi-instagram text-danger me-2" style={{ fontSize: "1.5rem" }}></i>
                  Instagram
                </a>
                <a href='#' onClick={() => handleWhatsApp()} className="d-flex align-items-center text-decoration-none">
                  <i className="bi bi-whatsapp text-primary me-2" style={{ fontSize: "1.5rem" }}></i>
                  WhatsApp
                </a>
              </div>

              <button
                className="btn btn-lg btn-secondary rounded-circle"
                aria-label="Volver a inicio de pagina"
                onClick={scrollToTop}
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="bi bi-chevron-up chevron-icon fw-bolder lh-lg" ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer