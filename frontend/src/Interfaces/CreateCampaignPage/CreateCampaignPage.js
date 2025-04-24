import React from "react";
import CreateCampaignForm from "../../components/CreateCampaign/CreateCampaignForm";
import "./CreateCampaignPage.css";

const CreateCampaignPage = () => {
  return (
    <div className="create-campaign-page">
      <div className="page-header">
        <h1>Create Your Campaign</h1>
        <p className="page-description">
          Start your fundraising journey by creating a campaign. Fill out the form below with details about your project.
        </p>
      </div>
      <CreateCampaignForm />
    </div>
  );
};

export default CreateCampaignPage;
