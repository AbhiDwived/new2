"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { 
  useGetAllUsersQuery, 
  useGetAllVendorsQuery, 
  useDeleteUserByAdminMutation, 
  useDeleteVendorByAdminMutation,
  useUpdateAdminProfileMutation,
  useApproveVendorMutation
} from '@/features/admin/adminAPI';
import { useGetUserProfileByIdQuery } from '@/features/auth/authAPI';
import { useGetVendorByIdQuery } from '@/features/vendors/vendorAPI';
import Loader from "@/components/shared/Loader";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// ConfirmModal component for delete confirmation
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-  backdrop-blur-sm flex justify-center items-center px-2 z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { data: usersDataRaw, isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = useGetAllUsersQuery();
  const { data: vendorsDataRaw, isLoading: vendorsLoading, isError: vendorsError, refetch: refetchVendors } = useGetAllVendorsQuery();
  const router = useRouter();

  // Create the ref at the top level of the component
  const hasProcessedUrl = useRef(false);
  const openedFromUrlParam = useRef(false);

  const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : usersDataRaw?.users || [];
  const vendorsData = Array.isArray(vendorsDataRaw) ? vendorsDataRaw : vendorsDataRaw?.vendors || [];

  // Combine and format data with proper date handling
  const combinedData = [
    ...usersData.map(user => ({ 
      ...user, 
      role: 'user',
      sortDate: new Date(user.createdAt).getTime(),
      displayName: user.name
    })),
    ...vendorsData.map(vendor => ({ 
      ...vendor, 
      role: 'vendor',
      sortDate: new Date(vendor.appliedDate || vendor.createdAt).getTime(),
      displayName: vendor.businessName || vendor.name,
      vendorType: vendor.vendorType || vendor.category || '-' // Fallback to category if vendorType not available
    }))
  ].sort((a, b) => b.sortDate - a.sortDate); // Sort by date, newest first

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [deleteUserByAdmin] = useDeleteUserByAdminMutation();
  const [deleteVendorByAdmin] = useDeleteVendorByAdminMutation();
  const [updateAdminProfile] = useUpdateAdminProfileMutation();
  const [approveVendor] = useApproveVendorMutation();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New states for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Query for user data with proper error handling
  const { 
    data: userProfileData, 
    isLoading: isUserProfileLoading,
    error: userProfileError 
  } = useGetUserProfileByIdQuery(
    selectedUserId, 
    { skip: !selectedUserId || !showViewModal || selectedUserRole !== 'user' }
  );

  // Query for vendor data with proper error handling
  const { 
    data: vendorProfileData, 
    isLoading: isVendorProfileLoading,
    error: vendorProfileError
  } = useGetVendorByIdQuery(
    selectedUserId, 
    { skip: !selectedUserId || !showViewModal || selectedUserRole !== 'vendor' }
  );

  // Log errors for debugging
  useEffect(() => {
    if (userProfileError) {
      console.error('User profile fetch error:', userProfileError);
    }
    if (vendorProfileError) {
      console.error('Vendor profile fetch error:', vendorProfileError);
    }
  }, [userProfileError, vendorProfileError]);

  const handleView = useCallback((user) => {
    console.log('View clicked for:', user);
    const userId = user.id || user._id;
    console.log('Using user ID:', userId);
    setSelectedUserId(userId);
    setSelectedUserRole(user.role);
    setSelectedUser(user);
    setShowViewModal(true);
  }, []);
  
  // Add useEffect to check for userId in URL query parameter
  useEffect(() => {
    if (!hasProcessedUrl.current) {
      const queryParams = new URLSearchParams(window.location.search);
      const userIdParam = queryParams.get('userId');
      
      if (userIdParam) {
        // Find the user in the combined data
        const user = combinedData.find(u => (u.id === userIdParam || u._id === userIdParam));
        
        if (user) {
          // Open the view modal for this user
          handleView(user);
          openedFromUrlParam.current = true; // Mark that we opened from URL
          hasProcessedUrl.current = true;
        } else {
          console.error("User not found with ID:", userIdParam);
          toast.error("User not found. The user may have been deleted.");
          hasProcessedUrl.current = true;
        }
      }
    }
  }, [combinedData, handleView]);

  const filteredUsers = combinedData.filter(user => {
    const isApprovedVendor = user.role === "vendor";
    const isUser = user.role === "user";

    const shouldInclude = roleFilter === "all"
      ? isUser || isApprovedVendor
      : roleFilter === "vendor"
        ? isApprovedVendor
        : isUser;

    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.businessName || '').toLowerCase().includes(searchTerm.toLowerCase());

    return shouldInclude && matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + usersPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    console.log('Edit clicked for:', user);
    setSelectedUser(user);
    setSelectedUserRole(user.role);
    
    // Initialize form data based on user role
    if (user.role === 'user') {
      setEditFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        status: user.status || 'Active',
      });
    } else {
      // For vendors - only show approval status since that's all we can update
      setEditFormData({
        isApproved: user.isApproved || false,
      });
    }
    
    setShowEditModal(true);
  };
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userId = selectedUser.id || selectedUser._id;
      
      if (selectedUserRole === 'user') {
        // Format user data for submission
        const userData = {
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          location: editFormData.location,
          status: editFormData.status
        };
        
        // Need to create an admin API endpoint for updating user profiles
        console.log('Attempting to update user with ID:', userId);
        console.log('Update data:', userData);
        
        // Since the admin API doesn't have a specific user update endpoint,
        // we'll show a message for now
        toast.info('User update through admin panel is coming soon');
        
        // For demonstration purposes
        setShowEditModal(false);
      } else {
        // For vendors, we can use the approve vendor endpoint which is available
        // Format vendor data for submission 
        const vendorData = {
          isApproved: editFormData.isApproved
        };
        
        // Only update approval status for now
        await approveVendor({ 
          vendorId: userId,
        }).unwrap();
        
        toast.success('Vendor approval status updated successfully');
        
        // Refetch data to update the list
        refetchUsers();
        refetchVendors();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // New delete handlers
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const userId = userToDelete.id || userToDelete._id;
      if (userToDelete.role === 'vendor') {
        await deleteVendorByAdmin({ vendorId: userId }).unwrap();
      } else {
        await deleteUserByAdmin({ userId }).unwrap();
      }
      toast.success(`${userToDelete.displayName} deleted successfully`);
      refetchUsers();
      refetchVendors();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete ${userToDelete.displayName}: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Add handleCloseModal function to navigate to dashboard if opened from URL
  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedUserId(null);
    setSelectedUserRole(null);
    setSelectedUser(null);
    
    // Navigate to dashboard if opened from URL parameter
    if (openedFromUrlParam.current) {
      router.push('/admin/dashboard');
      openedFromUrlParam.current = false;
    }
  };

  if (usersLoading || vendorsLoading) return <Loader fullScreen />;
  if (usersError || vendorsError) return <p className="p-4 text-red-500">Failed to load data.</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">User & Vendor Management</h2>
      <p className="text-sm text-gray-500 mb-4">Manage all registered users and vendors on the platform</p>

      <div className="flex justify-between items-center mb-4 relative">
        <input
          type="text"
          placeholder="Search by name, business name, or email..."
          className="w-1/3 px-3 py-2 border rounded-md text-sm"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <select
          className="w-40 px-3 py-2 border rounded-md text-sm"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Users & Vendors</option>
          <option value="user">Users</option>
          <option value="vendor">Vendors</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 rounded-full">
              <th className="p-2">Name/Business</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date Joined</th>
              <th className="p-2">Vendor Type</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">No users or vendors found.</td>
              </tr>
            ) : (
              paginatedUsers.map((user, idx) => (
                <tr key={user.id || user._id || idx} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div>
                      <span className="font-medium">{user.displayName}</span>
                      {user.role === 'vendor' && user.name && user.name !== user.businessName && (
                        <span className="text-xs text-gray-500 block">Owner: {user.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-sm text-gray-700">{user.email || "-"}</td>
                  <td className="p-2">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2 text-sm">
                    {user.role === 'vendor' ? (
                      user.isApproved ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      )
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Inactive'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.status === 'Inactive' ? 'Inactive' : 'Active'}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-sm">
                    {formatDate(user.role === 'vendor' ? user.appliedDate || user.createdAt : user.createdAt)}
                  </td>
                  <td className="p-2 text-sm">{user.role === 'vendor' ? user.vendorType : "-"}</td>
                  <td className="text-gray-600">
                    <button onClick={() => handleView(user)} className="p-1 hover:bg-gray-100 rounded" title="View">
                      <FaEye className="inline w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(user)} className="p-1 hover:bg-gray-100 rounded mx-2" title="Edit">
                      <FaPen className="inline w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(user)} className="p-1 hover:bg-gray-100 rounded" title="Delete">
                      <FaTrash className="inline w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
        <span>
          Showing {startIdx + 1}-{Math.min(startIdx + usersPerPage, filteredUsers.length)} of {filteredUsers.length} entries
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* View Profile Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center px-2 z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedUserRole === 'vendor' ? 'Vendor Profile' : 'User Profile'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <ImCross />
              </button>
            </div>

            {(isUserProfileLoading || isVendorProfileLoading) ? (
              <div className="flex justify-center items-center h-40">
                <Loader />
              </div>
            ) : userProfileError || vendorProfileError ? (
              <div className="text-center text-red-500 py-8">
                Error loading profile: {(userProfileError || vendorProfileError)?.message || 'Unknown error'}
              </div>
            ) : selectedUserRole === 'user' ? (
              <div className="space-y-4">
                {/* User Profile Photo - using selectedUser directly if API data is not available */}
                <div className="flex justify-center mb-4">
                  {(userProfileData?.user?.profilePhoto) ? (
                    <img 
                      src={userProfileData.user.profilePhoto} 
                      alt={`${userProfileData.user.name}'s profile`}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl text-gray-400">
                        {selectedUser?.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{userProfileData?.user?.name || selectedUser?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userProfileData?.user?.email || selectedUser?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userProfileData?.user?.phone || selectedUser?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{userProfileData?.user?.location || selectedUser?.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined On</p>
                    <p className="font-medium">{formatDate(selectedUser?.createdAt || userProfileData?.user?.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{userProfileData?.user?.status || selectedUser?.status || 'Active'}</p>
                  </div>
                </div>
              </div>
            ) : selectedUserRole === 'vendor' ? (
              <div className="space-y-4">
                {/* Vendor Profile Photo - using selectedUser directly if API data is not available */}
                <div className="flex justify-center mb-4">
                  {vendorProfileData?.vendor?.profilePhoto || vendorProfileData?.vendor?.profilePicture || selectedUser?.profilePhoto || selectedUser?.profilePicture ? (
                    <img 
                      src={vendorProfileData?.vendor?.profilePhoto || vendorProfileData?.vendor?.profilePicture || selectedUser?.profilePhoto || selectedUser?.profilePicture} 
                      alt={`${vendorProfileData?.vendor?.businessName || selectedUser?.businessName || 'Vendor'}'s profile`}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-3xl text-gray-400">
                        {(selectedUser?.businessName || selectedUser?.name)?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium">{vendorProfileData?.vendor?.businessName || selectedUser?.businessName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner Name</p>
                    <p className="font-medium">{vendorProfileData?.vendor?.contactName || selectedUser?.contactName || vendorProfileData?.vendor?.name || selectedUser?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{vendorProfileData?.vendor?.email || selectedUser?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{vendorProfileData?.vendor?.phone || selectedUser?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor Type</p>
                    <p className="font-medium">{vendorProfileData?.vendor?.vendorType || selectedUser?.vendorType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service Areas</p>
                    <p className="font-medium">
                      {(() => {
                        const serviceAreas = vendorProfileData?.vendor?.serviceAreas || selectedUser?.serviceAreas;
                        if (serviceAreas && Array.isArray(serviceAreas)) {
                          return serviceAreas.join(', ');
                        } else if (vendorProfileData?.vendor?.location || selectedUser?.location) {
                          return vendorProfileData?.vendor?.location || selectedUser?.location;
                        }
                        return 'N/A';
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied Date</p>
                    <p className="font-medium">{formatDate(selectedUser?.appliedDate || selectedUser?.createdAt || vendorProfileData?.vendor?.appliedDate || vendorProfileData?.vendor?.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {vendorProfileData?.vendor?.isApproved || selectedUser?.isApproved ? 'Approved' : 'Pending'}
                    </p>
                  </div>
                </div>
                {(vendorProfileData?.vendor?.description || selectedUser?.description) && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{vendorProfileData?.vendor?.description || selectedUser?.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No profile data available
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center px-2 z-50">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Edit {selectedUserRole === 'vendor' ? 'Vendor' : 'User'}: {selectedUser.displayName}
                </h2>
                <p className="text-sm text-gray-500">
                  Update {selectedUserRole === 'vendor' ? 'vendor' : 'user'} information
                </p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <ImCross />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              {selectedUserRole === 'user' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditFormChange}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditFormChange}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Status</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                      className="w-full border rounded p-2"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-md mb-4">
                    <p className="text-yellow-700 font-medium">Note: Only vendor approval status can be updated via the admin panel at this time.</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isApproved"
                      name="isApproved"
                      checked={editFormData.isApproved}
                      onChange={handleEditFormChange}
                      className="mr-2 h-5 w-5"
                    />
                    <label htmlFor="isApproved" className="text-sm font-medium">
                      Approve this vendor
                    </label>
                  </div>
                  
                  {/* Display vendor info but make it read-only */}
                  <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h3 className="font-medium mb-2">Vendor Information (Read Only)</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Business Name:</p>
                        <p className="font-medium">{selectedUser.businessName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Owner:</p>
                        <p className="font-medium">{selectedUser.contactName || selectedUser.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email:</p>
                        <p className="font-medium">{selectedUser.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone:</p>
                        <p className="font-medium">{selectedUser.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Vendor Type:</p>
                        <p className="font-medium">{selectedUser.vendorType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Service Areas:</p>
                        <p className="font-medium">
                          {Array.isArray(selectedUser.serviceAreas) 
                            ? selectedUser.serviceAreas.join(', ') 
                            : (selectedUser.location || 'N/A')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#19599A] text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${userToDelete?.displayName || 'this user'}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserManagement;