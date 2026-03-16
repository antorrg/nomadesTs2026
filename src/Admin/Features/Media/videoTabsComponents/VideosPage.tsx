import { useState} from 'react' 
import {useNavigate, useLocation} from 'react-router-dom'
import { useReduxFetch } from '../../../../hooks/useReduxFetch'
import { getAllMedia } from '../mediaAdminSlice'
import VideoLayout from './VideoLayout'
import YouTubeVideoView from '../YouTubeVideoView'
import InstVideoView from '../InstVideoView'
import FaceVideoView from '../FaceVideoView'
import { type IMedia } from '../../../../types/media'


export type VideoProps = {
  media: IMedia[]
}
const VideoPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { media } = useReduxFetch({
    action: getAllMedia,
    selector: (state) => state.adminMedia
  })

// Lee el parámetro "tab" de la URL. Si no existe, usa un valor predeterminado.
const queryParams = new URLSearchParams(location.search);
const initialTab = queryParams.get('subtab') || 'facebook';

const [activeTab, setActiveTab] = useState(initialTab);
  

const handleTabChange = (activeTab:string) => {
  navigate(`/admin?tab=videos&subtab=${activeTab}`); // Actualiza la URL.
  setActiveTab(activeTab);
};


  return (
      <section className="container-fluid">
      
        <h2 className="fw-light">Gestion de contenido multimedia:</h2>
        <VideoLayout
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    >
      {activeTab === 'facebook' && (
        <FaceVideoView media={media}/>
      )}
      {activeTab === 'instagram' && (
        <InstVideoView media={media}/>
      )}
      {activeTab === 'youtube' && (
        <YouTubeVideoView media={media}/>
      )}
    </VideoLayout>
  </section>
  )
}

export default VideoPage
 