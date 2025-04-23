// src/interfaces/CreateCampaign/CreateCampaignForm.js
import React from "react";
import CreateCampaign from "../../components/CreateCampaign/CreateCampaignForm";
//                              ↑ this import alias stays as-is

const CreateCampaignPage = () => {
  return (
    <div>
      <h1>Create Your Campaign</h1>
      {/* You imported it as `CreateCampaign`, so render <CreateCampaign /> */}
      <CreateCampaign />
    </div>
  );
};

export default CreateCampaignPage;
