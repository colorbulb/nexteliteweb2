import React, { useState } from 'react';
import { Modal, Button, Card, Accordion, Tabs, Badge, Avatar, Toast, Spinner, Progress, Alert } from 'flowbite-react';
import { Save, X } from 'lucide-react';
import { Container, Row, Col } from 'reactstrap';

export const ComponentTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(45);
  const [savedComponents, setSavedComponents] = useState([]);
  const [componentName, setComponentName] = useState('');

  const saveComponent = (name, component) => {
    if (!name.trim()) {
      alert('Please enter a component name');
      return;
    }
    setSavedComponents([...savedComponents, { id: Date.now(), name, component, timestamp: new Date() }]);
    setComponentName('');
  };

  const deleteComponent = (id) => {
    setSavedComponents(savedComponents.filter(c => c.id !== id));
  };

  return (
    <Container fluid className="p-4">
      <h1 className="h3 mb-4">Component Testing & Preview</h1>
      <p className="text-muted mb-4">
        Test Flowbite React components and save your favorites to reference later.
      </p>

      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <h2 className="h5 mb-3">Saved Components</h2>
            {savedComponents.length === 0 ? (
              <p className="text-muted">No components saved yet. Test components below and save them.</p>
            ) : (
              <Row className="g-3">
                {savedComponents.map(item => (
                  <Col key={item.id} md={6} lg={4}>
                    <Card>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{item.name}</h6>
                        <button
                          onClick={() => deleteComponent(item.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <small className="text-muted d-block mb-2">
                        {new Date(item.timestamp).toLocaleString()}
                      </small>
                      <div className="border rounded p-2 bg-light">
                        {item.component}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Modal Test */}
        <Col md={6}>
          <Card>
            <h3 className="h5 mb-3">Modal Component</h3>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Component name"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
              />
              <Button onClick={() => setShowModal(true)} className="me-2">Open Modal</Button>
              <Button
                color="success"
                onClick={() => saveComponent(componentName || 'Modal Test', (
                  <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                ))}
              >
                <Save size={14} className="me-1" /> Save
              </Button>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
              <Modal.Header>Test Modal</Modal.Header>
              <Modal.Body>
                <p>This is a Flowbite React modal component with proper accessibility.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </Modal.Footer>
            </Modal>
          </Card>
        </Col>

        {/* Toast Test */}
        <Col md={6}>
          <Card>
            <h3 className="h5 mb-3">Toast Component</h3>
            <Button onClick={() => setShowToast(true)}>Show Toast</Button>
            {showToast && (
              <Toast className="mt-3">
                <div className="ml-3 text-sm font-normal">Toast notification example</div>
                <Toast.Toggle onDismiss={() => setShowToast(false)} />
              </Toast>
            )}
          </Card>
        </Col>

        {/* Progress Bar */}
        <Col md={6}>
          <Card>
            <h3 className="h5 mb-3">Progress Bar</h3>
            <Progress progress={progress} color="blue" className="mb-3" />
            <div className="d-flex gap-2">
              <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                +10%
              </Button>
              <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                -10%
              </Button>
            </div>
          </Card>
        </Col>

        {/* Spinner */}
        <Col md={6}>
          <Card>
            <h3 className="h5 mb-3">Spinner</h3>
            <div className="d-flex gap-3">
              <Spinner aria-label="Loading" size="xl" />
              <Spinner aria-label="Loading" size="xl" color="success" />
            </div>
          </Card>
        </Col>

        {/* Accordion */}
        <Col md={6}>
          <Card>
            <h3 className="h5 mb-3">Accordion</h3>
            <Accordion>
              <Accordion.Panel>
                <Accordion.Title>What is Flowbite?</Accordion.Title>
                <Accordion.Content>
                  <p>Flowbite is an open-source library of interactive components built on top of Tailwind CSS.</p>
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
                <Accordion.Title>Is there a Figma file?</Accordion.Title>
                <Accordion.Content>
                  <p>Yes, Flowbite includes a Figma design system file.</p>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>
          </Card>
        </Col>

        {/* Tabs */}
        <Col md={6}>
          <Card>
            <h3 className="h5 mb-3">Tabs</h3>
            <Tabs>
              <Tabs.Item active title="Overview">
                Overview content
              </Tabs.Item>
              <Tabs.Item title="Details">
                Details content
              </Tabs.Item>
            </Tabs>
          </Card>
        </Col>

        {/* Badge & Avatar */}
        <Col md={6}>
          <Card>
            <h3 className="h5 mb-3">Badge & Avatar</h3>
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <Badge color="info">20+ Years</Badge>
              <Badge color="success">Featured</Badge>
              <Avatar img="https://picsum.photos/100/100" alt="Team Member" rounded>
                <div className="space-y-1 font-medium">
                  <div>Dr. Sarah Bennett</div>
                  <div className="text-sm text-gray-500">Instructor</div>
                </div>
              </Avatar>
            </div>
          </Card>
        </Col>

        {/* Alert */}
        <Col md={6}>
          <Card>
            <h3 className="h5 mb-3">Alert</h3>
            <Alert color="info" className="mb-2">
              This is an info alert
            </Alert>
            <Alert color="success" className="mb-2">
              This is a success alert
            </Alert>
            <Alert color="warning">
              This is a warning alert
            </Alert>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

