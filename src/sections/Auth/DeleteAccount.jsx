"use client"

import React from 'react';
import { useDeleteUserMutation } from '@/features/auth/authAPI';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteAccount = () => {
  const [deleteUser, { isLoading, isSuccess, error }] = useDeleteUserMutation();

  const handleDelete = async () => {
    const userId = 'current-user-id'; // get from Redux or local storage
    try {
      await deleteUser({ userId }).unwrap();
      alert('Your account has been deleted');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <p>Are you sure you want to delete your account?</p>
      <button onClick={handleDelete} disabled={isLoading}>
        {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
      </button>
      {isSuccess && <p style={{ color: 'green' }}>Account deleted successfully</p>}
      {error && <p style={{ color: 'red' }}>{error.data?.message || 'Failed to delete'}</p>}
    </div>
  );
};

export default DeleteAccount;