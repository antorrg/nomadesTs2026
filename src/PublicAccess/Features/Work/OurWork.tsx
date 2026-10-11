import { useState } from "react"
import { type IWork } from "../../../types/work"
import LoadingImage from "../../../components/LoadingImages/LoadingImage"
import DOMPurify from "dompurify"

type WorkProps = {
  featurettes: IWork[]
  isLoading:boolean
}
const OurWork = ({featurettes, isLoading}:WorkProps) => {
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);

  return (
    <div className="container coverAbout">
      <div className="caption-nav">
        <h2 className="about-h2">Nuestro trabajo:</h2>
      </div>
     <div className="aboutContainer colorBack rounded-4 shadow">
      <div className="p-3">
        {featurettes?.map((item, index) => (
          <div key={item.id ?? index}>
            <div className="clearfix p-3">
              <h2 className="featurette-heading fw-normal lh-1 mt-0 mb-3">{item.title}</h2>
              <div className={`${index % 2 !== 0 ? 'float-md-end ms-md-4' : 'float-md-start me-md-4'} mb-3 col-md-5 text-center px-0`}>
                <div className={`organic-img-wrapper ${index % 2 !== 0 ? 'organic-wave-left' : 'organic-wave-right'}`}>
                  {isLoading ? (
                    <LoadingImage
                      className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                    />
                  ) : (
                    <img
                      className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                      src={item.picture}
                      alt={item.title || "Not found"}
                      width={600}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      onClick={() => item?.picture && setZoomedImg(item.picture)}
                    />
                  )}
                </div>
              </div>
              <div
                className="lead rich-text-content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.text || '', { FORBID_ATTR: ['style'] }) }}
              />
            </div>
            {index < featurettes.length - 1 && <hr className="featurette-divider" />}
          </div>
        ))}
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

export default OurWork