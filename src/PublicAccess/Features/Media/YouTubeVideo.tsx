import { useState, useEffect } from "react";
import { Container, Row, Col, Ratio, Button } from "react-bootstrap";
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
  let videos = videoList[0] ?? {
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
      /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/))([^\s&]+)/
    );
    return match ? match[1] : null;
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
              onClick={() => navigate("/admin/media/create?type=youtube")}
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
              src={`https://www.youtube-nocookie.com/embed/${videoId(mainVideo.url)}`}
              title={mainVideo.title}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </Ratio>
        </Col>
      </Row>

      {/* Carrusel de miniaturas */}
      {showCarousel ? (
        <Row className="mt-4">
          <Slider {...sliderSettings}>
            {videoList.map((video) => (
              <div key={video.id} className="p-2">
                <Ratio aspectRatio="16x9">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId(video.url)}`}
                    title={`Miniatura ${video.id}`}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
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

export default YouTubeVideo;
