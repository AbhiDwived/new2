"use client"

import React, { useEffect, useRef, useState } from 'react';

const ImageUploader = () => {
  const [files, setFiles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const fileInputRef = useRef(null);

  const loadImages = async () => {
    const res = await fetch('http://localhost:3000/images');
    const data = await res.json();
    setGallery(data);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map(file => ({
      file,
      title: 'Banquet hall',
    }));
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleTitleChange = (index, newTitle) => {
    setFiles(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, title: newTitle } : item
      )
    );
  };

  const handleRemoveSelected = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((item, index) => {
      formData.append('photos', item.file);
      formData.append(`titles`, item.title); 
    });

    await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    setFiles([]);
    loadImages();
  };

  const handleDeleteUploaded = async (filename) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${filename}"?`);
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:3000/images/${filename}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setGallery(prev => prev.filter(file => file !== filename));
    } else {
      alert('Failed to delete image');
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add photos</h2>

      <div className="border-2 border-dashed border-gray-300 p-6 rounded mb-6 flex flex-col items-center justify-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={openFilePicker}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Choose Images
        </button>
        <p className="text-sm text-gray-500 mt-2">GIF, JPG or PNG format, Max size 20 MB</p>
      </div>

      {/* Selected Images */}
      {files.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Selected Images:</h3>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
            {files.map((item, index) => (
              <div key={index} className="border p-2 rounded shadow-sm bg-white relative">
                <img
                  src={URL.createObjectURL(item.file)}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                />
                <div className="mt-2">
                  <p className="text-sm font-semibold">Filename:</p>
                  <p className="text-gray-700 break-words">{item.file.name}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold">Title:</p>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                  />
                </div>
                <button
                  onClick={() => handleRemoveSelected(index)}
                  className="absolute top-2 right-2 bg-white border border-gray-300 text-red-500 px-2 py-0.5 text-xs rounded hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Upload Images
          </button>
        </>
      )}

      {/* Uploaded Gallery */}
      <h3 className="text-xl font-bold mt-10 mb-4">Uploaded Gallery</h3>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {gallery.map((file, index) => (
          <div key={index} className="border p-2 rounded shadow-sm relative bg-white">
            <img
              src={`http://localhost:3000/uploads/${file}`}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded"
            />
           <div className="mt-2">
  <p className="text-sm font-semibold">Title:</p>
  <input
    type="text"
    placeholder="Enter a description"
    className="w-full border rounded px-2 py-1 mt-1"
  />
  <select className="mt-2 w-full border rounded px-2 py-1">
    <option>Main photo</option>
    <option>Show as</option>
  </select>
</div>

            <button
              onClick={() => handleDeleteUploaded(file)}
              className="absolute top-2 right-2 bg-white border border-gray-300 text-red-500 px-2 py-0.5 text-xs rounded hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => alert('Saving not implemented yet')}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Save
      </button>
    </div>
  );
};

export default ImageUploader;
