import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Ratio, Button, Badge } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../../../utils/SlickCarousel";
import { booleanState } from "../../AdminUtils/helpers";
import type { VideoProps } from './videoTabsComponents/VideosPage';
import type { IMedia } from "../../../types/media";
import { mediaApi } from "../../AdminApi/mediaApi";
import { getFacebookEmbedUrl, getFacebookBadgeLabel } from "../../../utils/mediaEmbedHelpers";


const FaceVideoView = ({ media }:VideoProps) => {
  const navigate = useNavigate();

  const videoList = media.filter((video) => video.type === "facebook");
  const videos:IMedia = videoList[0] || {
    id: 0,
    type: "facebook",
    title: "Facebook",
    text: "Aguarde un momento...",
    url: "",
    enabled: true,
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mainVideo, setMainVideo] = useState<IMedia>(videos);

  useEffect(() => {
    if (isLoading && videoList.length > 0) {
      setMainVideo(videoList[0]);//eslint-disable-line
      setIsLoading(false); // Marcar que ya no estamos cargando
    }
  }, [videoList, isLoading]);

  const handleVideoSelect = (selectedVideo: IMedia) => {
    setMainVideo(selectedVideo);
  };

  //Borrar video:
  const delVideo = async (id: number) => {
    const confirmed = await mediaApi.confirmAction({
     title:"¿Está seguro de eliminar el item?"
    })
    if (confirmed) {
      await mediaApi.delete(id)
    }
  };

  const disabledEdit = ():boolean=>{
    if(!videoList[0] || videoList[0].id === 0){
      return true
    }
    return false
  }

  const mainEmbedUrl = getFacebookEmbedUrl(mainVideo.url);

  return (
    <Container className="card p-4">
      {/* Video Principal */}
      <Row className="featurette mt-3">
        <Col xs={12} md={5}>
          <Button
            className="mt-2 me-3 w-20"
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/admin/videos/type:facebook/creacion")}
          >
            Crear
          </Button>
          <div className="d-flex align-items-center gap-2 mb-2 mt-2">
            <Badge bg="primary" className="px-2 py-1 fs-6">
              {getFacebookBadgeLabel(mainVideo.url)}
            </Badge>
          </div>
          <h2 className="featurette-heading fw-normal lh-1">
            {mainVideo.title}
          </h2>
          <p className="lead">{mainVideo.text}</p>
          <p className="lead">
            <strong>Estado: </strong> {booleanState(mainVideo.enabled)}
          </p>
        </Col>
        <Col xs={12} md={7} className="d-flex flex-column align-items-center justify-content-start">
            {mainEmbedUrl ? (
              <>
                <iframe
                  src={mainEmbedUrl}
                  title={`Facebook: ${mainVideo.title}`}
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
      <Row className="mt-4">
        {videoList.length > 0 ? (
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
                <div className="d-flex flex-wrap gap-1 mt-2">
                  <Button
                    className="flex-fill"
                    variant={selected ? "success" : "outline-success"}
                    size="sm"
                    onClick={() => handleVideoSelect(video)}
                  >
                    Ver
                  </Button>
                  <Button
                    className="flex-fill"
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/admin/videos/${video.id}/edicion`)
                    }
                    disabled={disabledEdit()}
                  >
                    Editar
                  </Button>
                  <Button
                    className="flex-fill"
                    variant="outline-danger"
                    size="sm"
                    onClick={() => delVideo(video.id as number)}
                    disabled={disabledEdit()}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            )})}
          </Slider>
        ) : (
          <p className="text-muted">No hay publicaciones de Facebook cargadas.</p>
        )}
      </Row>
    </Container>
  );
};

export default FaceVideoView;
