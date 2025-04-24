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
          const response = await apiService.campaigns.getById(id);
          setCampaign(response.data);
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
  }, [id]);

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
            {error}
          </div>
        )}
        
        {campaign && <CampaignDetail campaign={campaign} />}
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
