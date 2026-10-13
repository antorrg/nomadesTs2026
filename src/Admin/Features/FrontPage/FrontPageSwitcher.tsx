import { Form, Card, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { type FrontPageResults } from '../../../types/frontPage';
import { frontPageApi } from '../../AdminApi/frontPageApi'


type FrontPageSwitcherProps = {
  data: FrontPageResults
}
type VisibilityConfig = {
  showHighLights: boolean;
  showMarketing: boolean;
};

const FrontPageSwitcher = ({data}: FrontPageSwitcherProps) => {
  const showHigh = data?.showHighLights ?? false
  const showMark = data?.showMarketing ?? false

  const [switched, setSwitched] = useState<VisibilityConfig>({
    showHighLights: showHigh,
    showMarketing: showMark
  })

const [isSaving, setIsSaving] = useState(false);


const handleToggle = async (field: keyof VisibilityConfig) => {
  if (!data?.id || isSaving) return;

  const previousConfig = { ...switched };

  const updatedConfig: VisibilityConfig = {
    ...switched,
    [field]: !switched[field],
  };

  setSwitched(updatedConfig);
  setIsSaving(true);

  try {
    await frontPageApi.switchViews(data.id, updatedConfig);
  } catch (error: unknown) {
    setSwitched(previousConfig);
    console.error('Error al actualizar la visibilidad:', error);
  } finally {
    setIsSaving(false);
  }
};


  return (
    <Card className="mb-3 border-secondary shadow-sm align-items-center g-1">
      <Card.Body className="py-1 px-1">
        <Form>
          <Row className="align-items-center g-3">
            <Col xs={12} sm={4}>
              <Form.Check
                type="switch"
                id="switch-high"
                label="Mostrar Destacados"
                checked={switched.showHighLights}
                onChange={() => handleToggle('showHighLights')}
                className="fw-semibold text-primary"
              />
            </Col>
            <Col xs={12} sm={4}>
              <Form.Check
                type="switch"
                id="switch-marketing"
                label="Mostrar Coleccion"
                checked={switched.showMarketing}
                onChange={() =>handleToggle('showMarketing')}
                className="fw-semibold text-danger"
              />
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FrontPageSwitcher;
