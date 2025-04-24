import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CampaignParts from "../../components/CampaignParts/CampaignParts";
import apiService from "../../utils/apiService";
import "./CampaignPage.css";

const CampaignPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we have an ID parameter, fetch the specific campaign
    if (id) {
      setLoading(true);
      apiService.campaigns.getById(id)
        .then(data => {
          setCampaign(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching campaign:", err);
          setError("Failed to load campaign details. Please try again later.");
          setLoading(false);
        });
    }
  }, [id]);

  // If we're on the /campaign/:id route and still loading
  if (id && loading) {
    return (
      <div className="campaign-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading campaign details...</p>
        </div>
      </div>
    );
  }

  // If we're on the /campaign/:id route and there was an error
  if (id && error) {
    return (
      <div className="campaign-page-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.history.back()} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If we're on the /campaign/:id route and have campaign data
  if (id && campaign) {
    return (
      <div className="campaign-page-container">
        <div className="single-campaign-view">
          <h1>{campaign.title}</h1>
          {/* Display the specific campaign details here */}
          <div className="campaign-details">
            {campaign.imageUrl && (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="campaign-main-image"
              />
            )}
            <div className="campaign-info">
              <p className="campaign-description">{campaign.description}</p>
              <div className="campaign-stats">
                <div className="stat">
                  <span className="stat-label">Target:</span>
                  <span className="stat-value">${campaign.target}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Raised:</span>
                  <span className="stat-value">${campaign.donated || 0}</span>
                </div>
                {campaign.endDate && (
                  <div className="stat">
                    <span className="stat-label">End Date:</span>
                    <span className="stat-value">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <button className="donate-button">Support This Campaign</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view for /campaign route (list of campaigns)
  return (
    <div className="campaign-page-container">
      <CampaignParts />
    </div>
  );
};

export default CampaignPage;
