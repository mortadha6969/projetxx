import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { FiClock, FiUsers, FiTarget, FiHeart } from 'react-icons/fi';

const CampaignDetail = ({ campaign }) => {
  const { isAuthenticated } = useAuth();
  const [activeImage, setActiveImage] = useState(campaign.imageUrl || campaign.images?.[0]);
  const [donationAmount, setDonationAmount] = useState(50);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((campaign.donated / campaign.target) * 100),
    100
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
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
  const handleDonate = (e) => {
    e.preventDefault();
    // In a real app, this would submit the donation to the API
    alert(`Thank you for your donation of $${donationAmount}!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
              className="w-full h-full object-cover"
            />
            
            {/* Image thumbnails */}
            {campaign.images && campaign.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {campaign.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(image)}
                    className={`w-12 h-12 rounded-md overflow-hidden border-2 ${
                      activeImage === image ? 'border-primary-500' : 'border-white'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
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
                src={campaign.user?.profileImage || "https://source.unsplash.com/random/100x100/?profile"}
                alt={campaign.user?.username || "Campaign Creator"}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-gray-600">
                by {campaign.user?.username || "Anonymous"}
              </span>
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
                <div className="font-bold text-gray-900">{campaign.donors}</div>
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
                <div className="font-bold text-gray-900">{formatCurrency(campaign.donated)}</div>
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
                  {formatCurrency(campaign.donated)}
                </span>
                <span className="text-gray-500">
                  {progressPercentage}% of {formatCurrency(campaign.target)}
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
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
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
                      <span className="text-gray-500">USD</span>
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
      
      {/* Campaign Description */}
      <div className="p-6 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About This Campaign</h2>
        <div className="prose max-w-none">
          {campaign.description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
