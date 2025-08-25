"use client"

import React, { useState, useEffect } from "react";
import { useUpdateBlogMutation } from "@/features/blogs/adminblogsAPI";
import { Image as ImageIcon, Loader, X } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';

export default function EditBlogPost({ blog, onClose, onSuccess }) {
  const router = useRouter();
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const [title, setTitle] = useState(blog.title);
  const [excerpt, setExcerpt] = useState(blog.excerpt);
  const [content, setContent] = useState(blog.fullContent);
  const [category, setCategory] = useState(blog.category);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(blog.image);

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
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      alert('Please fill in all required fields');
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

      await updateBlog({ id: blog.id, updatedData: formData }).unwrap();
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Failed to update blog:', err);
      alert('Failed to update blog: ' + (err?.data?.message || 'Unknown error'));
    }
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
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>

          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  Excerpt *
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              {/* Content Input with CKEditor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <div className="border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <Editor
                    value={content}
                    onEditorChange={setContent}
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
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                            setPreviewImage(blog.image); // Reset to original image
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
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
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