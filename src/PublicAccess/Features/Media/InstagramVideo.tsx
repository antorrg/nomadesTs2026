import { useState, useEffect } from "react";
import { Container, Row, Col, Ratio, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {sliderSettings} from "../../../utils/SlickCarousel";
import type { IMedia } from '../../../types/media';

interface InstagramVideoProps {
  media: IMedia[];
}

const InstagramVideo = ({ media }: InstagramVideoProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const videoList = media?.filter((video) => video.type === "instagram");
  let videos = videoList[0] ?? {
    id: "02",
    type: "instagram",
    title: "Instagram",
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

  const handleVideoSelect = (video) => {
    setMainVideo(video);
  };

  const getEmbedUrl = (url) => {
    const parts = url.split("/");
    const videoId = parts[parts.length - 2];
    return `https://www.instagram.com/reel/${videoId}/embed`;
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
              onClick={() => navigate("/admin/media/create?type=instagram")}
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
            <iframe
              src={getEmbedUrl(mainVideo.url)}
              title="Instagram Reel"
              frameBorder="0"
              allowFullScreen
            />
          </Ratio>
        </Col>
      </Row>
      {/* Lista de Miniaturas */}
      {showCarousel ? (
        <Row className="mt-4">
          <Slider {...sliderSettings}>
            {videoList.map((video) => (
              <div key={video.id} className="p-2">
                <Ratio aspectRatio="16x9">
                  <iframe
                    src={getEmbedUrl(video.url)}
                    title={`Miniatura ${video.id}`}
                    frameBorder="0"
                    allowFullScreen
                  />
                </Ratio>
                <Button
                  className="mt-2 w-20"
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleVideoSelect(video)}
                >
                  Ver video
                </Button>
              </div>
            ))}
          </Slider>
        </Row>
      ) : null}
    </Container>
  );
};

export default InstagramVideo;
