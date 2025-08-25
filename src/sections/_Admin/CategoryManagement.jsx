"use client"


import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const categoriesData = [
  { name: 'Photographer', count: 452 },
  { name: 'Venue', count: 328 },
  { name: 'Makeup Artist', count: 245 },
  { name: 'Decorator', count: 185 },
  { name: 'Caterer', count: 127 },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(categoriesData);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', count: '' });

  const handleToggleOptions = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.count) return;
    setCategories([...categories, { ...newCategory, count: parseInt(newCategory.count, 10) }]);
    setNewCategory({ name: '', count: '' });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-full mx-auto p-6 border rounded-lg shadow-sm bg-white mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">Category Management</h2>
      <p className="text-sm text-gray-500 mb-6">Manage vendor categories and subcategories</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col gap-2 hover:shadow-sm transition relative"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleToggleOptions(idx)}
            >
              <div>
                <p className="font-semibold text-gray-800">{cat.name}</p>
                <p className="text-sm text-gray-500">{cat.count} vendors</p>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform ${expandedIndex === idx ? 'rotate-180' : ''}`} />
            </div>

            {expandedIndex === idx && (
              <select className="mt-2 text-sm text-gray-600 border p-2 rounded">
                <option value="">Select an option</option>
                <option value="edit">Edit Category</option>
                <option value="delete">Delete Category</option>
                <option value="view-subcategories">View Subcategories</option>
                <option value="manage-vendors">Manage Vendors</option>
              </select>
            )}
          </div>
        ))}

        {/* Add New Category Box */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-800 hover:bg-gray-100 transition flex flex-col justify-between">
          {!showAddForm ? (
            <button onClick={() => setShowAddForm(true)} className="w-full h-full">
              Add New Category
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Category Name"
                className="border p-2 rounded"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Vendor Count"
                className="border p-2 rounded"
                value={newCategory.count}
                onChange={(e) => setNewCategory({ ...newCategory, count: e.target.value })}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleAddCategory} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Add
                </button>
                <button onClick={() => setShowAddForm(false)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;


