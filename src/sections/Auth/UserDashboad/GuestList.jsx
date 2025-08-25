"use client"

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { CiImport, CiExport } from "react-icons/ci";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useGetUserGuestsQuery,
  useAddGuestMutation,
  useUpdateGuestStatusMutation,
  useDeleteGuestMutation,
} from '@/features/guests/guestAPI';

export default function GuestManager() {
  const { data: guestData, isLoading, isError, error } = useGetUserGuestsQuery();
  const [addGuest, { isLoading: isAdding }] = useAddGuestMutation();
  const [updateGuestStatus, { isLoading: isUpdating }] = useUpdateGuestStatusMutation();
  const [deleteGuest, { isLoading: isDeleting }] = useDeleteGuestMutation();

  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', status: 'pending' });
  const [guests, setGuests] = useState([]);

  // Update local state when API data changes
  useEffect(() => {
    if (guestData && guestData.data) {
      setGuests(guestData.data);
    }
  }, [guestData]);

  // Show toast on error
  useEffect(() => {
    if (isError) {
      toast.error(`Error: ${error?.data?.message || 'Failed to load guests'}`);
    }
  }, [isError, error]);

  const handleUpdateGuestStatus = async (guestId, status) => {
    try {
      await updateGuestStatus({ guestId, status }).unwrap();
      toast.success('Guest status updated successfully');
    } catch (err) {
      toast.error(`Error: ${err?.data?.message || 'Failed to update guest status'}`);
    }
  };

  const handleDeleteGuest = async (guestId) => {
    try {
      await deleteGuest(guestId).unwrap();
      toast.error('Guest deleted successfully');
    } catch (err) {
      toast.error(`Error: ${err?.data?.message || 'Failed to delete guest'}`);
    }
  };

  const handleAddGuest = async () => {
    if (!newGuest.name || (!newGuest.email && !newGuest.phone)) {
      toast.warning('Please provide name and either email or phone number');
      return;
    }

    try {
      await addGuest(newGuest).unwrap();
      setNewGuest({ name: '', email: '', phone: '', status: 'pending' });
      toast.success('Guest added successfully');
    } catch (err) {
      toast.error(`Error: ${err?.data?.message || 'Failed to add guest'}`);
    }
  };

  if (isLoading && !guests.length) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3">Loading guests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guest Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-4 mb-6">
              <h2 className="text-xl font-bold flex">Guest List</h2>
              <div className="flex items-center justify-between mb-6 mt-3">
                <div className="flex items-center space-x-4">
                  {['confirmed', 'pending', 'declined'].map((status) => (
                    <div className="flex items-center" key={status}>
                      <div
                        className={`w-3 h-3 rounded-full mr-1 ${
                          status === 'confirmed'
                            ? 'bg-green-500'
                            : status === 'pending'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                      <span className="text-xs text-gray-600 capitalize">
                        {status}: {guests.filter((g) => g.status === status).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                {guests.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No guests added yet. Add your first guest using the form.
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid gray' }}>
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-4">Contact</th>
                        <th className="text-center py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr key={guest._id} style={{ borderBottom: '1px solid gray' }}>
                          <td className="py-3 px-2">{guest.name}</td>
                          <td className="py-3 px-4">
                            <div>{guest.email}</div>
                            <div className="text-sm text-gray-500">{guest.phone}</div>
                          </td>
                          <td className="py-3 px-1 text-center">
                            <select
                              value={guest.status}
                              onChange={(e) =>
                                handleUpdateGuestStatus(guest._id, e.target.value)
                              }
                              disabled={isUpdating}
                              className={`rounded-md px-2 py-1 text-sm ${
                                guest.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : guest.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="declined">Declined</option>
                            </select>
                          </td>
                          <td className="py-3 px-5">
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteGuest(guest._id)}
                              disabled={isDeleting}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add Guest</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="guestName" className="block text-sm font-medium">
                    Guest Name
                  </label>
                  <input
                    id="guestName"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="John Doe"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="guestEmail" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="guestEmail"
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="john@example.com"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="guestPhone" className="block text-sm font-medium">
                    Phone
                  </label>
                  <input
                    id="guestPhone"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="9876543210"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  />
                </div>
                <button
                  onClick={handleAddGuest}
                  disabled={isAdding || !newGuest.name || (!newGuest.email && !newGuest.phone)}
                  className="w-full bg-[#0D3F6A] hover:bg-[#0D3F6A] text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-300"
                >
                  {isAdding ? 'Adding...' : 'Add Guest'}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Guest List Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Guests:</span>
                  <span className="font-bold">{guests.length}</span>
                </div>
                {['confirmed', 'pending', 'declined'].map((status) => (
                  <div className="flex justify-between" key={status}>
                    <span className="text-gray-600 capitalize">{status}:</span>
                    <span
                      className={`font-bold ${
                        status === 'confirmed'
                          ? 'text-green-600'
                          : status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {guests.filter((g) => g.status === status).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Container (like BookingBudget) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
        toastClassName="custom-toast"
      />
    </div>
  );
}
