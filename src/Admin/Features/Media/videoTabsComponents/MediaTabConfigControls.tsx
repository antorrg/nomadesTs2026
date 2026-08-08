import { Form, Card, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../../../store/store';
import { updateMediaConfigThunk, updateAdminTabConfig } from '../mediaAdminSlice';
import { updateTabConfig } from '../../../../PublicAccess/Features/Media/mediaSlice';
import { type MediaTabVisibilityConfig } from '../../../../types/mediaConfig';

const MediaTabConfigControls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector((state: RootState) => state.adminMedia.tabConfig || state.media.tabConfig);

  const handleToggle = (key: keyof MediaTabVisibilityConfig) => {
    const updatedConfig: MediaTabVisibilityConfig = {
      ...config,
      [key]: !config[key],
    };
    dispatch(updateAdminTabConfig(updatedConfig));
    dispatch(updateTabConfig(updatedConfig));
    dispatch(updateMediaConfigThunk(updatedConfig));
  };

  return (
    <Card className="mb-3 border-secondary shadow-sm">
      <Card.Header className="bg-secondary text-white fw-normal py-2">
        <i className="bi bi-gear-fill me-2"></i>
        Configuración de Visibilidad de Pestañas (Vista Pública)
      </Card.Header>
      <Card.Body className="py-2 px-3">
        <Form>
          <Row className="align-items-center g-3">
            <Col xs={12} sm={4}>
              <Form.Check
                type="switch"
                id="switch-facebook"
                label="Mostrar Facebook"
                checked={config.showFacebook}
                onChange={() => handleToggle('showFacebook')}
                className="fw-semibold text-primary"
              />
            </Col>
            <Col xs={12} sm={4}>
              <Form.Check
                type="switch"
                id="switch-instagram"
                label="Mostrar Instagram"
                checked={config.showInstagram}
                onChange={() => handleToggle('showInstagram')}
                className="fw-semibold text-danger"
              />
            </Col>
            <Col xs={12} sm={4}>
              <Form.Check
                type="switch"
                id="switch-youtube"
                label="Mostrar YouTube"
                checked={config.showYouTube}
                onChange={() => handleToggle('showYouTube')}
                className="fw-semibold text-success"
              />
            </Col>
          </Row>
        </Form>
        <Form.Text className="text-muted small mt-1 d-block">
          <i className="bi bi-info-circle me-1"></i>
          En la administración se siguen viendo todas las pestañas para su gestión. Las casillas anteriores determinan cuáles estarán visibles para los visitantes públicos.
        </Form.Text>
      </Card.Body>
    </Card>
  );
};

export default MediaTabConfigControls;
