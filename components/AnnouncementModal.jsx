import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getRandomAnnouncement } from '../firebase/db.js';

export const AnnouncementModal = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const randomAnnouncement = await getRandomAnnouncement();
        if (randomAnnouncement) {
          setAnnouncement(randomAnnouncement);
          // Check if user has dismissed this announcement
          const dismissedId = localStorage.getItem('dismissedAnnouncementId');
          if (dismissedId !== randomAnnouncement.id) {
            setShow(true);
          }
        }
      } catch (error) {
        console.error('Error loading announcement:', error);
      }
    };

    loadAnnouncement();
  }, []);

  const handleClose = () => {
    setShow(false);
    if (announcement) {
      // Remember that user dismissed this specific announcement
      localStorage.setItem('dismissedAnnouncementId', announcement.id);
    }
  };

  if (!show || !announcement) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full relative animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          {announcement.image && (
            <div className="mb-4">
              <img
                src={announcement.image}
                alt={announcement.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <h2 className="text-2xl font-bold text-slate-900 mb-4">{announcement.title}</h2>

          <div
            className="text-slate-700 mb-6 prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />

          {announcement.buttonUrl && announcement.buttonText && (
            <div className="flex justify-end">
              <a
                href={announcement.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition inline-block"
              >
                {announcement.buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

