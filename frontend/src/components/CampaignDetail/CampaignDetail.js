import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { FiClock, FiUsers, FiTarget, FiHeart, FiArrowLeft } from 'react-icons/fi';
import apiService from '../../utils/apiService';
import { toast } from 'react-toastify';

const CampaignDetail = ({ campaign }) => {
  console.log('CampaignDetail received campaign:', campaign);

  // Force a refresh of the campaign data when the component mounts
  useEffect(() => {
    console.log('CampaignDetail component mounted, campaign data:', {
      id: campaign.id,
      donated: campaign.donated,
      donors: campaign.donors
    });

    // Add a timestamp to the console log to track when the component was rendered
    console.log('Component rendered at:', new Date().toISOString());
  }, [campaign]);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Import API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Helper function to get full image URL
  const getFullImageUrl = (path) => {
    if (!path) return null;
    // If the path already starts with http, it's already a full URL
    if (path.startsWith('http')) return path;
    // If the path starts with /, it's a relative path from the API
    return `${API_BASE_URL}${path}`;
  };

  // Process files array if it's a string
  let processedFiles = campaign.files;

  if (campaign.files && typeof campaign.files === 'string') {
    try {
      processedFiles = JSON.parse(campaign.files);
      console.log('Parsed files from string:', processedFiles);
    } catch (error) {
      console.error('Error parsing files JSON:', error);
      processedFiles = [];
    }
  }

  // Combine main image and additional images from files array
  const allImages = [
    getFullImageUrl(campaign.imageUrl),
    ...(processedFiles && Array.isArray(processedFiles)
      ? processedFiles.map(file => getFullImageUrl(file.url))
      : [])
  ].filter(Boolean); // Remove any null/undefined values

  console.log('All images:', allImages);

  const [activeImage, setActiveImage] = useState(allImages[0] || campaign.images?.[0]);
  const [donationAmount, setDonationAmount] = useState(50);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Function to open the lightbox with a specific image
  const openLightbox = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
  };

  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round(((campaign.donated || 0) / campaign.target) * 100),
    100
  );

  // Format currency
  const formatCurrency = (amount) => {
    // Format with Intl.NumberFormat but replace $ with DT
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount).replace('$', '') + ' DT';
  };

  // Format time remaining
  const getTimeRemaining = (endDate) => {
    try {
      const end = new Date(endDate);
      return formatDistanceToNow(end, { addSuffix: true });
    } catch (error) {
      return 'Date unavailable';
    }
  };

  // Handle donation amount change
  const handleAmountChange = (e) => {
    setDonationAmount(parseInt(e.target.value, 10));
  };

  // Handle donation submission
  const handleDonate = async (e) => {
    e.preventDefault();

    try {
      // Show loading state
      const loadingToast = toast.loading("Initializing payment...");

      // Get user information
      const userResponse = await apiService.user.getProfile();
      const user = userResponse.user;

      console.log('User data:', user);
      console.log('Campaign data:', campaign);

      // Prepare payment data
      const amountInDT = parseFloat(donationAmount);
      const amountInMillimes = Math.round(amountInDT * 1000);

      console.log('Donation amount in DT:', amountInDT);
      console.log('Donation amount in millimes:', amountInMillimes);

      const paymentData = {
        campaignId: campaign.id,
        amount: amountInMillimes, // Convert to millimes
        description: `Donation to ${campaign.title}`,
        firstName: user.firstName || user.username,
        lastName: user.lastName || '',
        email: user.email,
        phoneNumber: user.phone || ''
      };

      console.log('Payment data being sent:', paymentData);

      // Initialize Konnect payment
      const response = await apiService.konnect.initializePayment(paymentData);

      // Update toast
      toast.update(loadingToast, {
        render: "Redirecting to payment gateway...",
        type: "info",
        isLoading: true,
        autoClose: 2000
      });

      // Redirect to Konnect payment page
      setTimeout(() => {
        window.location.href = response.payUrl;
      }, 1500);

    } catch (error) {
      console.error("Donation error:", error);
      toast.error(error.message || "Failed to initialize payment. Please try again.");
    }
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/campaigns" className="ml-1 text-sm font-medium text-gray-700 hover:text-primary-600 md:ml-2">
                Campaigns
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-xs">
                {campaign.title}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Navigation Buttons */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          <span>Back to Campaigns</span>
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh Campaign</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <button
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged campaign image"
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(image);
                  }}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    lightboxImage === image ? 'border-primary-500' : 'border-white'
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="md:flex">
        {/* Campaign Images */}
        <div className="md:w-3/5">
          <div className="relative h-80 md:h-full">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={activeImage}
              alt={campaign.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openLightbox(activeImage)}
            />

            {/* Image thumbnails */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 bg-black bg-opacity-30 py-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(image)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                      activeImage === image ? 'border-primary-500' : 'border-white'
                    } hover:border-primary-300 transition-all`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 text-white font-bold">
                      {index === 0 ? 'Main' : `#${index + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Image count badge */}
            {allImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-primary-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                {allImages.length} Images
              </div>
            )}
          </div>
        </div>

        {/* Campaign Info */}
        <div className="md:w-2/5 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
            <div className="flex items-center mb-4">
              <img
                src={getFullImageUrl(campaign.user?.profileImage) || "/images/question-mark-profile.svg"}
                alt={campaign.user?.username || "Campaign Creator"}
                className="w-10 h-10 rounded-full mr-3 border-2 border-primary-100 object-cover bg-gray-100"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "/images/question-mark-profile.svg";
                }}
              />
              <div>
                <div className="text-gray-800 font-medium">
                  {campaign.user?.username ? `by ${campaign.user.username}` : "Anonymous"}
                </div>
                {campaign.user?.firstName && campaign.user?.lastName && (
                  <div className="text-gray-500 text-sm">
                    {campaign.user.firstName} {campaign.user.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-500 mb-1">
                  <FiTarget className="mr-1" /> Goal
                </div>
                <div className="font-bold text-gray-900">{formatCurrency(campaign.target)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-500 mb-1">
                  <FiUsers className="mr-1" /> Donors
                </div>
                <div className="font-bold text-gray-900">{campaign.donors || 0}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-500 mb-1">
                  <FiClock className="mr-1" /> Ends
                </div>
                <div className="font-bold text-gray-900">{getTimeRemaining(campaign.endDate)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center text-gray-500 mb-1">
                  <FiHeart className="mr-1" /> Raised
                </div>
                <div className="font-bold text-gray-900">{formatCurrency(campaign.donated || 0)}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="font-semibold text-primary-700">
                  {formatCurrency(campaign.donated || 0)}
                </span>
                <span className="text-gray-500">
                  {progressPercentage}% of {formatCurrency(campaign.target || 0)}
                </span>
              </div>
            </div>

            {/* Donation Form */}
            {isAuthenticated ? (
              <form onSubmit={handleDonate} className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount
                </label>
                <div className="flex gap-2 mb-4">
                  {[20, 50, 100, 200].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setDonationAmount(amount)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                        donationAmount === amount
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {amount} DT
                    </button>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">DT</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      min="1"
                      value={donationAmount}
                      onChange={handleAmountChange}
                      className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter amount"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">TND</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  Donate Now
                </button>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-3">
                  Please log in to donate to this campaign.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  Log In to Donate
                </Link>
              </div>
            )}

            {/* Share Buttons */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Share this campaign</p>
              <div className="flex gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                  </svg>
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778C2.036 8.746 2 12 2 12s.036 3.254.403 4.795c.222.786.836 1.4 1.766 1.624 1.567.424 7.831.431 7.831.431s6.264.007 7.831-.404a2.51 2.51 0 0 0 1.766-1.778C22.036 15.254 22 12 22 12s-.036-3.254-.407-4.797z" />
                    <path d="M9.75 15.27V8.73L15.5 12l-5.75 3.27z" fill="#fff" />
                  </svg>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Gallery - Only show if we have multiple images */}
      {allImages.length > 1 && (
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  setActiveImage(image);
                  openLightbox(image);
                }}
              >
                <img
                  src={image}
                  alt={`Campaign image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
                  <span className="bg-primary-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                    {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Description */}
      <div className="p-6 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About This Campaign</h2>
        <div className="prose max-w-none">
          {campaign.description ?
            campaign.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))
            :
            <p className="mb-4 text-gray-700">No description available.</p>
          }
        </div>
      </div>
    </div>
    </div>
  );
};

export default CampaignDetail;
