import { type IAbout } from "../../../types/about"

type AboutOnlyTextProps = {
    feature: IAbout
}

const AboutOnlyText = ({ feature }: AboutOnlyTextProps) => {
  return (
    <div className="container coverAbout">
      <div className="caption-nav">
        <h2 className="about-h2">Quienes somos:</h2>
      </div>
      <div className="aboutContainer colorBack rounded-4 shadow">
        <div className="modal-content p-3">
          <div>
            <div className="row featurette">
              <div className="col-12">
                <h3 className="display-6 fw-normal mt-0 mb-3">{feature?.title || 'Quienes somos'}</h3>
                <hr className="feature-divider"></hr>
                <p className="lead">{feature?.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutOnlyText
