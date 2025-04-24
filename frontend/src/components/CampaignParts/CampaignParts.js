import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CampaignParts.css";
import apiService from "../../utils/apiService";
import LoadingSpinner from "../UI/LoadingSpinner";

// Helper function to check if user is logged in
const isLoggedIn = () => {
  return !!localStorage.getItem('token'); // Return true if token exists, otherwise false
};

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

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to calculate progress percentage
const calculateProgress = (donated, target) => {
  return Math.min(Math.round((donated / target) * 100), 100);
};

const CampaignParts = () => {
  const navigate = useNavigate(); // to navigate to the login page
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // Fetch real campaigns from the API
        const response = await apiService.campaigns.getAll();
        console.log('Fetched campaigns for CampaignParts:', response);

        // Check if we have campaigns data
        if (response && Array.isArray(response)) {
          setCampaigns(response);
        } else if (response && Array.isArray(response.campaigns)) {
          setCampaigns(response.campaigns);
        } else {
          console.warn('Unexpected API response format:', response);
          setCampaigns([]);
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again later.");
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDonate = () => {
    if (isLoggedIn()) {
      // User is logged in, proceed with donation action
      console.log("Proceeding to donate...");
      // You can add additional logic for donation here
    } else {
      // User is not logged in, redirect to login page
      navigate("/login");
    }
  };

  // Navigate to the Create Campaign page
  const handleCreateCampaign = () => {
    if (isLoggedIn()) {
      navigate("/create-campaign");  // This should match the path of your Create Campaign page
    } else {
      navigate("/login");  // Redirect to login if not logged in
    }
  };

  // Calculate days left for a campaign
  const getDaysLeft = (endDate) => {
    try {
      const end = new Date(endDate);
      const now = new Date();
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="">
      <div className="campaign-intro">
        <h4>Welcome to our crowdfunding campaigns!</h4>
        <p>
          A place where every idea matters and every contribution sparks change.
          <br></br>We're uniting a community of innovators and dreamers to turn creative projects into reality.
          <br></br>By joining us, you're not just donating; you're investing in a future filled with promise, progress, and positive impact.
          <br></br>Your support fuels transformative projects that empower communities and drive sustainable development.<br></br>
          <br></br>Join our journey and help us make a lasting difference today!
        </p>
      </div>

      {/* Create Campaign Button */}
      <div className="create-campaign-button-container">
        <button className="create-campaign-button" onClick={handleCreateCampaign}>
          Create a Campaign
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {campaigns.length === 0 && !loading && !error && (
        <div className="no-campaigns-message">
          No campaigns found. Be the first to create one!
        </div>
      )}

      <div className="campaign-parts">
        {campaigns.map((campaign) => {
          const progress = calculateProgress(campaign.donated, campaign.target);
          const daysLeft = getDaysLeft(campaign.endDate);

          return (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-media">
                <img
                  src={getFullImageUrl(campaign.imageUrl) || "https://source.unsplash.com/800x600/?project"}
                  alt={campaign.title}
                  className="campaign-image"
                />
                {campaign.status === "trending" && (
                  <div className="campaign-badge">
                    <span>Trending</span>
                  </div>
                )}
              </div>

              <div className="campaign-content">
                <h3>{campaign.title}</h3>

                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <div className="progress-labels">
                    <span>{formatCurrency(campaign.donated)} raised</span>
                    <span>{formatCurrency(campaign.target)} goal</span>
                  </div>
                </div>

                <div className="campaign-stats">
                  <div className="stat-item">
                    <span className="stat-number">{campaign.donors || 0}</span>
                    <span className="stat-label">Donors</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{progress}%</span>
                    <span className="stat-label">Funded</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{daysLeft}</span>
                    <span className="stat-label">Days Left</span>
                  </div>
                </div>

                <button className="donate-button" onClick={() => navigate(`/campaign/${campaign.id}`)}>
                  View Campaign
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignParts;
