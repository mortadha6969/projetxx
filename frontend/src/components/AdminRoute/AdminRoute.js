import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

/**
 * AdminRoute component
 * A wrapper for routes that should only be accessible to admin users
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();

  // Debug information
  console.log('AdminRoute - currentUser:', currentUser);
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute - user role:', currentUser?.role);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated but not admin, redirect to home
  if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // If authenticated and admin, render the children
  return children;
};

export default AdminRoute;
