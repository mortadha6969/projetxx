import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import apiService from '../../utils/apiService';
import { FiEdit, FiUser, FiMail, FiPhone, FiCalendar, FiInfo } from 'react-icons/fi';
import './ModernProfilePage.css';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ModernProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // API base URL for images
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Helper function to get full image URL
  const getFullImageUrl = (path) => {
    if (!path) return null;
    // If the path already starts with http, it's already a full URL
    if (path.startsWith('http')) return path;
    // If the path starts with /, it's a relative path from the API
    return `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await apiService.user.getProfile();
        console.log('User profile data:', response);

        if (response && response.user) {
          setUser(response.user);
          // Initialize form data with user data
          setFormData({
            firstName: response.user.firstName || '',
            lastName: response.user.lastName || '',
            phone: response.user.phone || '',
            bio: response.user.bio || ''
          });
        } else {
          setError('Failed to load user profile data');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Create FormData object for file upload
      const profileData = new FormData();
      profileData.append('firstName', formData.firstName);
      profileData.append('lastName', formData.lastName);
      profileData.append('phone', formData.phone);
      profileData.append('bio', formData.bio);

      // Add profile image if selected
      if (profileImage) {
        profileData.append('profileImage', profileImage);
      }

      // Update profile
      const response = await apiService.user.updateProfile(profileData);
      console.log('Profile update response:', response);

      if (response && response.user) {
        setUser(response.user);
        setSaveSuccess(true);
        // Exit edit mode after successful save
        setTimeout(() => {
          setIsEditing(false);
          setSaveSuccess(false);
        }, 2000);
      } else {
        setSaveError('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError('Failed to update profile. Please try again later.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  <FiEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 mb-4">
                    <img
                      src={imagePreview || getFullImageUrl(user.profileImage) || "/images/question-mark-profile.svg"}
                      alt={user.username}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "/images/question-mark-profile.svg";
                      }}
                    />
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
                    >
                      <FiEdit size={16} />
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">Click the edit icon to change your profile picture</p>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Cannot be changed)
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={saveLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center"
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <>
                        <span className="mr-2">Saving...</span>
                        <LoadingSpinner size="sm" />
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>

                {/* Save Status Messages */}
                {saveError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {saveError}
                  </div>
                )}
                {saveSuccess && (
                  <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md">
                    Profile updated successfully!
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden">
                    <img
                      src={getFullImageUrl(user.profileImage) || "/images/question-mark-profile.svg"}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "/images/question-mark-profile.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-center md:text-left">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username}
                    </h2>
                    <p className="text-gray-500 mb-4 text-center md:text-left">@{user.username}</p>

                    {user.bio && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                        <p className="text-gray-700">{user.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <FiUser className="mt-1 mr-3 text-primary-500" />
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium">{user.username}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiMail className="mt-1 mr-3 text-primary-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-start">
                        <FiPhone className="mt-1 mr-3 text-primary-500" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                      </div>
                    )}

                    {user.birthdate && (
                      <div className="flex items-start">
                        <FiCalendar className="mt-1 mr-3 text-primary-500" />
                        <div>
                          <p className="text-sm text-gray-500">Birthdate</p>
                          <p className="font-medium">{new Date(user.birthdate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <Link
                      to="/change-password"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors inline-block text-center"
                    >
                      Change Password
                    </Link>

                    {/* Admin Dashboard Link - Only visible for admins */}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors inline-block text-center"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernProfilePage;
