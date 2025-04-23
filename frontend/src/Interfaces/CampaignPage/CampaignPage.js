import React from "react";
import CampaignParts from "../../components/CampaignParts/CampaignParts"; // Fix the import casing
import "./CampaignPage.css"; // Ensure this file exists or remove this line

const CampaignPage = () => {
  return (
    <div className="campaign-page-container">
      <CampaignParts />
    </div>
  );
};

export default CampaignPage;
