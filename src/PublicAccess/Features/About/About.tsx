import { Link } from "react-router-dom";
import { aboutInfo } from "./constants";


const About = () => {
 

  return (
    <div className="imageBack">
      <div className="container coverAbout">
        <div className="caption-nav">
          <h1 className="about-h1">Quienes somos:</h1>
        </div>
          <div className="modal-content p-2">
          <div className="container-lg modal-content colorBack contactContainer rounded-4 shadow" style={{maxWidth:'30vw'}}>
            <div className="mt-5" >
               <p className='cover-p'>
              {aboutInfo.description}
             </p>
              <Link className="btn btn-sm btn-outline-secondary mb-3" to={'/'}>Volver</Link>
            </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default About;

