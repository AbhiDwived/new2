"use client"

import { useState, useMemo } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useGetVendorReviewsQuery, useCreateReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } from '@/features/reviews/reviewAPI';
import { useGetUserBookingsQuery } from '@/features/bookings/bookingAPI';
const defaultAvatar = "/Images/user.png";

const StarRating = ({ rating, onChange, editable = false, size = 20 }) => {
  // If editable, allow half-star selection
  if (editable && onChange) {
    const handleClick = (value) => onChange(value);
    const handleMouseMove = (e, i) => {
      const { left, width } = e.target.getBoundingClientRect();
      const x = e.clientX - left;
      if (x < width / 2) {
        onChange(i - 0.5);
      } else {
        onChange(i);
      }
    };
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{ cursor: 'pointer', fontSize: size }}
            onClick={(e) => handleClick(rating >= i ? i : i - 0.5)}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => onChange(Math.round(rating * 2) / 2)}
          >
            {rating >= i ? (
              <FaStar size={size} className="text-yellow-500" />
            ) : rating >= i - 0.5 ? (
              <FaStarHalfAlt size={size} className="text-yellow-500" />
            ) : (
              <FaRegStar size={size} className="text-yellow-500" />
            )}
          </span>
        ))}
      </div>
    );
  }
  // Non-editable display
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" size={size} />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" size={size} />);
    else stars.push(<FaRegStar key={i} className="text-yellow-500" size={size} />);
  }
  return <div className="flex items-center space-x-1">{stars}</div>;
};

const CustomerReviews = () => {
  const { vendorId } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  // Fetch reviews for this vendor
  const { data: reviewData, refetch: refetchReviews, isLoading: isLoadingReviews } = useGetVendorReviewsQuery(vendorId, { skip: !vendorId });
  const reviews = reviewData?.reviews || [];

  // Fetch user's bookings
  const { data: bookingData } = useGetUserBookingsQuery(undefined, { skip: !isAuthenticated });
  const completedBookings = useMemo(() => {
    return (bookingData?.data?.bookings || []).filter(
      b => (b.vendor === vendorId || b.vendor?._id === vendorId) && b.status === 'completed'
    );
  }, [bookingData, vendorId]);

  // Check if user already reviewed any completed booking
  const userReview = reviews.find(r => {
    if (!r.user) return false;
    if (typeof r.user === 'string') return String(r.user) === String(userId);
    if (typeof r.user === 'object') return String(r.user._id) === String(userId);
    return false;
  });
  const canReview = isAuthenticated && completedBookings.length > 0 && !userReview;

  // Review form state
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ rating: userReview?.rating || 5, comment: userReview?.comment || "" });

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Handle review submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating || !form.comment) return;
    const bookingId = completedBookings[0]?._id; // Use first completed booking
    try {
      await createReview({ vendor: vendorId, booking: bookingId, rating: form.rating, comment: form.comment }).unwrap();
      setForm({ rating: 5, comment: "" });
      refetchReviews();
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  // Handle review update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.rating || !editForm.comment) return;
    try {
      await updateReview({ reviewId: userReview._id, rating: editForm.rating, comment: editForm.comment }).unwrap();
      setEditMode(false);
      refetchReviews();
    } catch (err) {
      // handle error
    }
  };

  // Handle review delete
  const handleDelete = async () => {
    try {
      await deleteReview(userReview._id).unwrap();
      setEditMode(false);
      refetchReviews();
    } catch (err) {
      // handle error
    }
  };

  // Calculate average rating
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : 0;

  console.log({
    isAuthenticated,
    userId,
    vendorId,
    bookings: bookingData?.data?.bookings,
    completedBookings,
    userReview,
    canReview
  });

  return (
    <section className="max-w-7xl mx-auto p-2 font-serif ">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-full">
          <h2 className="text-2xl font-semibold mb-2">Customer Reviews</h2>
          <div className="flex items-center mb-4">
            <StarRating rating={avgRating} />
            <span className="text-gray-600 text-sm ml-2">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Review Form */}
          {canReview && (
            <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded bg-gray-50">
              <div className="flex items-center mb-2">
                <span className="mr-2 font-medium">Your Rating:</span>
                <StarRating
                  rating={form.rating}
                  onChange={(val) => setForm(f => ({ ...f, rating: val }))}
                  editable={true}
                  size={28}
                />
              </div>
              <textarea
                className="w-full border rounded p-2 mb-2"
                rows={3}
                placeholder="Write your review..."
                value={form.comment}
                onChange={e => setForm(f => ({...f, comment: e.target.value}))}
                required
              />
              <button type="submit" className="bg-[#19599A] text-white px-4 py-2 rounded hover:bg-[#DEBF78]" disabled={isCreating}>
                {isCreating ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Edit/Delete own review */}
          {userReview && editMode && (
            <div className="mb-6 border p-4 rounded bg-gray-50">
              <form onSubmit={handleUpdate}>
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-medium">Edit Rating:</span>
                  <StarRating
                    rating={editForm.rating}
                    onChange={(val) => setEditForm(f => ({ ...f, rating: val }))}
                    editable={true}
                    size={28}
                  />
                </div>
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  rows={3}
                  value={editForm.comment}
                  onChange={e => setEditForm(f => ({...f, comment: e.target.value}))}
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button type="submit" className="bg-[#19599A] text-white px-4 py-2 rounded hover:bg-[#DEBF78]" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update'}
                  </button>
                  <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                  <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-2">
            {isLoadingReviews ? (
              <div>Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-gray-500">No reviews yet.</div>
            ) : (
              reviews.map((review, idx) => (
                <div key={review._id || idx} className="border rounded-lg overflow-hidden shadow bg-white">
                  {/* Review Content Header */}
                  <div className="flex items-center px-4 pt-3">
                    <img
                      src={review.user?.profilePhoto || defaultAvatar}
                      alt={review.user?.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <h3 className="font-semibold mr-2 text-base">{review.user?.name || 'User'}</h3>
                    <div className="flex justify-end text-yellow-400 ml-auto mr-4">
                      <StarRating rating={review.rating} size={24} />
                    </div>
                  </div>
                  {/* Date and Content */}
                  <div className="px-4 pb-2">
                    <div className="text-xs text-gray-500 mb-1">{new Date(review.createdAt).toLocaleDateString()}</div>
                    <div className="text-gray-800 text-sm p-2">
                      {review.comment}
                    </div>
                  </div>
                  {/* Action Buttons for own review */}
                  {userReview && review._id === userReview._id && !editMode && (
                    <div className="p-2 flex justify-end gap-2">
                      <button className="p-2 bg-blue-100 text-blue-800 rounded flex items-center hover:text-gray-800 text-sm" onClick={() => setEditMode(true)}>
                        <FaEdit className="mr-1" size={16} /> Edit
                      </button>
                      <button className="p-2 bg-red-100 text-red-800 rounded flex items-center hover:text-gray-800 text-sm" onClick={handleDelete} disabled={isDeleting}>
                        <FaTrash className="mr-1" size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
