import { useReduxFetch } from '../../hooks/useReduxFetch';
import FacebookVideo from '../Features/Media/FacebookVideo';
import Header from '../../components/Layout/Header';
import InstagramVideo from '../Features/Media/InstagramVideo';
import YouTubeVideo from '../Features/Media/YouTubeVideo';
import { getPublicMedia } from '../Features/Media/mediaSlice';
import Footer from '../../components/Layout/Footer';

const Videos = () => {
  const { publicMedia } = useReduxFetch({
    action: getPublicMedia,
    selector: (state) => state.media,
  });
  return (
    <>
      <div className="imageBack">
        {/* <MetaInfo info={info}/> */}
        <Header/>
        <div className="container coverAbout">
          <div className="caption-nav mb-2" style={{ marginTop: '4rem', maxWidth: 'fit-content', alignItems: 'center' }}>
            <h2 className="about-h1">Videos:</h2>
          </div>
          <div className=" container-fluid colorBack rounded-4 shadow">
            <section>
              <h2 className="videoTitle fw-normal lh-lg">Publicaciones de Facebook:</h2>
              <FacebookVideo media={publicMedia} />
              <hr></hr>
            </section>
            <section>
              <h2 className="videoTitle fw-normal lh-lg">Publicaciones de Instagram:</h2>
              <InstagramVideo media={publicMedia} />
              <hr></hr>
            </section>
            <section>
              <h2 className="videoTitle fw-normal lh-lg">Videos de You Tube:</h2>
              <YouTubeVideo media={publicMedia} />
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Videos