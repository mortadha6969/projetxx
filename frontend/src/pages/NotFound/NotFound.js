import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <div className="h-2 w-24 bg-primary-600 mx-auto my-4 rounded-full"></div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      
      <Link 
        to="/"
        className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition duration-300 shadow-md hover:shadow-lg"
      >
        Return to Homepage
      </Link>
    </motion.div>
  );
};

export default NotFound;
