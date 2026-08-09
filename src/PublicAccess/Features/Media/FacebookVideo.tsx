import { useState, useEffect } from "react";
import { Container, Row, Col, Ratio, Button, Badge } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../../../utils/SlickCarousel";
import type { IMedia } from '../../../types/media';
import { getFacebookEmbedUrl, getFacebookBadgeLabel } from "../../../utils/mediaEmbedHelpers";

interface FacebookVideoProps {
  media: IMedia[];
}

const FacebookVideo = ({ media }: FacebookVideoProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const videoList = media?.filter((video) => video.type === "facebook");
  const videos = videoList[0] ?? {
    id: "01",
    type: "facebook",
    title: "Facebook",
    text: "Aguarde un momento...",
    url: "",
  };
  const [isLoading, setIsLoading] = useState(true);
  const [mainVideo, setMainVideo] = useState(videos);

  useEffect(() => {
    if (isLoading && videoList.length > 0) {
      setMainVideo(videoList[0]);
      setIsLoading(false); // Marcar que ya no estamos cargando
    }
  }, [videoList, isLoading]);

  const showCarousel = videoList.length > 1;

  const handleVideoSelect = (video: IMedia) => {
    setMainVideo(video);
  };

  const mainEmbedUrl = getFacebookEmbedUrl(mainVideo.url);

  return (
    <Container>
      {/* Video Principal */}
      <Row className="featurette mt-5">
        <Col xs={12} md={5}>
          {isAuthenticated ? (
            <Button
              className="mt-2 me-3 w-20"
              variant="outline-primary"
              size="sm"
              onClick={() => navigate("/admin/videos/type:facebook/creacion")}
            >
              Crear
            </Button>
          ) : null}
          <div className="d-flex align-items-center gap-2 mb-2 mt-2">
            <Badge bg="primary" className="px-2 py-1 fs-6">
              {getFacebookBadgeLabel(mainVideo.url)}
            </Badge>
          </div>
          <h2 className="featurette-heading fw-normal lh-1">
            {mainVideo.title}
          </h2>
          <p className="lead">{mainVideo.text}</p>
        </Col>
        <Col xs={12} md={7} className="d-flex flex-column align-items-center justify-content-start">
            {mainEmbedUrl ? (
              <>
                <iframe
                  src={mainEmbedUrl}
                  title={`Publicación de Facebook: ${mainVideo.title}`}
                  className="rounded border shadow-sm"
                  style={{ width: "100%", maxWidth: "500px", height: "600px", border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                />
                {mainVideo.url && (
                  <a
                    href={mainVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm mt-2 w-100"
                    style={{ maxWidth: "500px" }}
                  >
                    <i className="bi bi-facebook me-2"></i>Ver directamente en Facebook
                  </a>
                )}
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center border rounded bg-body-tertiary w-100" style={{ maxWidth: "500px", height: "600px" }}>
                No hay publicación disponible
              </div>
            )}
        </Col>
      </Row>

      {/* Lista de Miniaturas con Botones */}
      {showCarousel ? (
        <Row className="mt-4">
          <Slider {...sliderSettings}>
            {videoList.map((video) => {
              const selected = mainVideo.id === video.id;

              return (
              <div key={video.id} className="p-2">
                <div
                  className={`border rounded overflow-hidden shadow-sm position-relative d-flex flex-column align-items-center justify-content-center ${
                    selected ? "border-primary border-3" : ""
                  }`}
                  style={{ cursor: "pointer", height: "180px", background: "linear-gradient(135deg, #1877F2 0%, #0d5cb6 100%)" }}
                  onClick={() => handleVideoSelect(video)}
                >
                  <i className="bi bi-facebook text-white mb-2" style={{ fontSize: "2.5rem" }}></i>
                  <Badge bg="light" text="dark" className="mb-2 px-2 py-1 fs-7">
                    {getFacebookBadgeLabel(video.url)}
                  </Badge>
                  <div 
                    className="position-absolute bottom-0 start-0 end-0 p-2 text-white text-truncate fw-semibold text-center"
                    style={{ background: "rgba(0,0,0,0.6)", fontSize: "0.85rem" }}
                  >
                    {video.title}
                  </div>
                </div>
                <Button
                  className="mt-2 w-100"
                  variant={selected ? "success" : "outline-success"}
                  size="sm"
                  onClick={() => handleVideoSelect(video)}
                >
                  {selected ? "Viendo ahora" : "Ver contenido"}
                </Button>
              </div>
            )})}
          </Slider>
        </Row>
      ) : null}
    </Container>
  );
};

export default FacebookVideo;
// const videoList = [
//   {
//     id: 'fb1',
//     type: 'facebook',
//     title: 'Facebook',
//     text: 'Haga click en el boton verde para seleccionar el video principal.',
//     url: 'https://fb.watch/vQGCkbbS_y/',
//   },
//   {
//     id: 'fb2',
//     type: 'facebook',
//     title: 'Facebook',
//     text: 'Haga click en el boton verde para seleccionar el video principal.',
//     url: 'https://www.facebook.com/reel/1274719967241755',
//   },
//   {
//     id: 'fb3',
//     type: 'facebook',
//     title: 'Facebook',
//     text: 'Haga click en el boton verde para seleccionar el video principal.',
//     url: 'https://fb.watch/v_aDfl8zZa/',
//   },
// ];
