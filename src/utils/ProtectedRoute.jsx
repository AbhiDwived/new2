"use client"

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'next/router';

const loginRedirects = {
  user: '/login',
  vendor: '/vendor/login',
  admin: '/admin/login',
};

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  // Get auth slices from Redux
  const userAuth = useSelector((state) => state.auth || {});
  const vendorAuth = useSelector((state) => state.vendor || {});
  const adminAuth = useSelector((state) => state.adminAuth || {});

  // Check for admin edit mode
  const adminEditData = localStorage.getItem('adminEditingVendor');
  const isAdminEditMode = adminEditData && JSON.parse(adminEditData)?.isAdminEdit;

  let isAuthenticated = false;
  let currentRole = null;

  // Check admin first (highest priority)
  if (adminAuth.isAuthenticated && adminAuth.admin) {
    isAuthenticated = true;
    currentRole = adminAuth.admin.role || 'admin';
  }
  // Then check vendor
  else if (vendorAuth.isAuthenticated && vendorAuth.vendor) {
    isAuthenticated = true;
    currentRole = vendorAuth.vendor.role || 'vendor';

    // Check if vendor is approved
    if (allowedRoles.includes('vendor') && !vendorAuth.vendor.isApproved) {
      return <Navigate href="/not-approved" replace />;
    }
  }
  // Then check user
  else if (userAuth.isAuthenticated && userAuth.user) {
    isAuthenticated = true;
    currentRole = userAuth.user.role || 'user';
  }

  // Not authenticated, redirect to login page based on first allowed role or default to user login
  if (!isAuthenticated) {
    const redirectTo = loginRedirects[allowedRoles[0]] || '/login';
    return <Navigate href={redirectTo} replace />;
  }

  // Special case: Allow admin to access vendor routes when in admin edit mode
  if (allowedRoles.includes('vendor') && currentRole === 'admin' && isAdminEditMode) {
    return children ? children : <Outlet />;
  }

  // Authenticated but role not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate href="/not-authorized" replace />;
  }

  // Authorized — render children or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
