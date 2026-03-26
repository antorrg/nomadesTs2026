import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Ratio, Button, Image } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../../../utils/SlickCarousel";
import { booleanState } from "../../AdminUtils/helpers";
import type { VideoProps } from "./videoTabsComponents/VideosPage";
import type { IMedia } from "../../../types/media";
import { mediaApi } from "../../AdminApi/mediaApi";

const FALLBACK_VIDEO: IMedia = {
  id: 0,
  title: "Videos de YouTube",
  text: "Aguarde un momento...",
  type:"",
  url: "",
  enabled: true
};

const YouTubeVideoView = ({ media }: VideoProps) => {
  const navigate = useNavigate();

  const videoList = useMemo(
    () => media.filter((video) => video.type === "youtube"),
    [media]
  );

  const [mainVideo, setMainVideo] = useState<IMedia>(videoList[0] ?? FALLBACK_VIDEO);

  useEffect(() => {
    if (videoList.length > 0) {
      setMainVideo((prev) => {
        const stillExists = videoList.some((video) => video.id === prev.id);
        return stillExists ? prev : videoList[0];
      });
    } else {
      setMainVideo(FALLBACK_VIDEO);
    }
  }, [videoList]);

  const handleVideoSelect = (video: IMedia) => {
    setMainVideo(video);
  };

  const getVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/))([^?\s&]+)/
    );
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (url: string): string => {
    const id = getVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  };

  const mainVideoId = getVideoId(mainVideo.url);

  const delVideo = async (id: number) => {
    const confirmed = await mediaApi.confirmAction({
      title: "¿Está seguro de eliminar el item?"
    });

    if (confirmed) {
      await mediaApi.delete(id);
    }
  };

  const isFallbackVideo = (video: IMedia): boolean => {
    return video.id === 0 || video.id === "03";
  };

  return (
    <Container>
      <Row className="featurette mt-5">
        <Col xs={12} md={5}>
          <Button
            className="mt-2 me-3"
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/admin/videos/type:youtube/creacion")}
          >
            Crear
          </Button>

          <h2 className="featurette-heading fw-normal lh-1 mt-3">
            {mainVideo.title}
          </h2>

          <p className="lead">{mainVideo.text}</p>

          <p className="lead">
            <strong>Estado: </strong> {booleanState(mainVideo.enabled)}
          </p>
        </Col>

        <Col xs={12} md={7}>
          <Ratio aspectRatio="16x9">
            {mainVideoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${mainVideoId}`}
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

      <Row className="mt-4">
        {videoList.length > 0 ? (
          <Slider {...sliderSettings}>
            {videoList.map((video) => {
              const thumbnailUrl = getThumbnailUrl(video.url);
              const selected = mainVideo.id === video.id;
              const disabled = isFallbackVideo(video);

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
                    className="mt-2 me-2"
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleVideoSelect(video)}
                  >
                    Ver video
                  </Button>

                  <Button
                    className="mt-2 me-2"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/admin/videos/${video.id}/edicion`)}
                    disabled={disabled}
                  >
                    Editar
                  </Button>

                  <Button
                    className="mt-2"
                    variant="outline-danger"
                    size="sm"
                    onClick={() => delVideo(video.id as number)}
                    disabled={disabled}
                  >
                    Eliminar
                  </Button>
                </div>
              );
            })}
          </Slider>
        ) : (
          <p className="text-muted">No hay videos de YouTube cargados.</p>
        )}
      </Row>
    </Container>
  );
};

export default YouTubeVideoView;
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Row, Col, Ratio, Button } from "react-bootstrap";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { sliderSettings } from "../../../utils/SlickCarousel";
// import { booleanState } from "../../AdminUtils/helpers";
// import type { VideoProps } from './videoTabsComponents/VideosPage';
// import type { IMedia } from "../../../types/media";
// import { mediaApi } from "../../AdminApi/mediaApi";


// const YouTubeVideoView = ({ media }:VideoProps) => {
//   const navigate = useNavigate();
 

//   const videoList = media.filter((video) => video.type === "youtube");
//   let videos: IMedia = videoList[0] || {
//     id: "03",
//     title: "Videos de you tube",
//     text: "Aguarde un momento...",
//     url: "",
//     enabled: true,
//   };

//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [mainVideo, setMainVideo] = useState<IMedia>(videos);

//   useEffect(() => {
//     if (isLoading && videoList.length > 0) {
//       setMainVideo(videoList[0]);
//       setIsLoading(false); // Marcar que ya no estamos cargando
//     }
//   }, [videoList, isLoading]);

//   const handleVideoSelect = (video:IMedia) => {
//     setMainVideo(video);
//   };

//   const videoId = (url: string) => {
//     const match = url.match(
//       /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/))([^\s&]+)/
//     );
//     return match ? match[1] : null;
//   };
//   //Borrar video:
//   const delVideo = async (id: number) => {
//     const confirmed = await mediaApi.confirmAction({
//      title:"¿Está seguro de eliminar el item?"
//     })
//     if (confirmed) {
//       // Aquí iría la lógica para actualizar el elemento

//       await mediaApi.delete(id)
//     }
//   };
//  const disabledEdit = (video: IMedia): boolean => {
//   return video.id === "03" || video.id === 0;
// };
//   return (
//     <Container>
//       {/* Video principal */}
//       <Row className="featurette mt-5">
//         <Col xs={12} md={5}>
//           <Button
//             className="mt-2 me-3 w-20"
//             variant="outline-primary"
//             size="sm"
//             onClick={() => navigate("/admin/videos/type:youtube/creacion")}
//           >
//             Crear
//           </Button>
//           <h2 className="featurette-heading fw-normal lh-1">
//             {mainVideo.title}
//           </h2>
//           <p className="lead">{mainVideo.text}</p>
//           <p className="lead">
//             <strong>Estado: </strong> {booleanState(mainVideo.enabled)}
//           </p>
//         </Col>
//         <Col xs={12} md={7}>
//           <Ratio aspectRatio="16x9">
//             <iframe
//               src={`https://www.youtube-nocookie.com/embed/${videoId(mainVideo.url)}`}
//               title={mainVideo.title}
//               allowFullScreen
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               referrerPolicy="strict-origin-when-cross-origin"
//             />
//           </Ratio>
//         </Col>
//       </Row>

//       {/* Carrusel de miniaturas */}
//       <Row className="mt-4">
//         <Slider {...sliderSettings}>
//           {videoList.map((video) => (
//             <div key={video.id} className="p-2">
//               <Ratio aspectRatio="16x9">
//                 <iframe
//                   src={`https://www.youtube-nocookie.com/embed/${videoId(video.url)}`}
//                   title={`Miniatura ${video.id}`}
//                   allowFullScreen
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   referrerPolicy="strict-origin-when-cross-origin"
//                 />
//               </Ratio>
//               <Button
//                 className="mt-2 me-3 w-20"
//                 variant="outline-success"
//                 size="sm"
//                 onClick={() => handleVideoSelect(video)}
//               >
//                 Ver video
//               </Button>
//               <Button
//                 className="mt-2 me-3 w-20"
//                 variant="outline-primary"
//                 size="sm"
//                 onClick={() =>
//                   navigate(`/admin/videos/${video.id}/edicion?type=${video.type}`)
//                 }
//                 disabled={disabledEdit(video)}
//               >
//                 Editar
//               </Button>
//               <Button
//                 className="mt-2 me-3 w-20"
//                 variant="outline-danger"
//                 size="sm"
//                 onClick={() => delVideo(video.id as number)}
//                 disabled={disabledEdit(video)}
//               >
//                 Eliminar
//               </Button>
//             </div>
//           ))}
//         </Slider>
//       </Row>
//     </Container>
//   );
// };

// export default YouTubeVideoView;
