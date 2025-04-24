import React from 'react';
import { motion } from 'framer-motion';
import ProfileAccount from '../../components/ProfileAccount/ProfileAccount';

const ProfileAccountPage = () => {
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
            <ProfileAccount />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileAccountPage;
