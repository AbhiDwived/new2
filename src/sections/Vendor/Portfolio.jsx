"use client"

import React, { useState, useRef, useEffect } from 'react';
import { LuImagePlus, LuVideo, LuUpload, LuEye, LuMaximize } from "react-icons/lu";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  useUploadPortfolioImageMutation,
  useGetPortfolioImagesQuery,
  useGetPortfolioVideosQuery,
  useDeletePortfolioImageMutation,
  useDeletePortfolioVideoMutation,
  useUploadPortfolioVideoMutation
} from '@/features/vendors/vendorAPI';

const ImageViewModal = ({ imageUrl, onClose }) => {
  return (
    <div
      className="modal fade show"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0,0,0,0.8)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-transparent border-0">
          <div className="modal-body text-center">
            <img
              src={imageUrl}
              alt="Full Size"
              className="img-fluid mx-auto"
              style={{
                maxWidth: '90%',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
            <button
              className="btn btn-light mt-3"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoViewModal = ({ videoUrl, onClose }) => {
  // Ensure YouTube/Vimeo embed URL
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com')) {
      return url.replace('watch?v=', 'embed/');
    } else if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div
      className="modal fade show"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0,0,0,0.8)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-transparent border-0">
          <div className="modal-body text-center">
            <iframe
              src={embedUrl}
              title="Portfolio Video"
              style={{
                width: '90%',
                height: '70vh',
                maxWidth: '1200px',
                border: 'none'
              }}
              allowFullScreen
            />
            <button
              className="btn btn-light mt-3"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PortfolioTab = () => {
  const { vendor } = useSelector((state) => state.vendor);
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [portfolioVideos, setPortfolioVideos] = useState([]);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vendorId, setVendorId] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'videos'
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const videoInputRef = useRef(null);
  const [selectedImageForView, setSelectedImageForView] = useState(null);
  const [selectedVideoForView, setSelectedVideoForView] = useState(null);

  // Extensive logging for debugging
  useEffect(() => {
    // Removed debugging logs
  }, [user, token, isAuthenticated]);

  // Get vendorId from user object or local storage
  useEffect(() => {
    const extractVendorId = () => {

      
      // Method 0: Check URL params for admin edit mode
      const urlParams = new URLSearchParams(window.location.search);
      const adminEditId = urlParams.get('adminEdit');
      if (adminEditId) {

        return adminEditId;
      }
      
      // Method 1: Check vendor state from Redux
      if (vendor?.id) {

        return vendor.id;
      }
      if (vendor?._id) {

        return vendor._id;
      }
      
      // Method 2: Check user state from Redux (if vendor is logged in as user)
      if (user?.id && user?.role === 'vendor') {

        return user.id;
      }
      if (user?._id && user?.role === 'vendor') {

        return user._id;
      }

      // Method 3: Try vendor from localStorage
      const vendorData = "" // localStorage.getItem('vendor');
      if (vendorData) {
        try {
          const parsedData = JSON.parse(vendorData);
          const storedId = parsedData.id || parsedData._id;
          if (storedId) {

            return storedId;
          }
        } catch (error) {
          console.warn('⚠️ Error parsing vendor data from localStorage:', error);
        }
      }

      // Method 4: Try vendorInfo from localStorage (legacy)
      const vendorInfo = localStorage.getItem('vendorInfo');
      if (vendorInfo) {
        try {
          const parsedData = JSON.parse(vendorInfo);
          const storedId = parsedData.id || parsedData._id;
          if (storedId) {

            return storedId;
          }
        } catch (error) {
          console.warn('⚠️ Error parsing vendorInfo from localStorage:', error);
        }
      }

      // Method 5: Try decoding token from localStorage
      const vendorToken = localStorage.getItem('vendorToken');
      if (vendorToken) {
        try {
          const tokenParts = vendorToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.id) {

              return payload.id;
            }
          }
        } catch (error) {
          console.warn('⚠️ Error decoding vendor token:', error);
        }
      }

      // Method 6: Try regular user token if it's a vendor
      const userToken = localStorage.getItem('token');
      if (userToken) {
        try {
          const tokenParts = userToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.id && payload.role === 'vendor') {

              return payload.id;
            }
          }
        } catch (error) {
          console.warn('⚠️ Error decoding user token:', error);
        }
      }


      return null;
    };

    const id = extractVendorId();

    setVendorId(id);
  }, [user, vendor]);

  // API hooks
  const [uploadPortfolioImage] = useUploadPortfolioImageMutation();
  const [deletePortfolioImage] = useDeletePortfolioImageMutation();
  const [uploadPortfolioVideo] = useUploadPortfolioVideoMutation();
  const [deletePortfolioVideo] = useDeletePortfolioVideoMutation();

  // Queries for images and videos
  const {
    data: portfolioImagesData,
    isLoading: isLoadingImages,
    isError: isImagesError,
    error: imagesError,
    refetch: refetchImages
  } = useGetPortfolioImagesQuery(
    vendorId,
    {
      skip: !vendorId,
      onError: (error) => {
        console.error('Portfolio Images Query Error:', error);
        console.error('Vendor ID used:', vendorId);
        toast.error('Failed to load portfolio images');
      }
    }
  );

  const {
    data: portfolioVideosData,
    isLoading: isLoadingVideos,
    isError: isVideosError,
    error: videosError,
    refetch: refetchVideos
  } = useGetPortfolioVideosQuery(
    vendorId,
    {
      skip: !vendorId,
      onError: (error) => {
        console.error('Portfolio Videos Query Error:', error);
        console.error('Vendor ID used:', vendorId);
        toast.error('Failed to load portfolio videos');
      }
    }
  );

  // Debug logging for API errors
  useEffect(() => {
    if (isImagesError) {
      console.error('Images Error Details:', {
        error: imagesError,
        vendorId,
        status: imagesError?.status,
        data: imagesError?.data
      });
    }
    if (isVideosError) {
      console.error('Videos Error Details:', {
        error: videosError,
        vendorId,
        status: videosError?.status,
        data: videosError?.data
      });
    }
  }, [isImagesError, isVideosError, imagesError, videosError, vendorId]);

  // Update state when data is fetched
  useEffect(() => {
    if (portfolioImagesData?.images) {
      setPortfolioImages(portfolioImagesData.images);
    }
  }, [portfolioImagesData]);

  useEffect(() => {
    if (portfolioVideosData?.videos) {
      setPortfolioVideos(portfolioVideosData.videos);
    }
  }, [portfolioVideosData]);

  // Image handling methods
  const handleAddImageClick = (index = null) => {
    setEditingImageIndex(index);
    fileInputRef.current.accept = 'image/*';
    fileInputRef.current.multiple = true; // Enable multiple file selection
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setIsLoading(true);

      // Validate vendor ID
      if (!vendorId) {
        throw new Error('Vendor ID is missing. Please log in again.');
      }

      // If editing a single image
      if (editingImageIndex !== null && files.length === 1) {
        // Delete the old image first
        const imageId = portfolioImages[editingImageIndex]._id;
        if (imageId) {
          await deletePortfolioImage(imageId).unwrap();
        }

        // Then upload the new image
        const formData = new FormData();
        formData.append('image', files[0]);
        formData.append('title', `Portfolio Image ${portfolioImages.length}`);
        formData.append('vendorId', vendorId);
        await uploadPortfolioImage(formData).unwrap();
      }
      // For multiple uploads or adding new images
      else {
        // Upload each image in sequence
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append('image', files[i]);
          formData.append('title', `Portfolio Image ${portfolioImages.length + i + 1}`);
          formData.append('vendorId', vendorId);
          await uploadPortfolioImage(formData).unwrap();
        }
      }

      // Refetch images to get updated list
      refetchImages();

      setEditingImageIndex(null);
      fileInputRef.current.value = null;
      toast.success(files.length > 1 ? `${files.length} images uploaded successfully` : 'Image uploaded successfully');
    } catch (error) {
      // User-friendly error messages
      if (error.name === 'TypeError') {
        toast.error('Authentication failed. Please log out and log in again.');
      } else if (error.status === 401) {
        toast.error('Unauthorized. Please log in again.');
      } else if (error.status === 413) {
        toast.error('Image file is too large. Maximum file size is 10MB.');
      } else {
        toast.error(
          error.data?.message || 
          error.message || 
          'Failed to upload image(s). Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      setIsLoading(true);
      const imageId = portfolioImages[index]._id;
      await deletePortfolioImage({ imageId, vendorId }).unwrap();
      refetchImages();
      toast.success('Image removed successfully');
    } catch (error) {
      toast.error('Failed to remove image');
    } finally {
      setIsLoading(false);
    }
  };

  // Video handling methods
  const handleAddVideoClick = () => {
    // For direct URL input
    if (videoUrl) {
      handleAddVideo();
    } else {
      // For file upload
      fileInputRef.current.accept = 'video/*';
      fileInputRef.current.click();
    }
  };

  const handleAddVideo = async () => {
    if (!videoUrl) return;

    try {
      setIsLoading(true);
      const videoData = {
        url: videoUrl,
        title: `Portfolio Video ${portfolioVideos.length + 1}`,
        description: ''
      };

      await uploadPortfolioVideo(videoData).unwrap();
      refetchVideos();
      setVideoUrl('');
      toast.success('Video added successfully');
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error(error?.data?.message || 'Failed to add video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVideo = async (index) => {
    // Validate index and video existence
    if (index < 0 || index >= portfolioVideos.length) {
      toast.error('Invalid video selection');
      return;
    }

    const videoToRemove = portfolioVideos[index];

    // Prevent multiple simultaneous removals
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      // Validate video ID
      if (!videoToRemove?._id) {
        throw new Error('No valid video ID found for deletion');
      }

      // Attempt video deletion
      await deletePortfolioVideo(videoToRemove._id).unwrap();

      // Optimistic update of local state
      const updatedVideos = portfolioVideos.filter((_, i) => i !== index);
      setPortfolioVideos(updatedVideos);

      // Refetch to ensure server-side consistency
      await refetchVideos();

      // Success notification
      toast.success('Video removed successfully');
    } catch (error) {
      // Specific error handling based on error type
      if (error.status === 404) {
        toast.error('Video not found. It may have been already deleted.');
      } else if (error.status === 403) {
        toast.error('You do not have permission to remove this video.');
      } else {
        // User-friendly error message
        toast.error(
          error.data?.message ||
          error.message ||
          'Failed to remove video. Please try again.'
        );
      }

      // Optional: Rollback local state if deletion fails
      refetchVideos();
    } finally {
      // Ensure loading state is reset
      setIsLoading(false);
    }
  };

  const handleVideoFileSelect = (e) => {
    const file = e.target.files[0];

    // Validate file
    if (!file) {
      toast.error('No file selected');
      return;
    }

    // Check file type (video)
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload MP4, AVI, or MOV videos.');
      return;
    }

    // Check file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Video file is too large. Maximum file size is 50MB.');
      return;
    }

    // Create local preview
    const videoURL = URL.createObjectURL(file);

    // Set selected file and preview
    setSelectedVideoFile(file);
    setVideoUrl(videoURL);

    // Optional: Show preview
    toast.info('Video selected. Click "Upload" to save.');
  };

  const handleVideoUpload = async () => {
    if (!selectedVideoFile) {
      toast.error('Please select a video file first');
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', selectedVideoFile);
      formData.append('title', `Portfolio Video ${portfolioVideos.length + 1}`);
      formData.append('vendorId', vendorId);

      // Upload video
      const response = await uploadPortfolioVideo(formData).unwrap();

      // Refetch videos to update list
      await refetchVideos();

      // Reset state
      setSelectedVideoFile(null);
      setVideoUrl('');
      videoInputRef.current.value = null;

      // Success notification
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Video Upload Error:', error);

      // Detailed error handling
      toast.error(
        error.data?.message ||
        error.message ||
        'Failed to upload video. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Image viewing handler
  const handleViewImage = (image) => {
    setSelectedImageForView(image);
  };

  // Video viewing handler
  const handleViewVideo = (video) => {
    setSelectedVideoForView(video);
  };

  // Render loading state if vendor ID is not available
  if (!vendorId) {
    return (
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading vendor information...</span>
          </div>
          <p className="ms-3">
            Unable to load vendor information.
            Please ensure you are logged in as a vendor.
          </p>
          <div className="mt-3">
            <h4>Debug Information:</h4>
            <pre>{JSON.stringify({
              user: user ? { id: user.id, email: user.email } : null,
              isAuthenticated,
              tokenExists: !!token,
              vendorInfoExists: !!localStorage.getItem('vendorInfo'),
              vendorTokenExists: !!localStorage.getItem('vendorToken')
            }, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      {/* Image Modal */}
      {selectedImageForView && (
        <ImageViewModal
          imageUrl={selectedImageForView.url}
          onClose={() => setSelectedImageForView(null)}
        />
      )}

      {/* Video Modal */}
      {selectedVideoForView && (
        <VideoViewModal
          videoUrl={selectedVideoForView.url}
          onClose={() => setSelectedVideoForView(null)}
        />
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (fileInputRef.current.accept === 'image/*') {
            handleImageChange(e);
          } else {
            handleVideoFileSelect(e);
          }
        }}
        className="d-none"
      />

      {/* Hidden Video Input */}
      <input
        type="file"
        ref={videoInputRef}
        accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo"
        onChange={handleVideoFileSelect}
        className="d-none"
      />

      {/* Tab Navigation */}
      <div className="mb-4 d-flex justify-content-center">
        <div className="btn-group" role="group">
          <button
            type="button"
            style={{
              backgroundColor: activeTab === 'images' ? '#0f4c81' : 'transparent',
              color: activeTab === 'images' ? '#fff' : '#0f4c81',
              border: `1px solid #0f4c81`
            }}
            className="btn"
            onClick={() => setActiveTab('images')}
          >
            Images
          </button>

          <button
            type="button"
            style={{
              backgroundColor: activeTab === 'videos' ? '#0f4c81' : 'transparent',
              color: activeTab === 'videos' ? '#fff' : '#0f4c81',
              border: '1px solid #0f4c81'
            }}
            className="btn"
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>

        </div>
      </div>

      {/* Loading indicator */}
      {(isLoading || isLoadingImages || isLoadingVideos) && (
        <div className="d-flex justify-content-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Images Tab Content */}
      {activeTab === 'images' && (
        <div className="row g-3">
          {portfolioImages.map((image, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className="position-relative overflow-hidden rounded shadow">
                <img
                  src={image.url}
                  alt={image.title || `Portfolio ${index + 1}`}
                  className="img-fluid w-100 h-100 object-fit-cover"
                  style={{ aspectRatio: '1 / 1' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-all">
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleViewImage(image)}
                      className="btn btn-light btn-sm hover-bg-blue"
                      title="View Image"
                    >
                      <LuEye />
                    </button>
                    <button
                      onClick={() => handleAddImageClick(index)}
                      className="btn btn-light btn-sm hover-bg-blue"
                      title="Edit Image"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="btn btn-danger btn-sm"
                      title="Remove Image"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Image Card */}
          <div className="col-12 col-md-6 col-lg-4">
            <div
              onClick={() => !isLoading && handleAddImageClick(null)}
              className={`border-2 border-dashed rounded d-flex flex-column align-items-center justify-content-center h-100 py-4 text-center ${!isLoading ? 'cursor-pointer' : ''} bg-light`}
              style={{ aspectRatio: '1 / 1' }}
            >
              <LuImagePlus size={32} className="text-muted mb-2" />
              <div className="fw-medium">Add New Images</div>
              <div className="text-muted small mt-1">Upload Max 10MB multiple JPG or PNG</div>
              <div className="text-muted small">Hold Ctrl/Cmd to select multiple</div>
            </div>
          </div>
        </div>
      )}

      {/* Videos Tab Content */}
      {activeTab === 'videos' && (
        <div className="row g-3">
          {portfolioVideos.map((video, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className="position-relative overflow-hidden rounded shadow">
                <iframe
                  src={video.url.replace('watch?v=', 'embed/')}
                  title={video.title || `Portfolio Video ${index + 1}`}
                  className="img-fluid w-100"
                  style={{ aspectRatio: '16 / 9', border: 'none' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-all">
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleViewVideo(video)}
                      className="btn btn-light btn-sm hover-bg-blue"
                      title="View Video"
                    >
                      <LuEye />
                    </button>
                    <button
                      onClick={() => handleRemoveVideo(index)}
                      className="btn btn-danger btn-sm"
                      title="Remove Video"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Video Card */}
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className={`border-2 border-dashed rounded d-flex flex-column align-items-center justify-content-center h-100 py-4 text-center bg-light`}
              style={{ aspectRatio: '16 / 9' }}
            >
              <LuVideo size={32} className="text-muted mb-2" />
              <div className="fw-medium">Upload Video</div>
              <div className="text-muted small mt-1">Max 50MB (MP4, AVI, MOV)</div>

              {/* File Upload Buttons */}
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#0f4c81',
                    border: '1px solid #0f4c81',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => videoInputRef.current.click()}
                  disabled={isLoading}
                >
                  <LuUpload className="me-1" /> Choose File
                </button>

                {selectedVideoFile && (
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#0f4c81',
                      color: '#fff',
                      border: '1px solid #0f4c81',
                    }}
                    onClick={handleVideoUpload}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>


              {/* Video Preview */}
              {videoUrl && (
                <div className="mt-2">
                  <video
                    src={videoUrl}
                    controls
                    style={{ maxWidth: '100%', maxHeight: '150px' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTab;
