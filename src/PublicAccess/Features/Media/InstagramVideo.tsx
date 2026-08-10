import { useState } from "react";
import { Container, Row, Col, Ratio, Button, Badge } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../../../utils/SlickCarousel";
import type { IMedia } from '../../../types/media';
import { getInstagramEmbedUrl, getInstagramBadgeLabel } from "../../../utils/mediaEmbedHelpers";

interface InstagramVideoProps {
  media: IMedia[];
}

const InstagramVideo = ({ media }: InstagramVideoProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const videoList = media?.filter((video) => video.type === "instagram") ?? [];
  const [selectedVideo, setSelectedVideo] = useState<IMedia | null>(null);

  const mainVideo = selectedVideo ?? videoList[0] ?? {
    id: "02",
    type: "instagram",
    title: "Instagram",
    text: "Aguarde un momento...",
    url: "",
  };

  const showCarousel = videoList.length > 1;

  const handleVideoSelect = (video: IMedia) => {
    setSelectedVideo(video);
  };

  const mainEmbedUrl = getInstagramEmbedUrl(mainVideo.url);

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
              onClick={() => navigate("/admin/videos/type:instagram/creacion")}
            >
              Crear
            </Button>
          ) : null}
          <div className="d-flex align-items-center gap-2 mb-2 mt-2">
            <Badge bg="danger" className="px-2 py-1 fs-6" style={{ backgroundColor: '#E1306C' }}>
              {getInstagramBadgeLabel(mainVideo.url)}
            </Badge>
          </div>
          <h2 className="featurette-heading fw-normal lh-1">
            {mainVideo.title}
          </h2>
          <p className="lead">{mainVideo.text}</p>
        </Col>
        <Col xs={12} md={7} className="d-flex justify-content-center align-items-start">
            {mainEmbedUrl ? (
              <iframe
                src={mainEmbedUrl}
                title={`Instagram: ${mainVideo.title}`}
                className="rounded border shadow-sm"
                style={{ width: "100%", maxWidth: "380px", height: "600px", border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-presentation"
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center border rounded bg-body-tertiary w-100" style={{ maxWidth: "380px", height: "600px" }}>
                No hay contenido disponible
              </div>
            )}
        </Col>
      </Row>
      {/* Lista de Miniaturas */}
      {showCarousel ? (
        <Row className="mt-4">
          <Slider {...sliderSettings}>
            {videoList.map((video) => {
              const selected = mainVideo.id === video.id;

              return (
              <div key={video.id} className="p-2">
                <div
                  className={`border rounded overflow-hidden shadow-sm position-relative d-flex flex-column align-items-center justify-content-center ${
                    selected ? "border-danger border-3" : ""
                  }`}
                  style={{ cursor: "pointer", height: "180px", background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)" }}
                  onClick={() => handleVideoSelect(video)}
                >
                  <i className="bi bi-instagram text-white mb-2" style={{ fontSize: "2.5rem" }}></i>
                  <Badge bg="light" text="dark" className="mb-2 px-2 py-1 fs-7">
                    {getInstagramBadgeLabel(video.url)}
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

export default InstagramVideo;
