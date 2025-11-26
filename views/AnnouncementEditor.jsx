import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload.jsx';

export const AnnouncementEditor = ({ announcements, onSave, onDelete, onClose }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    content: '',
    buttonText: '',
    buttonUrl: ''
  });

  const MAX_ANNOUNCEMENTS = 5;

  useEffect(() => {
    if (editingIndex !== null && announcements[editingIndex]) {
      const announcement = announcements[editingIndex];
      setFormData({
        title: announcement.title || '',
        image: announcement.image || '',
        content: announcement.content || '',
        buttonText: announcement.buttonText || '',
        buttonUrl: announcement.buttonUrl || ''
      });
    } else {
      setFormData({
        title: '',
        image: '',
        content: '',
        buttonText: '',
        buttonUrl: ''
      });
    }
  }, [editingIndex, announcements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (announcements.length >= MAX_ANNOUNCEMENTS && editingIndex === null) {
      alert(`Maximum ${MAX_ANNOUNCEMENTS} announcements allowed. Please delete one first.`);
      return;
    }

    const announcementData = {
      ...formData,
      id: editingIndex !== null ? announcements[editingIndex].id : undefined
    };

    try {
      await onSave(announcementData);
      setEditingIndex(null);
      setFormData({
        title: '',
        image: '',
        content: '',
        buttonText: '',
        buttonUrl: ''
      });
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Error saving announcement: ' + error.message);
    }
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await onDelete(announcementId);
      if (editingIndex !== null) {
        setEditingIndex(null);
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error deleting announcement: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Announcement Modals</h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage up to {MAX_ANNOUNCEMENTS} announcements. One will be shown randomly on the homepage.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Existing Announcements List */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">Existing Announcements ({announcements.length}/{MAX_ANNOUNCEMENTS})</h3>
            {announcements.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No announcements yet</p>
            ) : (
              <div className="space-y-2">
                {announcements.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className={`p-4 border rounded-lg flex items-center justify-between ${
                      editingIndex === index ? 'border-primary bg-primary/5' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-bold">{announcement.title || 'Untitled'}</h4>
                      <p className="text-sm text-slate-500 truncate">{announcement.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="text-blue-500 hover:text-blue-700 px-3 py-1 text-sm font-bold"
                      >
                        {editingIndex === index ? 'Editing...' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="text-red-500 hover:text-red-700 px-3 py-1 text-sm font-bold"
                      >
                        <Trash2 size={16} className="inline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold mb-4">
              {editingIndex !== null ? 'Edit Announcement' : 'Add New Announcement'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                  placeholder="Announcement Title"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Image *</label>
                <ImageUpload
                  images={formData.image ? [formData.image] : []}
                  onChange={(images) => setFormData({ ...formData, image: images[0] || '' })}
                  multiple={false}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary h-32"
                  placeholder="Announcement content text..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                    placeholder="Learn More"
                  />
                  <p className="text-xs text-slate-500 mt-1">Button only shows if URL is provided</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Button URL</label>
                  <input
                    type="url"
                    value={formData.buttonUrl}
                    onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Save size={18} /> {editingIndex !== null ? 'Update' : 'Add'} Announcement
                </button>
                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(null);
                      setFormData({
                        title: '',
                        image: '',
                        content: '',
                        buttonText: '',
                        buttonUrl: ''
                      });
                    }}
                    className="px-6 py-3 border border-slate-300 rounded font-bold hover:bg-slate-50 transition"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

