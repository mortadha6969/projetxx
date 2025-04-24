import React from 'react';
import { motion } from 'framer-motion';
import Login from '../../components/Login/Login';

const LoginPage = () => {
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
              <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="mb-6">
                Sign in to access your account and continue supporting amazing projects.
              </p>
              <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <Login />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
