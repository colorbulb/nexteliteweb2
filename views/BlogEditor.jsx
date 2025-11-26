import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export const BlogEditor = ({ post, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    image: '',
    category: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        id: post.id || '',
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || '',
        date: post.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        image: post.image || '',
        category: post.category || ''
      });
    } else {
      // Set default date for new posts
      setFormData(prev => ({
        ...prev,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      }));
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {post ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Post ID *</label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                placeholder="post-1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                placeholder="Education"
              />
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
            <label className="block text-sm font-bold text-slate-700 mb-1">Excerpt *</label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary h-24"
              placeholder="Short description that appears in blog listing"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Content *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary h-64 font-mono text-sm"
              placeholder="HTML content (you can use HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, etc.)"
            />
            <p className="text-xs text-slate-500 mt-1">
              You can use HTML tags. Example: &lt;p class="mb-4"&gt;Paragraph&lt;/p&gt;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Author *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                placeholder="October 15, 2023"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-3 rounded font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save Post
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

