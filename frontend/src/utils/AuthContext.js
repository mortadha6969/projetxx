import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from './apiService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const userRole = localStorage.getItem('userRole');

      console.log('Auth check - token exists:', !!token);
      console.log('Auth check - userRole from localStorage:', userRole);

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Set basic user info from localStorage while we fetch the full profile
      if (userId && username) {
        setCurrentUser({
          id: userId,
          username: username,
          role: userRole || 'user'
        });
        setIsAuthenticated(true);
      }

      try {
        // Fetch user profile
        const userData = await apiService.user.getProfile();
        // Make sure we have the user's role
        console.log('Auth check - userData:', userData);

        if (userData && userData.user) {
          console.log('Auth check - setting currentUser from userData.user:', userData.user);
          setCurrentUser(userData.user);
        } else {
          console.log('Auth check - setting currentUser directly from userData:', userData);
          setCurrentUser(userData);
        }

        // Debug the current user after setting it
        setTimeout(() => {
          console.log('Auth check - currentUser after setting:', currentUser);
        }, 100);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    setError(null);
    setIsLoading(true);

    try {
      console.log('Attempting login with:', credentials);
      const response = await apiService.auth.login(credentials);
      console.log('Login response:', response);
      // Debug the user role
      console.log('User role from login:', response.user?.role);

      // Check if we have a token and user data
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Save token and user info to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('username', response.user.username);
      // Also save the user role
      if (response.user.role) {
        localStorage.setItem('userRole', response.user.role);
      }

      // Update state
      setCurrentUser(response.user);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      console.error('Login error details:', err);

      // Handle different types of errors
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    setIsLoading(true);

    try {
      console.log('Attempting registration with userData:', {
        ...userData,
        password: '[REDACTED]' // Don't log the actual password
      });

      const response = await apiService.auth.register(userData);
      console.log('Registration response:', response);
      return response;
    } catch (err) {
      console.error('Registration error details:', err);

      // Set a user-friendly error message
      if (err.errors && Array.isArray(err.errors)) {
        // Handle validation errors
        const errorMessage = err.errors.map(e => e.message).join(', ');
        setError(errorMessage || 'Registration failed due to validation errors');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }

      // Rethrow the error so the component can handle it
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');

    // Update state
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const updatedUser = await apiService.user.updateProfile(profileData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    setError(null);
    try {
      return await apiService.user.changePassword(passwordData);
    } catch (err) {
      setError(err.message || 'Failed to change password');
      throw err;
    }
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
