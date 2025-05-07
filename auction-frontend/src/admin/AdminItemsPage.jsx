import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from './AdminAuthContext';

const statusOptions = ['DRAFT', 'ACTIVE', 'ENDED', 'SOLD'];

const AdminItemsPage = () => {
  const { admin } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    price: '',
    status: 'DRAFT',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch items and categories from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [itemsRes, categoriesRes] = await Promise.all([
          axios.get('/api/items', { headers: { Authorization: `Bearer ${admin?.token}` } }),
          axios.get('/api/categories', { headers: { Authorization: `Bearer ${admin?.token}` } })
        ]);
        setItems(itemsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Failed to load items or categories.');
      }
      setLoading(false);
    };
    if (admin?.token) fetchData();
  }, [admin]);

  const handleAdd = () => {
    setEditItem(null);
    setForm({
      title: '',
      categoryId: '',
      price: '',
      status: 'DRAFT',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowModal(true);
    setFormError(null);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || '',
      categoryId: item.category?.categoryId || item.categoryId || '',
      price: item.price || item.startingPrice || '',
      status: item.status || item.itemStatus || 'DRAFT',
      description: item.description || '',
      startDate: item.startDate || new Date().toISOString().split('T')[0],
      endDate: item.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowModal(true);
    setFormError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${id}`, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
        setItems(items.filter(item => item.itemId !== id));
      } catch {
        alert('Failed to delete item.');
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
      const payload = {
        title: form.title,
        description: form.description,
        categoryId: parseInt(form.categoryId),
        startingPrice: parseFloat(form.price),
        status: form.status,
        sellerId: admin?.userId,
        startDate: form.startDate,
        endDate: form.endDate
      };

      if (editItem) {
        // Edit
        await axios.put(`/api/items/${editItem.itemId}`, payload, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
      } else {
        // Create
        await axios.post('/api/items', payload, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
      }
      // Refresh items
      const res = await axios.get('/api/items', { headers: { Authorization: `Bearer ${admin?.token}` } });
      setItems(res.data);
      setShowModal(false);
    } catch (err) {
      console.error('Error saving item:', err);
      setFormError(err.response?.data?.message || 'Failed to save item. Please try again.');
    }
    setFormLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Manage Items</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold"
        >
          Add Item
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-lg text-gray-500">Loading items...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-indigo-50 text-indigo-700">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.itemId} className="border-b">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.category?.categoryName || '-'}</td>
                  <td className="px-4 py-2">{item.status || item.itemStatus}</td>
                  <td className="px-4 py-2">${item.price || item.startingPrice}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(item.itemId)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for Add/Edit Item */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md my-8">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">{editItem ? 'Edit Item' : 'Add Item'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              {formError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {formError}
                </div>
              )}
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItemsPage; 