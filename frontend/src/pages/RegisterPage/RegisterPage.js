import React from 'react';
import { motion } from 'framer-motion';
import Register from '../../components/Register/Register';

const RegisterPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-primary-600 p-8 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="mb-6">
                Create an account to start funding projects or launch your own campaign.
              </p>
              <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <Register />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
