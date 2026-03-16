import { Link, useParams } from 'react-router-dom'
import { useReduxFetch } from '../../../hooks/useReduxFetch'
import { getPublicItem, clearSelectedItem } from './productSlice'
import Loader2 from '../../../components/Loader2'

const Item = () => {
  const { id } = useParams()

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
                
              />
              <p className="text-muted">{item?.text}</p>
              <Link
                className="btn btn-sm btn-outline-secondary mt-3 mx-auto w-20"
                to={`/detalle/${item?.ProductId}`}
              >
                Cerrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item