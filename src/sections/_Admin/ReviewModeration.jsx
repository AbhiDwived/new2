"use client"

import React, { useState, useRef } from 'react';
import { FaStar, FaRegCheckCircle, FaTrash, FaSpinner } from 'react-icons/fa';
import { RxCrossCircled } from 'react-icons/rx';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useGetAllReviewsQuery, useApproveReviewMutation, useHoldReviewMutation } from '@/features/reviews/reviewAPI';

const StarRating = ({ rating, size = 24 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" size={size} />);
    else stars.push(<FaStar key={i} className="text-gray-300" size={size} />);
  }
  return <div className="flex items-center space-x-1">{stars}</div>;
};

const ReviewModeration = () => {
  const { data, isLoading, isError, refetch } = useGetAllReviewsQuery();
  const [approveReview, { isLoading: isApproving }] = useApproveReviewMutation();
  const [holdReview, { isLoading: isHolding }] = useHoldReviewMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [actionId, setActionId] = useState(null); // Track which review is being acted on
  const pageSize = 10;
  const reviews = data?.reviews || [];
  const totalPages = Math.ceil(reviews.length / pageSize);
  const paginatedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const cardRefs = useRef({});
  function getPaginationPages(current, total) {
    if (total <= 1) return [1];
    if (current === 1) return [1, '...', total];
    if (current === total) return [1, '...', total];
    if (current !== 1 && current !== total) return [1, '...', current, '...', total];
  }
  const paginationPages = getPaginationPages(currentPage, totalPages);

  const showToast = (msg, type = 'info') => {
    if (window.toast) window.toast(msg, { type });
    else window.alert(msg);
  };

  const handleApprove = async (id, reported, status) => {
    if (!(reported || status === 'on_hold' || status === 'pending')) {
      showToast('Only pending, reported, or on-hold reviews can be approved.', 'warning');
      return;
    }
    setActionId(id);
    try {
      await approveReview(id).unwrap();
      showToast('Review approved and unflagged.', 'success');
      await refetch();
      setTimeout(() => {
        cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    } catch (err) {
      showToast(err?.data?.message || 'Failed to approve review.', 'error');
    } finally {
      setActionId(null);
    }
  };
  const handleRemove = async (id) => {
    const reason = window.prompt('Please provide a reason for putting this review on hold:');
    if (!reason) {
      showToast('A reason is required.', 'warning');
      return;
    }
    setActionId(id);
    try {
      await holdReview({ reviewId: id, reason }).unwrap();
      showToast('Review put on hold.', 'success');
      await refetch();
      setTimeout(() => {
        cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    } catch (err) {
      showToast(err?.data?.message || 'Failed to put review on hold.', 'error');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg shadow-md lg:p-2 md:p-2">
      <div className="mb-2 px-3 py-3">
        <h1 className="text-2xl font-bold text-gray-800">Review Moderation</h1>
        <p className="text-gray-600">All reviews (pending, reported, on hold, approved)</p>
      </div>
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading reviews...</div>
      ) : isError ? (
        <div className="p-4 text-center text-red-500">Failed to load reviews.</div>
      ) : reviews.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No reviews found.</div>
      ) : (
        <div className="space-y-2">
          {paginatedReviews.map((review) => (
            <div
              key={review._id}
              ref={el => (cardRefs.current[review._id] = el)}
              className="border rounded-lg overflow-hidden shadow bg-white"
            >
              {/* Review Header */}
              {review.status === 'on_hold' ? (
                <div className="bg-yellow-50 p-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold inline-flex items-center pb-0 ">
                        <span className="inline mr-2">⏸️</span>
                        Review On Hold
                      </p>
                      <p className="text-sm text-gray-600 mb-0 ml-2">Reason: {review.adminHoldReason || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {review.updatedAt ? new Date(review.updatedAt).toLocaleDateString() : ''}
                  </div>
                </div>
              ) : review.reported ? (
                <div className="bg-red-50 p-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold inline-flex items-center pb-0 ">
                        <span className="inline"><AiOutlineExclamationCircle color='red' className='mr-2' /></span>
                        Review Reported
                      </p>
                      <p className="text-sm text-gray-600 mb-0 ml-2">Reason: {review.reportReason || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Reported on {review.reportedAt ? new Date(review.reportedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ) : review.status === 'approved' ? (
                <div className="bg-green-50 p-2 flex justify-between items-center">
                  <div className="font-semibold text-green-700 flex items-center gap-2">
                    <FaRegCheckCircle color="green" /> Approved
                  </div>
                  <div className="text-xs text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</div>
                </div>
              ) : (
                <div className="bg-gray-50 p-2 flex justify-between items-center">
                  <div className="font-semibold text-gray-700">Pending Approval</div>
                  <div className="text-xs text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</div>
                </div>
              )}
              {/* Review Content */}
              <div className="ml-3">
                <div className="flex items-center ">
                  <img
                    src={review.user?.profilePhoto || "/Images/user.png"}
                    alt={review.user?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <h3 className="font-semibold mr-2 text-base">{review.user?.name || 'User'}</h3>
                  <div className="flex justify-end text-yellow-400 ml-auto mr-4">
                    <StarRating rating={review.rating} size={24} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Review for: {review.vendor?.businessName || 'Vendor'}</p>
                <div className="text-xs text-gray-500 mb-1">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</div>
                <p className="text-gray-800 bg-gray-50 p-2">
                  {review.comment}
                </p>
              </div>
              {/* Action Buttons: Always show for admin */}
              <div className="p-2 flex justify-end gap-2">
                <button
                  onClick={() => handleApprove(review._id, review.reported, review.status)}
                  className={`p-2 rounded flex items-center bg-green-100 text-green-800 hover:text-gray-800 ${(review.reported || review.status === 'on_hold' || review.status === 'pending') ? '' : 'opacity-60 cursor-not-allowed'}`}
                  disabled={isApproving || isHolding || !(review.reported || review.status === 'on_hold' || review.status === 'pending') || actionId === review._id}
                  title={(review.reported || review.status === 'on_hold' || review.status === 'pending') ? 'Approve and unflag this review' : 'Only pending, reported, or on-hold reviews can be approved'}
                >
                  {isApproving && actionId === review._id ? (
                    <FaSpinner className="animate-spin mr-1" />
                  ) : (
                    <span className="w-5 h-5 rounded flex items-center justify-center text-white mr-1">
                      <FaRegCheckCircle className='hover:text-gray-800' color='green' size={18} />
                    </span>
                  )}
                  Approve Review
                </button>
                <button
                  onClick={() => handleRemove(review._id)}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded flex items-center hover:text-gray-800"
                  disabled={isApproving || isHolding || actionId === review._id}
                >
                  {isHolding && actionId === review._id ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <span className="w-5 h-5 rounded flex items-center justify-center text-white mr-2">
                      <RxCrossCircled className='hover:text-gray-800' color='red' size={18} />
                    </span>
                  )}
                  Remove Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-6 bg-gray-50 px-3 py-2 rounded-lg shadow border">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            aria-label="Previous page"
          >
            Prev
          </button>
          {paginationPages.map((page, idx) =>
            page === '...'
              ? <span key={idx} className="px-2 text-gray-400">...</span>
              : <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border transition ${currentPage === page ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border transition ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewModeration;
