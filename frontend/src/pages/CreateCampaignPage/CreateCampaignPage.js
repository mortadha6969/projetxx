import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import CreateCampaignForm from '../../components/CreateCampaign/CreateCampaignForm';

const CreateCampaignPage = ({ isEditing }) => {
  // Get campaign ID from URL if in editing mode
  const { id } = useParams();
  const campaignId = id || null;

  // Determine if we're in editing mode either from props or from URL params
  const editMode = isEditing || !!campaignId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {editMode ? 'Update Your Campaign' : 'Create Your Campaign'}
            </h1>
            <p className="text-gray-600 mb-8">
              {editMode
                ? 'Update your campaign details, funding goal, or add new images to refresh your campaign.'
                : 'Share your story, set your funding goal, and add compelling images to bring your campaign to life.'
              }
            </p>
            <CreateCampaignForm campaignId={campaignId} isEditing={editMode} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCampaignPage;
