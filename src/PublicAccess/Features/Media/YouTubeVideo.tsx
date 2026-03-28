import { useState, useEffect } from "react";
import { Container, Row, Col, Ratio, Button, Image } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../../../utils/SlickCarousel";
import type { IMedia } from '../../../types/media';

interface YouTubeVideoProps {
  media: IMedia[];
}

const YouTubeVideo = ({ media }: YouTubeVideoProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const videoList = media?.filter((video) => video.type === "youtube");
  const videos = videoList[0] ?? {
    id: "0",
    title: "Videos de you tube",
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

  const videoId = (url: string) => {
    const match = url.match(
      /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/))([^?\s&]+)/
    );
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (url: string): string => {
    const id = videoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  };

  return (
    <Container>
      {/* Video principal */}
      <Row className="featurette mt-5">
        <Col xs={12} md={5}>
          {isAuthenticated ? (
            <Button
              className="mt-2 me-3 w-20"
              variant="outline-primary"
              size="sm"
              onClick={() => navigate("/admin/videos/type:youtube/creacion")}
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
            {videoId(mainVideo.url) ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId(mainVideo.url)}`}
                title={mainVideo.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center border rounded bg-body-tertiary">
                No hay video disponible
              </div>
            )}
          </Ratio>
        </Col>
      </Row>

      {/* Carrusel de miniaturas */}
      {showCarousel ? (
        <Row className="mt-4">
          <Slider {...sliderSettings}>
            {videoList.map((video) => {
              const thumbnailUrl = getThumbnailUrl(video.url);
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
                    {thumbnailUrl ? (
                      <Image
                        src={thumbnailUrl}
                        alt={video.title}
                        fluid
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-body-tertiary">
                        Sin miniatura
                      </div>
                    )}
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

export default YouTubeVideo;
