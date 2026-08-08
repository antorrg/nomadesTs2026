import { useSelector } from 'react-redux';
import { useReduxFetch } from '../../hooks/useReduxFetch';
import FacebookVideo from '../Features/Media/FacebookVideo';
import Header from '../../components/Layout/Header';
import InstagramVideo from '../Features/Media/InstagramVideo';
import YouTubeVideo from '../Features/Media/YouTubeVideo';
import { getPublicMedia } from '../Features/Media/mediaSlice';
import Footer from '../../components/Layout/Footer';
import { type RootState } from '../../store/store';

const Videos = () => {
  useReduxFetch({
    action: getPublicMedia,
    selector: (state) => state.media,
  });

  const publicMedia = useSelector((state: RootState) => state.media.publicMedia);
  const tabConfig = useSelector((state: RootState) => state.media.tabConfig);

  const hasAnyTabActive = tabConfig.showFacebook || tabConfig.showInstagram || tabConfig.showYouTube;

  return (
    <>
      <div className="imageBack">
        {/* <MetaInfo info={info}/> */}
        <Header/>
        <div className="container coverAbout">
          <div className="caption-nav mb-2" style={{ marginTop: '4rem', maxWidth: 'fit-content', alignItems: 'center' }}>
            <h2 className="about-h1">Videos:</h2>
          </div>
          <div className=" container-fluid colorBack rounded-4 shadow py-3">
            {!hasAnyTabActive ? (
              <div className="text-center py-5 text-muted">
                <h4>No hay secciones de contenido multimedia disponibles en este momento.</h4>
              </div>
            ) : (
              <>
                {tabConfig.showFacebook && (
                  <section className="mb-4">
                    <h2 className="videoTitle fw-normal lh-lg">Publicaciones de Facebook:</h2>
                    <FacebookVideo media={publicMedia} />
                    {(tabConfig.showInstagram || tabConfig.showYouTube) && <hr />}
                  </section>
                )}
                {tabConfig.showInstagram && (
                  <section className="mb-4">
                    <h2 className="videoTitle fw-normal lh-lg">Publicaciones de Instagram:</h2>
                    <InstagramVideo media={publicMedia} />
                    {tabConfig.showYouTube && <hr />}
                  </section>
                )}
                {tabConfig.showYouTube && (
                  <section className="mb-4">
                    <h2 className="videoTitle fw-normal lh-lg">Videos de YouTube:</h2>
                    <YouTubeVideo media={publicMedia} />
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Videos;