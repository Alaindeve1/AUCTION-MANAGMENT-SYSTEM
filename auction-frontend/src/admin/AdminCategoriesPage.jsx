import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from './AdminAuthContext';

const AdminCategoriesPage = () => {
  const { admin } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/categories', { headers: { Authorization: `Bearer ${admin?.token}` } });
        setCategories(res.data);
      } catch (err) {
        setError('Failed to load categories.');
      }
      setLoading(false);
    };
    if (admin?.token) fetchCategories();
  }, [admin]);

  const handleAdd = () => {
    setEditCategory(null);
    setForm({ name: '' });
    setShowModal(true);
    setFormError(null);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setForm({ name: category.name });
    setShowModal(true);
    setFormError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
        setCategories(categories.filter(cat => cat.categoryId !== id));
      } catch {
        alert('Failed to delete category.');
      }
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      if (editCategory) {
        // Edit
        await axios.put(`/api/categories/${editCategory.categoryId}`, {
          name: form.name,
        }, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
      } else {
        // Create
        await axios.post('/api/categories', {
          name: form.name,
        }, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
      }
      // Refresh categories
      const res = await axios.get('/api/categories', { headers: { Authorization: `Bearer ${admin?.token}` } });
      setCategories(res.data);
      setShowModal(false);
    } catch (err) {
      setFormError('Failed to save category.');
    }
    setFormLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Manage Categories</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold"
        >
          Add Category
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-lg text-gray-500">Loading categories...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-indigo-50 text-indigo-700">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.categoryId} className="border-b">
                  <td className="px-4 py-2">{category.name}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">{editCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              {formError && <div className="text-red-600 text-sm">{formError}</div>}
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={formLoading}
                >Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={formLoading}
                >{formLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage; 