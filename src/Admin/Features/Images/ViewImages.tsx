import { useState } from 'react'
import Loader2 from "../../../components/Loader2"
import { useReduxFetch } from "../../../hooks/useReduxFetch"
import { getAllImages } from "./imagesAdminSlice"
import { imagesApi } from '../../AdminApi/imagesApi'

const ViewImages = () => {
    const [load, setLoad] = useState<boolean>(false)
    const { images } = useReduxFetch({
        action : getAllImages,
        selector: (state) => state.adminImages
    })

  const onClose = () => {
    setLoad(false);
  };
  const onRetry = () => {
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const delImage = async (id:string) => {
    const imageId = Number(id)
    const confirmed = await imagesApi.confirmAction({
    title: "¿Quiere eliminar esta imagen?"
    });
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      setLoad(true);
      await imagesApi.delete(
        imageId,
        {
        success: () => onClose(),
        reject: () => onRetry()
      } 
      )
      //console.log('soy la imagen a borrar: ',id)
    }
  };


  return (
    <>
      <section className="container album py-5 mb-3">
          {load ? (
            <Loader2 />
          ) : (
            <>
              <div className="col-lg-6 col-md-8 ">
                <h2 className="fw-light">Imagenes guardadas</h2>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {images?.map((img, index) => (
                  <div className="col" key={img.id}>
                    <div className="card shadow-sm">
                        <img
                        className="card-img-top"
                        style={{ aspectRatio: '7 / 5', objectFit:'cover', objectPosition:'center'}}
                        src={img.imageUrl}
                        alt="Card image"
                      />
                      <div className="card-body">
                        <p className="card-text">
                          Imagen guardada Nª: {index + 1}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-danger me-3"
                              onClick={() => delImage(`${img.id}`)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </>
          )}
      </section>
    </>
  )
}

export default ViewImages