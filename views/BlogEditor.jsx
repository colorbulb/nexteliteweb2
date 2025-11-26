import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextEditor } from '../components/TextEditor.jsx';
import { ImageUpload } from '../components/ImageUpload.jsx';
import { getNextBlogPostId } from '../firebase/db.js';
import { getCategories } from '../firebase/lists.js';
import { getTeam } from '../firebase/db.js';

export const BlogEditor = ({ post, onSave, onClose, team = [] }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date(),
    images: [],
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        
        if (post) {
          setFormData({
            id: post.id || '',
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            author: post.author || '',
            date: post.date ? new Date(post.date) : new Date(),
            images: post.images || (post.image ? [post.image] : []),
            category: post.category || ''
          });
        } else {
          // New post - auto-generate ID
          const nextId = await getNextBlogPostId();
          setFormData(prev => ({
            ...prev,
            id: nextId
          }));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [post]);

  // Auto-generate excerpt from content
  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
    
    // Auto-generate excerpt from first 100 characters
    if (!post || !post.excerpt) {
      const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML
      const excerpt = textContent.substring(0, 100).trim();
      if (excerpt) {
        setFormData(prev => ({ ...prev, excerpt: excerpt + (textContent.length > 100 ? '...' : '') }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const postData = {
        ...formData,
        date: formData.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        image: formData.images[0] || '', // First image as main image
        images: formData.images // Keep all images
      };
      await onSave(postData);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {post ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Post ID - Auto-generated, read-only */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Post ID (Auto-generated)</label>
            <input
              type="text"
              value={formData.id}
              readOnly
              disabled
              className="w-full p-2 border border-slate-300 rounded bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Author *</label>
              <select
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
              >
                <option value="">Select Author</option>
                {team.map(member => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Excerpt * (Auto-generated from content)</label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary h-24"
              placeholder="Auto-generated from content (first 100 characters)"
            />
            <p className="text-xs text-slate-500 mt-1">
              This is auto-generated from your content, but you can edit it manually.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Content *</label>
            <TextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Enter blog post content..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Date *</label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date: date || new Date() })}
              dateFormat="MMMM d, yyyy"
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Images (Multiple, Drag & Drop)</label>
            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              multiple={true}
            />
            <p className="text-xs text-slate-500 mt-1">
              First image will be used as the main featured image.
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> {loading ? 'Saving...' : 'Save Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 rounded font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
