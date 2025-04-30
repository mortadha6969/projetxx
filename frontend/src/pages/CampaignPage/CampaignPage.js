import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../../utils/apiService';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import CampaignDetail from '../../components/CampaignDetail/CampaignDetail';
import CampaignList from '../../components/CampaignList/CampaignList';

const CampaignPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we have an ID, fetch the specific campaign
    if (id) {
      const fetchCampaign = async () => {
        try {
          setLoading(true);
          setError(null);

          // Use the API service to fetch campaign data
          console.log(`Fetching campaign data for ID ${id}`);
          const response = await apiService.campaigns.getById(id);
          console.log('Campaign data received:', response);

          // Log user information specifically
          if (response && response.user) {
            console.log('Campaign creator:', response.user);
          } else {
            console.log('No user data found in campaign response');
          }

          // Log the files array specifically
          if (response && response.files) {
            console.log('Campaign files:', response.files);
            console.log('Files type:', typeof response.files);

            // If files is a string, try to parse it
            if (typeof response.files === 'string') {
              try {
                response.files = JSON.parse(response.files);
                console.log('Parsed files:', response.files);
              } catch (parseError) {
                console.error('Error parsing files JSON:', parseError);
              }
            }
          }

          // Log donation information specifically
          if (response) {
            console.log('Campaign donation data:', {
              donated: response.donated,
              donors: response.donors,
              target: response.target,
              progress: ((response.donated / response.target) * 100).toFixed(2) + '%'
            });
          }

          setCampaign(response);
        } catch (err) {
          console.error('Error fetching campaign:', err);
          setError('Failed to load campaign. Please try again later.');

          // For demo purposes, set a sample campaign if API fails
          setCampaign(sampleCampaign);
        } finally {
          setLoading(false);
        }
      };

      fetchCampaign();
    }
  }, [id]); // Only re-fetch when the ID changes

  if (loading) {
    return <LoadingSpinner />;
  }

  // If we have an ID, show the campaign detail page
  if (id) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={() => window.location.href = '/campaigns'}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Campaigns
            </button>
          </div>
        )}

        {campaign && <CampaignDetail campaign={campaign} />}

        {!campaign && !loading && !error && (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6">
            <p>Campaign not found or still loading. Please wait or try again later.</p>
            <button
              onClick={() => window.location.href = '/campaigns'}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Back to Campaigns
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // If no ID, show the campaign listing page
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Campaigns</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover innovative projects and inspiring causes that need your support.
        </p>
      </div>

      <CampaignList />
    </motion.div>
  );
};

// Sample campaign data for demo purposes
const sampleCampaign = {
  id: 1,
  title: "Clean Water Initiative",
  description: "Our mission is to provide clean, safe drinking water to communities in need around the world. Access to clean water is a fundamental human right, yet millions of people still lack this basic necessity. Through this campaign, we aim to install water filtration systems in 50 villages across developing regions, directly impacting over 25,000 people.\n\nThe funds will be used for:\n- Purchasing and installing water filtration systems\n- Training local communities on maintenance and water safety\n- Conducting water quality tests and monitoring\n- Implementing educational programs about hygiene and sanitation\n\nYour support will help reduce waterborne diseases, improve health outcomes, and give communities the foundation they need to thrive.",
  target: 50000,
  donated: 32500,
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  imageUrl: "https://source.unsplash.com/random/800x600/?water",
  images: [
    "https://source.unsplash.com/random/800x600/?water",
    "https://source.unsplash.com/random/800x600/?village",
    "https://source.unsplash.com/random/800x600/?children"
  ],
  donors: 215,
  status: "active",
  user: {
    username: "WaterFoundation",
    profileImage: "https://source.unsplash.com/random/100x100/?profile"
  }
};

export default CampaignPage;
