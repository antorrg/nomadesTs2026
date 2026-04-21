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
        <Col xs={12} md={7}>
          <Ratio aspectRatio="16x9">
            {mainVideo.url ? (
              <iframe
                src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
                  mainVideo.url
                )}&show_text=true&width=500&height=300&appId`}
                title={`Video de Facebook: ${mainVideo.title}`}
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center border rounded bg-body-tertiary">
                No hay video disponible
              </div>
            )}
          </Ratio>
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
                    <div className="d-flex align-items-center justify-content-center bg-body-tertiary">
                      Video Facebook
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
