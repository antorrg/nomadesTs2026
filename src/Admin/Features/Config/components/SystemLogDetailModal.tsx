import { Modal, Button } from 'react-bootstrap';
import type { ILogger } from '../../../types/systemLogs';

interface SystemLogDetailModalProps {
  show: boolean;
  onHide: () => void;
  log: ILogger | null;
}

const SystemLogDetailModal = ({ show, onHide, log }: SystemLogDetailModalProps) => {
  if (!log) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Registro #{log.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <strong>Nivel:</strong> {log.levelName} ({log.levelCode})<br />
          <strong>Host:</strong> {log.hostname}<br />
          <strong>PID:</strong> {log.pid}<br />
          <strong>Fecha:</strong> {new Date(log.time).toLocaleString()}<br />
          {log.type && (
            <>
              <strong>Tipo de Error:</strong> {log.type}<br />
            </>
          )}
          {log.status && (
            <>
              <strong>Estado HTTP:</strong> {log.status}<br />
            </>
          )}
        </div>

        <div className="mb-3">
          <strong>Mensaje Principal:</strong>
          <div className="p-2 bg-light border rounded mt-1">
            {log.message}
          </div>
        </div>

        {log.stack && (
          <div className="mb-3">
            <strong>Stack Trace:</strong>
            <pre className="p-3 bg-dark text-light rounded mt-1 overflow-auto" style={{ maxHeight: '400px', fontSize: '0.85rem' }}>
              <code>{log.stack}</code>
            </pre>
          </div>
        )}

        {log.contexts && log.contexts.length > 0 && (
          <div className="mb-3">
            <strong>Contextos adicionales:</strong>
            <pre className="p-2 bg-light border rounded mt-1 overflow-auto">
              {JSON.stringify(log.contexts, null, 2)}
            </pre>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SystemLogDetailModal;
