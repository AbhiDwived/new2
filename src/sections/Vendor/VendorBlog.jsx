"use client"

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from '@/features/blogs/adminblogsAPI';
import { Calendar, Eye, Pencil, Trash } from 'lucide-react';
import { env } from '@/constants';

export default function VendorBlog() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetAllBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [deletingId, setDeletingId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Editable Fields
  const [editedTitle, setEditedTitle] = useState('');
  const [editedExcerpt, setEditedExcerpt] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const blogCategories = [
    'General',
    'Wedding Tips',
    'Technology',
    'Travel',
    'Lifestyle',
    'Health',
  ];

  // Format blogs and build correct image URLs
  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  const formattedBlogs = useMemo(() => {
    return blogs.map((blog) => {
      let imageUrl;

      if (blog.featuredImage) {
        if (blog.featuredImage.startsWith('http')) {
          imageUrl = blog.featuredImage;
        } else {
          // ✅ Backend already provides correct path like "/uploads/vendors/filename.jpg"
          const baseUrl = (process.env.NEXT_PUBLIC_API_BACKEND || 'https://api.mybestvenue.com/api/v1').replace('/api/v1', '');
          imageUrl = `${baseUrl}${blog.featuredImage}`; // Just concatenate base + path
        }
      } else {
        imageUrl = 'https://via.placeholder.com/400x200?text=No+Image';
      }

      return {
        id: blog._id,
        title: blog.title,
        excerpt: blog.excerpt || '',
        description: blog.excerpt || (blog.content ? blog.content.slice(0, 150) + '...' : ''),
        category: blog.category || 'General',
        date: new Date(blog.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        image: imageUrl,
        fullContent: blog.content,
      };
    });
  }, [blogs]);

  if (isLoading)
    return <p className="text-center mt-10">Loading blogs...</p>;
  if (isError) {
    const errorMessage =
      error?.data?.message || error?.error || 'Something went wrong';
    return (
      <p className="text-center mt-10 text-red-600">Error: {errorMessage}</p>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    setDeletingId(id);
    try {
      await deleteBlog(id).unwrap();
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Failed to delete blog: ' + (err?.data?.message || err.error || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setEditedTitle(blog.title);
    setEditedExcerpt(blog.excerpt);
    setEditedContent(blog.fullContent);
    setEditedCategory(blog.category);
    setPreviewImage(blog.image);
    setEditMode(true);
  };

  const handleUpdateBlog = async () => {
    if (!selectedBlog) return;

    try {
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('excerpt', editedExcerpt);
      formData.append('content', editedContent);
      formData.append('category', editedCategory);
      
      if (editedImage) {
        formData.append('featuredImage', editedImage);
      }

      await updateBlog({
        id: selectedBlog.id,
        updatedData: formData
      }).unwrap();

      setEditMode(false);
      setSelectedBlog(null);
      setEditedTitle('');
      setEditedExcerpt('');
      setEditedContent('');
      setEditedCategory('');
      setEditedImage(null);
      setPreviewImage('');
    } catch (err) {
      console.error('Failed to update blog:', err);
      alert('Failed to update blog: ' + (err?.data?.message || err.error || 'Unknown error'));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <button
          onClick={() => router.push('/vendor/add-blog')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Blog
        </button>
      </div>

      {/* Edit Modal */}
      {editMode && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Blog Post</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blogCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={editedExcerpt}
                onChange={(e) => setEditedExcerpt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-md"
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditMode(false);
                  setSelectedBlog(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBlog}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {formattedBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {blog.date}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/blog/${blog.title.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleEditBlog(blog)}
                  className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors flex items-center justify-center"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  disabled={deletingId === blog.id}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {deletingId === blog.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <>
                      <Trash className="w-4 h-4 mr-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formattedBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blogs found.</p>
        </div>
      )}
    </div>
  );
}