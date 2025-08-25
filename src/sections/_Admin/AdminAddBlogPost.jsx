"use client"

import React, { useState } from "react";
import { useCreateBlogMutation } from "@/features/blogs/adminblogsAPI";
import { Calendar, Image as ImageIcon, Loader, X } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from "next/navigation";

export default function AdminAddBlogPost() {
  const router = useRouter();
  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [errors, setErrors] = useState({});

  const blogCategories = [
    'General',
    'Wedding Tips',
    'Technology',
    'Travel',
    'Lifestyle',
    'Health',
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 10MB' }));
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Only JPEG and PNG images are allowed' }));
        return;
      }
      
      setErrors(prev => ({ ...prev, image: '' }));
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    
    // Excerpt validation
    if (!excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (excerpt.length < 50) {
      newErrors.excerpt = 'Excerpt must be at least 50 characters';
    } else if (excerpt.length > 250) {
      newErrors.excerpt = 'Excerpt must be 250 characters or less';
    }
    
    // Content validation (text-only, minimum 100 characters)
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (!textContent) {
      newErrors.content = 'Content is required';
    } else if (textContent.length < 100) {
      newErrors.content = 'Content must be at least 100 characters (text only)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      await createBlog(formData).unwrap();
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Failed to create blog:', err);
      alert('Failed to create blog: ' + (err?.data?.message || 'Unknown error'));
    }
  };

  const handleClose = () => {
    router.push(-1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Blur Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Popup Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>

          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title * (max 100 characters)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title (max 100 characters)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  maxLength={100}
                  required
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blogCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Excerpt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt * (50-250 characters)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Enter blog excerpt (50-250 characters)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.excerpt ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  rows="3"
                  maxLength={250}
                  required
                />
                {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
              </div>

              {/* Content Input with CKEditor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content * (min 100 characters text-only)
                </label>
                
                <div className={`border rounded-md ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <Editor
                    value={content}
                    onEditorChange={(newContent) => {
                      setContent(newContent);
                      if (errors.content) {
                        setErrors(prev => ({ ...prev, content: '' }));
                      }
                    }}
                    init={{
                      height: 400,
                      menubar: 'file edit view insert format tools table help',
                      base_url: '/tinymce',
                      suffix: '.min',
                      license_key: 'gpl',
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | ' +
                        'alignleft aligncenter alignright alignjustify | ' +
                        'bullist numlist outdent indent | ' +
                        'removeformat | link image media table | toc | ' +
                        'code fullscreen preview help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      placeholder: 'Write your blog content here...',
                      setup: (editor) => {
                        editor.ui.registry.addButton('toc', {
                          text: 'TOC',
                          tooltip: 'Insert Table of Contents',
                          onAction: () => {
                            const content = editor.getContent();
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(content, 'text/html');
                            const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
                            
                            if (headings.length === 0) {
                              alert('No headings found. Please add some headings (H1-H6) first.');
                              return;
                            }
                            
                            let tocHTML = '<div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 16px; margin: 16px 0;"><h3 style="margin: 0 0 12px 0; color: #495057;">📋 Table of Contents</h3><ul style="margin: 0; padding-left: 20px;">';
                            
                            headings.forEach((heading, index) => {
                              const level = parseInt(heading.tagName.charAt(1));
                              const text = heading.textContent.trim();
                              const id = `heading-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index}`;
                              
                              heading.id = id;
                              
                              const indent = (level - 1) * 16;
                              tocHTML += `<li style="margin: 4px 0; padding-left: ${indent}px;"><a href="#${id}" style="color: #007bff; text-decoration: none;">${text}</a></li>`;
                            });
                            
                            tocHTML += '</ul></div>';
                            
                            const updatedContent = doc.body.innerHTML;
                            editor.setContent(tocHTML + updatedContent);
                          }
                        });
                      }
                    }}
                  />
                </div>
                
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image (JPEG/PNG, max 10MB)
                </label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  errors.image ? 'border-red-300' : 'border-gray-300'
                }`}>
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto h-48 w-auto object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setPreviewImage("");
                          }}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/jpeg,image/png"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          JPEG, PNG up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  style={{ backgroundColor: '#0f4c81' }}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Publishing...
                    </>
                  ) : (
                    'Publish'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
