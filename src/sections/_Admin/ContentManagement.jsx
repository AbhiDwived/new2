"use client"

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
} from '@/features/blogs/adminblogsAPI';
import { Calendar, Eye, Pencil, Trash, X } from 'lucide-react';
// import EditBlogPost from './EditBlogPost';



export default function ContentManagement() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetAllBlogsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const [deletingId, setDeletingId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [localBlogs, setLocalBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(localBlogs.length / pageSize);
  const paginatedBlogs = localBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function getPaginationPages(current, total) {
    if (total <= 1) return [1];
    if (current === 1) return [1, '...', total];
    if (current === total) return [1, '...', total];
    if (current !== 1 && current !== total) return [1, '...', current, '...', total];
  }
  const paginationPages = getPaginationPages(currentPage, totalPages);

  // Format blogs and build correct image URLs
  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  // Function to strip HTML tags and get plain text
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Update localBlogs when data changes
  React.useEffect(() => {
    if (blogs.length > 0) {
      const formattedBlogs = blogs.map((blog) => {
        let imageUrl;
        if (blog.featuredImage) {
          if (blog.featuredImage.startsWith('http')) {
            imageUrl = blog.featuredImage;
          } else {
            const baseUrl = (process.env.NEXT_PUBLIC_API_BACKEND || 'https://api.mybestvenue.com/api/v1').replace('/api/v1', '');
            imageUrl = `${baseUrl}${blog.featuredImage}`;
          }
        } else {
          imageUrl = 'https://via.placeholder.com/400x200?text=No+Image';
        }

        return {
          id: blog._id,
          title: blog.title,
          excerpt: blog.excerpt || '',
          description: blog.excerpt || (blog.content ? stripHtml(blog.content).slice(0, 150) + '...' : ''),
          category: blog.category || 'General',
          date: new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          image: imageUrl,
          fullContent: blog.content,
          author: blog.createdBy?.name || 'Admin',
          status: blog.status || 'published',
        };
      });
      setLocalBlogs(formattedBlogs);
    }
  }, [blogs]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    setDeletingId(id);
    try {
      await deleteBlog(id).unwrap();
      setLocalBlogs(prev => prev.filter(blog => blog.id !== id));
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Failed to delete blog: ' + (err?.data?.message || err.error || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setEditMode(true);
  };

  const handleCloseEdit = () => {
    setEditMode(false);
    setSelectedBlog(null);
  };

  const handleUpdateBlog = (updatedBlog) => {
    setLocalBlogs(prev => 
      prev.map(blog => 
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    );
    handleCloseEdit();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading blogs</p>
          <p className="text-gray-600">{error?.data?.message || error?.error || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <Link
          to="/admin/add-blog"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Blog
        </Link>
      </div>

      {editMode && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Blog Post</h2>
              <button
                onClick={handleCloseEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            {/* <EditBlogPost
              blog={selectedBlog}
              onClose={handleCloseEdit}
              onUpdate={handleUpdateBlog}
            /> */}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blog Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={blog.image}
                          alt={blog.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {blog.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {blog.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {blog.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={deletingId === blog.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === blog.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, localBlogs.length)}
                  </span>{' '}
                  of <span className="font-medium">{localBlogs.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {paginationPages?.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      disabled={page === '...'}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : page === '...'
                          ? 'bg-white border-gray-300 text-gray-500 cursor-default'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}