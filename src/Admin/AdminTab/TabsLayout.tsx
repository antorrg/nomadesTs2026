import React, { type ReactNode } from 'react';
import { Nav, Container, Row } from 'react-bootstrap';

interface TabsLayoutProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  sessionCleaner: () => void | Promise<void>;
  isLoading?: boolean;
  children: ReactNode;
}

const TabsLayout: React.FC<TabsLayoutProps> = ({ activeTab, handleTabChange, sessionCleaner, isLoading, children }) => {
  return (
    <div>
      <div className="">
        <Container className="coverAdmin pb-3">
          <Row>
            {/* Navegación por tabs */}
            <Nav variant="tabs" className="ms-2 mb-0" id="nav-tab" role="tablist">
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('producto')} active={activeTab === 'producto'}>
                  Producto
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('portada')} active={activeTab === 'portada'}>
                  Portada
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('trabajo')} active={activeTab === 'trabajo'}>
                  Trabajo
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('usuarios')} active={activeTab === 'usuarios'}>
                  Usuarios
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('imagenes')} active={activeTab === 'imagenes'}>
                  Imágenes
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('videos')} active={activeTab === 'videos'}>
                  Videos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('config')} active={activeTab === 'config'}>
                  Configuración
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('acerca')} active={activeTab === 'acerca'}>
                  Acerca
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabChange('ayuda')} active={activeTab === 'ayuda'}>
                  Ayuda
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={sessionCleaner} active={activeTab === 'logout'} disabled={isLoading}>
                  Cerrar sesión
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>
          <Container fluid className="d-flex flex-nowrap backgroundFormColor ">
            {/* Contenido dinámico */}
            {children}
          </Container>
        </Container>
      </div>
    </div>
  );
};

export default TabsLayout;
