import {useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import { useReduxFetch } from '../../../hooks/useReduxFetch'
import { getPublicItem, clearSelectedItem } from './productSlice'
import Loader2 from '../../../components/Loader2'

const ItemView = () => {
  const { id } = useParams()
   const [zoomedImg, setZoomedImg] = useState<string | null>(null);

  // Using selectedPublicItem aliased as item for compatibility with existing code
  const { selectedPublicItem: item, publicLoading } = useReduxFetch({
    action: getPublicItem,
    arg: Number(id),
    selector: (state) => state.product,
    deps: [id],
    cleanupAction: clearSelectedItem
  });

  if (publicLoading) return <Loader2 />

  if (!item) return null // Or return standard 404/Empty component

  return (
    <>
    <div>
      <div
        className="modal modal-tour position-static d-block modal-custom py-5 "
        role="dialog"
        id="modalTour"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl ">
          <div className="modal-content">
            <div className="modal-body p-5 text-center list-group-item">
              <img
                className="d-block mx-auto mb-4 img-fluid"
                src={item?.picture || ''}
                alt="image not found"
                  style={{ width: "100%", objectFit: 'cover', objectPosition: 'center', cursor: 'zoom-in', transition: 'transform 0.2s ease-in-out' }}
                  onClick={() => item?.picture && setZoomedImg(item?.picture)}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <p className="text-muted">{item?.text}</p>
              <Link
                className="btn btn-sm btn-outline-secondary mt-3 mx-auto w-20"
                to={`/detalle/${item?.ProductId}`}
              >
                Volver
              </Link>
            </div>
          </div>
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
    </>

  )
}

export default ItemView