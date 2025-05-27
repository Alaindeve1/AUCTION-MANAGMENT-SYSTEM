import React, { useState, useEffect } from 'react';
import api from '../utils/api';
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
          api.get('/items'),
          api.get('/categories')
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
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    setForm({
      title: '',
      categoryId: '',
      price: '',
      itemStatus: 'DRAFT',
      description: '',
      imageUrl: '',
      startDate: now.toISOString().slice(0, 16),
      endDate: oneWeekLater.toISOString().slice(0, 16)
    });
    setShowModal(true);
    setFormError(null);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    const startDate = item.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
    const endDate = item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    
    setForm({
      title: item.title || '',
      categoryId: item.category?.categoryId || item.categoryId || '',
      price: item.price || item.startingPrice || '',
      itemStatus: item.itemStatus || 'DRAFT',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      startDate,
      endDate
    });
    setShowModal(true);
    setFormError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
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
      
      const res = await api.post('/items/upload-image', formData, {
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
        startDate: form.startDate ? new Date(form.startDate).toISOString().slice(0, 19) : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString().slice(0, 19) : null
      };

      console.log('Saving item with payload:', payload);

      if (editItem) {
        // Edit
        await api.put(`/items/${editItem.itemId}`, payload);
      } else {
        // Create
        await api.post('/items', payload);
      }
      // Refresh items
      const res = await api.get('/items');
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
            <div key={item.itemId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                {item.imageUrl ? (
                  <img
                    src={`http://localhost:8080${item.imageUrl}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.itemStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    item.itemStatus === 'ENDED' ? 'bg-red-100 text-red-800' :
                    item.itemStatus === 'SOLD' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.itemStatus}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 font-semibold">${item.startingPrice}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.itemId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
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