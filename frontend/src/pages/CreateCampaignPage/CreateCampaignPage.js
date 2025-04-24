import React from 'react';
import { motion } from 'framer-motion';
import CreateCampaignForm from '../../components/CreateCampaign/CreateCampaignForm';

const CreateCampaignPage = () => {
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Your Campaign</h1>
            <p className="text-gray-600 mb-8">
              Share your story, set your funding goal, and add compelling images to bring your campaign to life.
            </p>
            <CreateCampaignForm />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCampaignPage;
