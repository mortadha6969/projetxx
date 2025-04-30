import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CampaignCard from '../CampaignCard/CampaignCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import apiService from '../../utils/apiService';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [allCampaigns, setAllCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);

        // Prepare API parameters - only for category filtering
        const params = {};
        if (category !== 'all') {
          params.category = category;
        }

        // Fetch campaigns from the API with category filter
        const response = await apiService.campaigns.getAll(params);
        console.log('Fetched campaigns:', response);

        let campaignsData = [];
        // Check if we have campaigns data
        if (response && Array.isArray(response)) {
          campaignsData = response;
        } else if (response && Array.isArray(response.campaigns)) {
          campaignsData = response.campaigns;
        } else {
          console.warn('Unexpected API response format:', response);
          campaignsData = sampleCampaigns; // Fallback to sample data
        }

        // Store all campaigns - sorting will be handled by the sort useEffect
        setAllCampaigns(campaignsData);
        setCampaigns(campaignsData);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns. Please try again later.');

        // Fallback to sample data if API fails
        let fallbackData = [...sampleCampaigns];

        // Filter sample campaigns by category if needed
        if (category !== 'all') {
          fallbackData = fallbackData.filter(campaign =>
            campaign.category === category
          );
        }

        // Apply sorting to sample data - we need to define the function before using it
        // This will be handled by the sort useEffect

        setAllCampaigns(sampleCampaigns);
        setCampaigns(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [category]);

  // Add a useEffect to handle sorting changes
  useEffect(() => {
    if (allCampaigns.length > 0) {
      // Apply sorting whenever the sort option changes
      const sortedCampaigns = sortCampaigns(allCampaigns, sort);
      setCampaigns(sortedCampaigns);
    }
  }, [sort, allCampaigns]);

  // Function to sort campaigns
  const sortCampaigns = (campaigns, sortType) => {
    const sortedCampaigns = [...campaigns];

    console.log('Sorting campaigns by:', sortType);
    console.log('Campaigns before sorting (first 3):', sortedCampaigns.slice(0, 3).map(c => ({
      id: c.id,
      title: c.title,
      donated: c.donated,
      createdAt: c.createdAt
    })));

    switch (sortType) {
      case 'newest':
        // Sort by createdAt descending (newer dates first)
        sortedCampaigns.sort((a, b) => new Date(b.createdAt || b.endDate) - new Date(a.createdAt || a.endDate));
        break;
      case 'oldest':
        // Sort by createdAt ascending (older dates first)
        sortedCampaigns.sort((a, b) => new Date(a.createdAt || a.endDate) - new Date(b.createdAt || b.endDate));
        break;
      case 'most-funded':
        // Sort by donated amount descending (highest first)
        sortedCampaigns.sort((a, b) => {
          // Convert to numbers to ensure proper comparison
          const donatedA = parseFloat(a.donated) || 0;
          const donatedB = parseFloat(b.donated) || 0;
          return donatedB - donatedA;
        });
        break;
      case 'least-funded':
        // Sort by donated amount ascending (lowest first)
        sortedCampaigns.sort((a, b) => {
          // Convert to numbers to ensure proper comparison
          const donatedA = parseFloat(a.donated) || 0;
          const donatedB = parseFloat(b.donated) || 0;
          return donatedA - donatedB;
        });
        break;
      default:
        // Default to newest
        sortedCampaigns.sort((a, b) => new Date(b.createdAt || b.endDate) - new Date(a.createdAt || a.endDate));
    }

    console.log('Campaigns after sorting (first 3):', sortedCampaigns.slice(0, 3).map(c => ({
      id: c.id,
      title: c.title,
      donated: c.donated,
      createdAt: c.createdAt
    })));

    return sortedCampaigns;
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    const newSortValue = e.target.value;
    console.log('Sort changed to:', newSortValue);

    // Log current campaigns before sorting
    console.log('Current campaigns before sort change:', campaigns.slice(0, 3).map(c => ({
      id: c.id,
      title: c.title,
      donated: c.donated
    })));

    setSort(newSortValue);

    // The useEffect will handle the actual sorting
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Medical">Medical</option>
              <option value="Community">Community</option>
              <option value="Creative">Creative</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={handleSortChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most-funded">Most Funded</option>
              <option value="least-funded">Least Funded</option>
            </select>
          </div>
        </div>
        <div className="self-end">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{campaigns.length}</span> campaigns
          </p>
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No campaigns found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

// Sample campaign data for demo purposes
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
    category: "Community",
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
    status: "active",
    category: "Education",
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
    category: "Technology",
  },
  {
    id: 4,
    title: "Wildlife Conservation",
    description: "Protecting endangered species and their natural habitats.",
    target: 80000,
    donated: 35000,
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    imageUrl: "https://source.unsplash.com/random/800x600/?wildlife",
    donors: 280,
    status: "active",
    category: "Community",
  },
  {
    id: 5,
    title: "Mental Health Support",
    description: "Creating resources and support systems for mental health awareness.",
    target: 60000,
    donated: 28000,
    endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
    imageUrl: "https://source.unsplash.com/random/800x600/?health",
    donors: 195,
    status: "active",
    category: "Medical",
  },
  {
    id: 6,
    title: "Homeless Shelter Expansion",
    description: "Expanding facilities to provide shelter for more people in need.",
    target: 120000,
    donated: 85000,
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    imageUrl: "https://source.unsplash.com/random/800x600/?shelter",
    donors: 520,
    status: "active",
    category: "General",
  },
];

export default CampaignList;
