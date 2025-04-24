import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import apiService from "../../utils/apiService";
import CampaignCard from "../CampaignCard/CampaignCard";
import LoadingSpinner from "../UI/LoadingSpinner";
import { FiArrowRight } from "react-icons/fi";

const FeaturedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // In a real app, you would use the API service
        // const response = await apiService.campaigns.getAll({ limit: 3, sort: "popular" });
        // setCampaigns(response.data || []);

        // For demo purposes, use sample data
        setTimeout(() => {
          setCampaigns(sampleCampaigns);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load projects. Please try again later.");
        setCampaigns(sampleCampaigns);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-3 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white text-sm rounded-md hover:bg-primary-600 transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CampaignCard campaign={campaign} />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/campaigns"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition duration-200"
        >
          View All Projects
          <FiArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

// Sample campaign data as fallback
const sampleCampaigns = [
  {
    id: 1,
    title: "Clean Water Initiative",
    description: "Providing clean water to communities in need around the world.",
    target: 50000,
    donated: 32500,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    imageUrl: "https://source.unsplash.com/random/800x600/?water",
    donors: 215,
    status: "active",
  },
  {
    id: 2,
    title: "Educational Technology for Schools",
    description: "Equipping underprivileged schools with modern technology.",
    target: 75000,
    donated: 45000,
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    imageUrl: "https://source.unsplash.com/random/800x600/?school",
    donors: 320,
    status: "trending",
  },
  {
    id: 3,
    title: "Renewable Energy Project",
    description: "Developing sustainable energy solutions for rural communities.",
    target: 100000,
    donated: 68000,
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    imageUrl: "https://source.unsplash.com/random/800x600/?solar",
    donors: 412,
    status: "active",
  }
];

export default FeaturedCampaigns;
