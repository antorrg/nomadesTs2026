import { useState } from "react"
import { type IAbout } from "../../../types/about"
import LoadingImage from "../../../components/LoadingImages/LoadingImage"
import DOMPurify from "dompurify"

type AboutPicturedProps = {
  feature: IAbout
  isLoading: boolean
}

const AboutPictured = ({ feature, isLoading }: AboutPicturedProps) => {
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);

  return (
    <div className="container coverAbout">
      <div className="caption-nav">
        <h2 className="about-h2">Quienes somos:</h2>
      </div>
      <div className="aboutContainer colorBack rounded-4 shadow">
        <div className="p-4">
          <div className="clearfix">
            <h3 className="display-6 fw-normal mt-0 mb-3">{feature?.title || 'Quienes somos'}</h3>
            <hr className="feature-divider"></hr>
            <div className="float-md-start me-md-4 mb-3 col-md-5 text-center px-0">
              <div className="">
                {isLoading ? (
                  <LoadingImage
                    className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                  />
                ) : (
                  <img
                    className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                    src={feature?.picture}
                    alt={feature?.title || "Imagen sobre nosotros"}
                    width={600}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    onClick={() => feature?.picture && setZoomedImg(feature.picture)}
                  />
                )}
              </div>
            </div>

            <div
              className="lead rich-text-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feature?.text || '', { FORBID_ATTR: ['style'] }) }}
            />
          </div>
        </div>
      </div>

      {/* Lightbox / Overlay para las imágenes */}
      {zoomedImg && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out'
          }}
          onClick={() => setZoomedImg(null)}
        >
          <img 
            src={zoomedImg} 
            alt="Imagen Ampliada" 
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              borderRadius: '8px'
            }} 
          />
        </div>
      )}
    </div>
  )
}

export default AboutPictured