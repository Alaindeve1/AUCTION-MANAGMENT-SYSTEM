import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from './AdminAuthContext';

const statusOptions = ['DRAFT', 'ACTIVE', 'ENDED', 'SOLD'];

const AdminItemsPage = () => {
  const { admin } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    price: '',
    itemStatus: 'DRAFT',
    description: '',
    imageUrl: '',
    startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
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
      itemStatus: 'DRAFT',
      description: '',
      imageUrl: '',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
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
      itemStatus: item.itemStatus || 'DRAFT',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      startDate: item.startDate ? item.startDate.slice(0, 16) : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      endDate: item.endDate ? item.endDate.slice(0, 16) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size should be less than 5MB');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await axios.post('/api/items/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${admin?.token}`
        }
      });
      
      setForm({ ...form, imageUrl: res.data });
    } catch (err) {
      console.error('Upload error:', err);
      setFormError(err.response?.data || 'Failed to upload image');
    } finally {
      setFormLoading(false);
    }
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
        itemStatus: form.itemStatus,
        imageUrl: form.imageUrl,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined
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

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Manage Items</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold animate__animated animate__fadeInRight"
        >
          Add Item
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-lg text-gray-500">Loading items...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <>
        {/* Cards layout with animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 animate__animated animate__fadeInUp">
          {paginatedItems.map(item => (
            <div key={item.itemId} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 animate__animated animate__zoomIn">
              <div>
                <div className="relative h-40 mb-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold shadow ${
                    item.itemStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    item.itemStatus === 'SOLD' ? 'bg-blue-100 text-blue-700' :
                    item.itemStatus === 'ENDED' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  } animate__animated animate__fadeIn`}>{item.itemStatus}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-indigo-700 truncate">{item.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-semibold">{item.category?.categoryName || 'N/A'}</span>
                </div>
                <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="font-bold text-xl text-indigo-600 mb-2">${item.startingPrice}</div>
                <div className="text-xs text-gray-400 mb-1">Start: {item.startDate ? new Date(item.startDate).toLocaleString() : '-'}</div>
                <div className="text-xs text-gray-400">End: {item.endDate ? new Date(item.endDate).toLocaleString() : '-'}</div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition animate__animated animate__fadeInLeft"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.itemId)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition animate__animated animate__fadeInRight"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-8 animate__animated animate__fadeInUp animate__delay-1s">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-indigo-100 disabled:opacity-60"
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-indigo-100 disabled:opacity-60"
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
        </>
      )}
      {/* Modal for Add/Edit Item */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md my-8">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">{editItem ? 'Edit Item' : 'Add Item'}</h2>
            <form onSubmit={handleSave} className="space-y-4 animate__animated animate__fadeInDown">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                  disabled={formLoading}
                />
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://..."
                />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Preview" className="mt-2 max-h-32 rounded shadow" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
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
                    type="datetime-local"
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
                  name="itemStatus"
                  value={form.itemStatus}
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