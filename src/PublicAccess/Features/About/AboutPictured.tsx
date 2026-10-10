import { type IAbout } from "../../../types/about"
import LoadingImage from "../../../components/LoadingImages/LoadingImage"
import DOMPurify from "dompurify"

type AboutPicturedProps = {
  feature: IAbout
  isLoading: boolean
}

const AboutPictured = ({ feature, isLoading }: AboutPicturedProps) => {
  return (
    <div className="container coverAbout">
      <div className="caption-nav">
        <h2 className="about-h2">Quienes somos:</h2>
      </div>
      <div className="aboutContainer colorBack rounded-4 shadow">
        <div className="modal-content p-4">
          <div className="clearfix">
            <h3 className="display-6 fw-normal mt-0 mb-3">{feature?.title || 'Quienes somos'}</h3>
            <hr className="feature-divider"></hr>
            <div className="float-md-start me-md-4 mb-3 col-md-5 text-center px-0">
              {isLoading ? (
                <LoadingImage
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto rounded"
                />
              ) : (
                <img
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto rounded"
                  src={feature?.picture}
                  alt={feature?.title || "Imagen sobre nosotros"}
                  width={600}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>

            <div
              className="lead rich-text-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feature?.text || '', { FORBID_ATTR: ['style'] }) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPictured