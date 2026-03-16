import {Link} from 'react-router-dom'
import { useReduxFetch } from '../../../hooks/useReduxFetch'
import { getPublicLanding } from './homeSlice'

interface FrontData {
  id: number
  title: string
  info_header: string
  description: string
  enabled: boolean
}
type Info = Omit<FrontData, 'id'| 'enabled'>

const FrontPage:React.FC = () => {
  
  const { publicLanding } = useReduxFetch({
    action: getPublicLanding, 
    selector: (state) => state.home,
    deps:[]
  })



  const info: Info = publicLanding[0]
  return (
        <section className='px-3'>
      <div className='caption-title'>
        <h1>{info?.title}</h1>
        <p className='cover-p'>{info?.description}</p>
        <p className='lead'>
          <Link className='btn btn-lg fw-bold ourWorkBtn' style={{}}to='/nuestro-trabajo'>
            Nuestro trabajo...
        </Link>
        </p>
      </div>
    </section>
  )
}

export default FrontPage