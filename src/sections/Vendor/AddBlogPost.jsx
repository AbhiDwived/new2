"use client"

import React, { useState } from "react";
import { useCreateBlogMutation } from "@/features/blogs/blogsAPI";

export default function AddBlogPost() {
  const router = useRouter();
  const [createBlog] = useCreateBlogMutation();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !excerpt || !content || !category || !imageFile) {
    setErrorMsg("Please fill in all required fields.");
    return;
  }

  setLoading(true);
  setErrorMsg("");
  setSuccessMsg("");

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("category", category);
    // ✅ Changed key from "featuredImage" to "image"
    formData.append("image", imageFile); 

    await createBlog(formData).unwrap();

    setSuccessMsg("Blog post created successfully!");
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("");
    setImageFile(null);

    // router.push('/vendor/dashboard/blogs'); // Optional redirect
  } catch (error) {
    setErrorMsg(error?.data?.message || "Failed to create blog post.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Blog Post</h2>

      {errorMsg && (
        <p className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errorMsg}</p>
      )}
      {successMsg && (
        <p className="bg-green-100 text-green-700 p-2 mb-4 rounded">{successMsg}</p>
      )}

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="title">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            required
            disabled={loading}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="excerpt">
            Excerpt (max 300 chars) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            className="w-full p-2 border rounded"
            rows="3"
            maxLength={300}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            required
            disabled={loading}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="content">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            className="w-full p-2 border rounded"
            rows="6"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            required
            disabled={loading}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="category">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            type="text"
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            required
            disabled={loading}
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="image">
            Image Upload <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={handleImageChange}
            disabled={loading}
            required
          />
          {imageFile && (
            <p className="mt-2 text-sm text-gray-700">
              Selected file: {imageFile.name}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`bg-blue-700 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
