import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiDollarSign } from 'react-icons/fi';
import apiService from '../../utils/apiService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import './MyCampaignsPage.css';

const MyCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forwardLoading, setForwardLoading] = useState(false);
  const [forwardError, setForwardError] = useState(null);
  const [forwardSuccess, setForwardSuccess] = useState(null);
  const [minForwardAmount, setMinForwardAmount] = useState(50); // Default to 50 DT
  const [eligibilityCache, setEligibilityCache] = useState({}); // Cache for eligibility checks
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      try {
        setLoading(true);
        const response = await apiService.campaigns.getUserCampaigns();
        console.log('User campaigns response:', response);

        if (Array.isArray(response)) {
          // Old API format - just an array of campaigns
          setCampaigns(response);

          // Calculate total raised manually
          const total = response.reduce((sum, campaign) => {
            return sum + (parseFloat(campaign.donated) || 0);
          }, 0);
          setTotalRaised(total);
        } else if (response && Array.isArray(response.campaigns)) {
          // New API format - object with campaigns array and totalRaised
          setCampaigns(response.campaigns);

          // Use totalRaised from API if available, otherwise calculate it
          if (response.totalRaised !== undefined) {
            setTotalRaised(response.totalRaised);
          } else {
            const total = response.campaigns.reduce((sum, campaign) => {
              return sum + (parseFloat(campaign.donated) || 0);
            }, 0);
            setTotalRaised(total);
          }
        } else {
          console.warn('Unexpected API response format:', response);
          setCampaigns([]);
          setTotalRaised(0);
        }
      } catch (err) {
        console.error('Error fetching user campaigns:', err);
        setError('Failed to load your campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        setLoading(true);
        await apiService.campaigns.delete(id);

        // Find the campaign that was deleted
        const deletedCampaign = campaigns.find(campaign => campaign.id === id);

        // Update campaigns list
        const updatedCampaigns = campaigns.filter(campaign => campaign.id !== id);
        setCampaigns(updatedCampaigns);

        // Update total raised amount by subtracting the deleted campaign's donated amount
        if (deletedCampaign) {
          const deletedAmount = parseFloat(deletedCampaign.donated) || 0;
          setTotalRaised(prevTotal => prevTotal - deletedAmount);
        }

        alert('Campaign deleted successfully');
      } catch (err) {
        console.error('Error deleting campaign:', err);
        alert('Failed to delete campaign. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if a campaign is eligible for forwarding funds to Konnect
  const checkForwardEligibility = async (campaignId) => {
    // Return cached result if available
    if (eligibilityCache[campaignId] !== undefined) {
      return eligibilityCache[campaignId];
    }

    try {
      const response = await apiService.withdrawals.checkForwardEligibility(campaignId);

      // Update min forward amount if it's different from our default
      if (response.minAmount && response.minAmount !== minForwardAmount) {
        setMinForwardAmount(response.minAmount);
      }

      // Cache the result
      setEligibilityCache(prev => ({
        ...prev,
        [campaignId]: response.isEligible
      }));

      return response.isEligible;
    } catch (err) {
      console.error('Error checking eligibility to forward funds to Konnect:', err);
      return false;
    }
  };

  // Handle forwarding funds to Konnect
  const handleForwardToKonnect = async (campaignId) => {
    // Clear previous messages
    setForwardError(null);
    setForwardSuccess(null);

    // Check eligibility first
    const isEligible = await checkForwardEligibility(campaignId);

    if (!isEligible) {
      setForwardError(`You need to raise at least ${minForwardAmount} DT before you can forward funds to Konnect.`);
      return;
    }

    // Confirm with user
    if (!window.confirm('Are you sure you want to forward funds to your Konnect account? You will be able to withdraw from there.')) {
      return;
    }

    try {
      setForwardLoading(true);
      const response = await apiService.withdrawals.requestForwardToKonnect(campaignId);
      setForwardSuccess('Your funds will be forwarded to your Konnect account. You will be able to withdraw from there.');

      // Update eligibility cache
      setEligibilityCache(prev => ({
        ...prev,
        [campaignId]: false // After forwarding, campaign is no longer eligible
      }));
    } catch (err) {
      console.error('Error forwarding funds to Konnect:', err);
      setForwardError(err.message || 'Failed to forward funds to Konnect. Please try again later.');
    } finally {
      setForwardLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Summary Stats Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Your Fundraising Impact</h2>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <div className="text-4xl font-bold">{totalRaised.toFixed(2)} DT</div>
                <div className="text-primary-100">Total Funds Raised</div>
              </div>
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <div className="text-4xl font-bold">{campaigns.length}</div>
                <div className="text-primary-100">Total Campaigns</div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="text-4xl font-bold">
                  {campaigns.filter(c => c.status === 'active').length}
                </div>
                <div className="text-primary-100">Active Campaigns</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Campaigns</h1>
              </div>
              <Link
                to="/create-campaign"
                className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create New Campaign
              </Link>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {forwardSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {forwardSuccess}
              </div>
            )}

            {forwardError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {forwardError}
              </div>
            )}

            {forwardLoading && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6 flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing request to forward funds to Konnect...
              </div>
            )}

            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-6">You haven't created any campaigns yet.</p>
                <Link
                  to="/create-campaign"
                  className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Create Your First Campaign
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Raised
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Forward to Konnect
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {campaign.description?.substring(0, 60)}
                              {campaign.description?.length > 60 ? '...' : ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            campaign.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1) || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(campaign.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.target} DT
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.donated} DT
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, (campaign.donated / campaign.target) * 100)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/campaign/${campaign.id}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View Campaign"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/edit-campaign/${campaign.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Campaign"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(campaign.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Campaign"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {campaign.donated >= minForwardAmount ? (
                            <button
                              onClick={() => handleForwardToKonnect(campaign.id)}
                              className="withdraw-button"
                              title="Forward Funds to Konnect"
                              disabled={forwardLoading}
                            >
                              <FiDollarSign size={18} className="mr-1" />
                              Forward to Konnect
                            </button>
                          ) : (
                            <div className="text-gray-500 text-xs">
                              Need {minForwardAmount} DT to forward to Konnect
                              <div className="withdraw-progress">
                                <div
                                  className="withdraw-progress-bar"
                                  style={{ width: `${Math.min(100, (campaign.donated / minForwardAmount) * 100)}%` }}
                                ></div>
                              </div>
                              <div className="text-xs mt-1">
                                {campaign.donated} / {minForwardAmount} DT
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyCampaignsPage;
