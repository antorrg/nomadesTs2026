import { useState, useEffect } from "react";
import { Container, Row, Col, Ratio, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../../../utils/SlickCarousel";
import type { IMedia } from '../../../types/media';

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

  const showCarousel = videoList.length > 1 ? true : false;

  const handleVideoSelect = (video: IMedia) => {
    setMainVideo(video);
  };

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
          <h2 className="featurette-heading fw-normal lh-1">
            {mainVideo.title}
          </h2>
          <p className="lead">{mainVideo.text}</p>
        </Col>
        <Col xs={12} md={7} className="d-flex justify-content-center align-items-start">
            {mainVideo.url ? (
              <iframe
                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                  mainVideo.url
                )}&show_text=false`}
                title={`Video de Facebook: ${mainVideo.title}`}
                className="rounded border shadow-sm w-100"
                style={{ border: "none", overflow: "hidden", minHeight: "500px" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center border rounded bg-body-tertiary w-100" style={{ minHeight: "500px" }}>
                No hay video disponible
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
                  className={`border rounded overflow-hidden ${
                    selected ? "border-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleVideoSelect(video)}
                >
                  <Ratio aspectRatio="16x9">
                    <div className="d-flex flex-column align-items-center justify-content-center bg-body-tertiary text-muted">
                      <i className="bi bi-facebook fs-1 mb-2" style={{ color: '#1877F2' }}></i>
                      <span className="small text-center px-2 fw-semibold">{video.title}</span>
                    </div>
                  </Ratio>
                </div>
                <Button
                  className="mt-2 w-20"
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleVideoSelect(video)}
                >
                  Ver video
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
