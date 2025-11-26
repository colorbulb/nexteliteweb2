import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const AnnouncementModal = ({ announcements = [] }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log('AnnouncementModal: Received announcements:', announcements);
    
    // Filter out disabled announcements
    const activeAnnouncements = announcements.filter(ann => !ann.disabled);
    console.log('AnnouncementModal: Active announcements:', activeAnnouncements);
    
    if (activeAnnouncements.length === 0) {
      console.log('AnnouncementModal: No active announcements');
      setAnnouncement(null);
      setShow(false);
      return;
    }

    // Get random announcement from active ones
    const randomIndex = Math.floor(Math.random() * activeAnnouncements.length);
    const randomAnnouncement = activeAnnouncements[randomIndex];
    console.log('AnnouncementModal: Selected random announcement:', randomAnnouncement);
    
    if (randomAnnouncement) {
      setAnnouncement(randomAnnouncement);
      // Check if user has dismissed this announcement
      const dismissedId = localStorage.getItem('dismissedAnnouncementId');
      console.log('AnnouncementModal: Dismissed ID:', dismissedId, 'Current ID:', randomAnnouncement.id);
      if (dismissedId !== randomAnnouncement.id) {
        console.log('AnnouncementModal: Showing announcement');
        setShow(true);
      } else {
        console.log('AnnouncementModal: Announcement was dismissed, not showing');
        setShow(false);
      }
    }
  }, [announcements]);

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
          {(announcement.image || announcement.imageUrl) && (
            <div className="mb-4">
              <img
                src={announcement.image || announcement.imageUrl}
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

