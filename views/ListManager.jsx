// List Management Component for Categories, Instructors, Levels
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { getCategories, saveCategory, deleteCategory, getInstructors, saveInstructor, deleteInstructor, getLevels, saveLevel, deleteLevel } from '../firebase/lists.js';

export const ListManager = ({ listType }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, [listType]);

  const loadItems = async () => {
    try {
      let data = [];
      if (listType === 'categories') {
        data = await getCategories();
      } else if (listType === 'instructors') {
        data = await getInstructors();
      } else if (listType === 'levels') {
        data = await getLevels();
      }
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    
    setLoading(true);
    try {
      const item = { name: newItem.trim() };
      if (listType === 'categories') {
        await saveCategory(item);
      } else if (listType === 'instructors') {
        await saveInstructor(item);
      } else if (listType === 'levels') {
        await saveLevel(item);
      }
      setNewItem('');
      await loadItems();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      if (listType === 'categories') {
        await deleteCategory(itemId);
      } else if (listType === 'instructors') {
        await deleteInstructor(itemId);
      } else if (listType === 'levels') {
        await deleteLevel(itemId);
      }
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const title = listType === 'categories' ? 'Categories' : listType === 'instructors' ? 'Instructors' : 'Levels';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-xl font-bold mb-4">{title} Management</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={`Add new ${title.toLowerCase().slice(0, -1)}`}
          className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
          disabled={loading}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !newItem.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
            <span className="font-medium">{item.name}</span>
            <button
              onClick={() => handleDelete(item.id)}
              disabled={loading}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-500 text-center py-4">No {title.toLowerCase()} yet</p>
        )}
      </div>
    </div>
  );
};

