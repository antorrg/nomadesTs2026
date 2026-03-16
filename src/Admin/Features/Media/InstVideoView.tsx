import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Ratio, Button } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../../../utils/SlickCarousel";
import { booleanState } from "../../AdminUtils/helpers";
import type { VideoProps } from './videoTabsComponents/VideosPage';
import type { IMedia } from "../../../types/media";
import { mediaApi } from "../../AdminApi/mediaApi";


const InstVideoView = ({ media }: VideoProps) => {
  const navigate = useNavigate();
  const videoList = media.filter((video) => video.type === "instagram");
  let videos:IMedia = videoList[0] || {
    id: "02",
    type: "instagram",
    title: "Instagram",
    text: "Aguarde un momento...",
    url: "",
    enable: true,
  };
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mainVideo, setMainVideo] = useState<IMedia>(videos);

  useEffect(() => {
    if (isLoading && videoList.length > 0) {
      setMainVideo(videoList[0]);
      setIsLoading(false); // Marcar que ya no estamos cargando
    }
  }, [videoList, isLoading]);

  const handleVideoSelect = (video:IMedia) => {
    setMainVideo(video);
  };

  const getEmbedUrl = (url:string) => {
    const parts = url.split("/");
    const videoId = parts[parts.length - 2];
    return `https://www.instagram.com/reel/${videoId}/embed`;
  };

  //Borrar video:
  const delVideo = async (id: number) => {
    const confirmed = await mediaApi.confirmAction({
     title:"¿Está seguro de eliminar el item?"
    })
    if (confirmed) {
      // Aquí iría la lógica para actualizar el elemento

      await mediaApi.delete(id)
    }
  };

  return (
    <Container>
      {/* Video Principal */}
      <Row className="featurette mt-5">
        <Col xs={12} md={5}>
          <Button
            className="mt-2 me-3 w-20"
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/admin/media/create?type=facebook")}
          >
            Crear
          </Button>
          <h2 className="featurette-heading fw-normal lh-1">
            {mainVideo.title}
          </h2>
          <p className="lead">{mainVideo.text}</p>
          <p className="lead">
            <strong>Estado: </strong> {booleanState(mainVideo.enabled)}
          </p>
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
      <Row className="mt-4">
        <Slider {...sliderSettings}>
          {videoList.map((video) => (
            <div key={video.id} xs={5} md={3} lg={3} className="p-2">
              <Ratio aspectRatio="16x9">
                <iframe
                  src={getEmbedUrl(video.url)}
                  title={`Miniatura ${video.id}`}
                  frameBorder="0"
                  allowFullScreen
                />
              </Ratio>
              <Button
                className="mt-2 me-3 w-20"
                variant="outline-success"
                size="sm"
                onClick={() => handleVideoSelect(video)}
              >
                Ver video
              </Button>
              <Button
                className="mt-2 me-3 w-20"
                variant="outline-primary"
                size="sm"
                onClick={() =>
                  navigate(`/admin/media/update/${video.id}?type=instagram`)
                }
              >
                Editar
              </Button>
              <Button
                className="mt-2 me-3 w-20"
                variant="outline-danger"
                size="sm"
                onClick={() => delVideo(video.id)}
              >
                Eliminar
              </Button>
            </div>
          ))}
        </Slider>
      </Row>
    </Container>
  );
};

export default InstVideoView;
