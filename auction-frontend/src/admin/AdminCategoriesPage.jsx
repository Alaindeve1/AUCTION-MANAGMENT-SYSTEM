import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from './AdminAuthContext';
import { PlusIcon, PencilIcon, TrashIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const AdminCategoriesPage = () => {
  const { admin } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ categoryName: '', description: '', parentCategoryId: null });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/categories', { 
          headers: { Authorization: `Bearer ${admin?.token}` } 
        });
        setCategories(res.data);
      } catch (err) {
        setError('Failed to load categories.');
      }
      setLoading(false);
    };
    if (admin?.token) fetchCategories();
  }, [admin]);

  const handleAdd = (parentId = null) => {
    setEditCategory(null);
    setForm({ categoryName: '', description: '', parentCategoryId: parentId });
    setShowModal(true);
    setFormError(null);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setForm({ 
      categoryName: category.categoryName, 
      description: category.description || '',
      parentCategoryId: category.parentCategory?.categoryId || null 
    });
    setShowModal(true);
    setFormError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
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
        await axios.put(`/api/categories/${editCategory.categoryId}`, form, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
      } else {
        await axios.post('/api/categories', form, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
      }
      const res = await axios.get('/api/categories', { 
        headers: { Authorization: `Bearer ${admin?.token}` } 
      });
      setCategories(res.data);
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save category.');
    }
    setFormLoading(false);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const renderCategoryTree = (category, level = 0) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories.has(category.categoryId);

    return (
      <div key={category.categoryId} className="ml-4">
        <div className="flex items-center py-2 hover:bg-gray-50 rounded-lg px-2">
          <div className="flex items-center flex-1">
            {hasSubcategories && (
              <button
                onClick={() => toggleCategory(category.categoryId)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            <span className="ml-2 text-gray-700">{category.categoryName}</span>
            {category.description && (
              <span className="ml-2 text-sm text-gray-500">({category.description})</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleAdd(category.categoryId)}
              className="p-1 text-green-600 hover:bg-green-50 rounded-full"
              title="Add subcategory"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEdit(category)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
              title="Edit category"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(category.categoryId)}
              className="p-1 text-red-600 hover:bg-red-50 rounded-full"
              title="Delete category"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        {hasSubcategories && isExpanded && (
          <div className="ml-4">
            {category.subcategories.map(subcat => renderCategoryTree(subcat, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        <button
          onClick={() => handleAdd()}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Root Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-white">
              No categories found. Add your first category to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map(category => renderCategoryTree(category))}
            </div>
          )}
        </div>
      )}

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="categoryName"
                  value={form.categoryName}
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
                />
              </div>
              {formError && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{formError}</div>
              )}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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

export default AdminCategoriesPage; 