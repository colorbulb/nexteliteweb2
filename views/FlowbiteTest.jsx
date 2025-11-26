// Flowbite React Test Page
import React, { useState } from 'react';
import { Modal, Button, Card, Accordion, Tabs, Badge, Avatar, Toast, Spinner, Progress } from 'flowbite-react';

export const FlowbiteTest = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(45);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-primary hover:underline mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Flowbite React Test Page</h1>
          <p className="text-slate-600">Testing Flowbite React components integration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Modal Test */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Modal Component</h2>
            <Button onClick={() => setShowModal(true)}>Open Modal</Button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
              <Modal.Header>Test Modal</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    This is a Flowbite React modal component. It includes proper accessibility features,
                    backdrop handling, and smooth animations.
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setShowModal(false)}>I accept</Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Decline
                </Button>
              </Modal.Footer>
            </Modal>
          </Card>

          {/* Toast Test */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Toast Component</h2>
            <Button onClick={() => setShowToast(true)}>Show Toast</Button>
            {showToast && (
              <Toast className="mt-4">
                <div className="ml-3 text-sm font-normal">Toast notification example</div>
                <Toast.Toggle onDismiss={() => setShowToast(false)} />
              </Toast>
            )}
          </Card>

          {/* Progress Bar */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Progress Bar</h2>
            <Progress progress={progress} color="blue" className="mb-4" />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                +10%
              </Button>
              <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                -10%
              </Button>
            </div>
          </Card>

          {/* Spinner */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Spinner</h2>
            <div className="flex gap-4">
              <Spinner aria-label="Loading" size="xl" />
              <Spinner aria-label="Loading" size="xl" color="success" />
            </div>
          </Card>
        </div>

        {/* Accordion Test */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Accordion Component</h2>
          <Accordion>
            <Accordion.Panel>
                <Accordion.Title>What is Flowbite?</Accordion.Title>
              <Accordion.Content>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Flowbite is an open-source library of interactive components built on top of Tailwind CSS.
                </p>
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Is there a Figma file available?</Accordion.Title>
              <Accordion.Content>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Yes, Flowbite includes a Figma design system file.
                </p>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </Card>

        {/* Tabs Test */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tabs Component</h2>
          <Tabs>
            <Tabs.Item active title="Overview">
              Overview content goes here
            </Tabs.Item>
            <Tabs.Item title="Syllabus">
              Syllabus content goes here
            </Tabs.Item>
            <Tabs.Item title="Instructor">
              Instructor information goes here
            </Tabs.Item>
          </Tabs>
        </Card>

        {/* Badge and Avatar Test */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Badge & Avatar Components</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge color="info">20+ Years</Badge>
            <Badge color="success">National Champion</Badge>
            <Badge color="warning">Featured</Badge>
            <Avatar img="https://picsum.photos/100/100" alt="Team Member" rounded>
              <div className="space-y-1 font-medium">
                <div>Dr. Sarah Bennett</div>
                <div className="text-sm text-gray-500">Instructor</div>
              </div>
            </Avatar>
          </div>
        </Card>
      </div>
    </div>
  );
};

