"use client"

import React, { useState } from 'react';
import {
  useGetAllSubscribersQuery,
  useUpdateSubscriberStatusMutation,
  useDeleteSubscriberMutation
} from '@/features/subscribers/subscriberAPI';
import { format } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ToggleSwitch = ({ isActive, onToggle }) => (
  <div className="relative inline-block w-12 h-6 cursor-pointer" onClick={onToggle}>
    <div className={`w-12 h-6 rounded-full transition duration-300 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
      <div className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition duration-300 ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
  </div>
);

const SubscriberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // 🆕 delete loading state

  const {
    data: subscribersData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetAllSubscribersQuery();

  const [updateStatus] = useUpdateSubscriberStatusMutation();
  const [deleteSubscriber] = useDeleteSubscriberMutation();

  const handleStatusToggle = async (subscriberId, currentStatus) => {
    try {
      await updateStatus({ subscriberId, isActive: !currentStatus }).unwrap();
      toast.success(`Subscriber ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status.');
      console.error(err);
    }
  };

  const handleDeleteClick = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubscriber) return;

    try {
      setIsDeleting(true); // Start loader
      await deleteSubscriber(selectedSubscriber._id).unwrap();
      setTimeout(() => {
        toast.success('Subscriber deleted successfully.');
      }, 1000)
      setIsModalOpen(false);
      setSelectedSubscriber(null);
      await refetch();
    } catch (err) {
      toast.error('Failed to delete subscriber.');
      console.error(err);
    } finally {
      setIsDeleting(false); // Stop loader
    }
  };

  const filteredSubscribers = subscribersData?.subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil((filteredSubscribers?.length || 0) / pageSize);
  const paginatedSubscribers = (filteredSubscribers || []).slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function getPaginationPages(current, total) {
    if (total <= 1) return [1];
    if (current === 1) return [1, '...', total];
    if (current === total) return [1, '...', total];
    if (current !== 1 && current !== total) return [1, '...', current, '...', total];
  }
  const paginationPages = getPaginationPages(currentPage, totalPages);

  if (isLoading) return <div className="text-center p-4">Loading subscribers...</div>;
  if (isError) return <div className="text-center text-red-500 p-4">Error loading data</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subscriber Management</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by email..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Subscribers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedSubscribers.map((subscriber) => (
              <tr key={subscriber._id}>
                <td className="px-6 py-4">{subscriber.email}</td>
                <td className="px-6 py-4">{format(new Date(subscriber.createdAt), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <ToggleSwitch
                      isActive={subscriber.isActive}
                      onToggle={() => handleStatusToggle(subscriber._id, subscriber.isActive)}
                    />
                    <span className={`ml-2 text-sm ${subscriber.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                      {subscriber.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                    onClick={() => handleDeleteClick(subscriber)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Results */}
        {filteredSubscribers?.length === 0 && (
          <div className="text-center text-gray-500 py-4">No subscribers found.</div>
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

      {/* Tailwind Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-md w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <div className="p-6">
              <p>Are you sure you want to delete <strong>{selectedSubscriber?.email}</strong>?</p>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  setSelectedSubscriber(null);
                  setIsModalOpen(false);
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded flex items-center gap-2"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriberManagement;