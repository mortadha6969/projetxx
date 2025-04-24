import React from 'react';
import { motion } from 'framer-motion';
import ModernRegister from '../../components/Register/ModernRegister';
import { FiCheckCircle } from 'react-icons/fi';

const ModernRegisterPage = () => {
  const benefits = [
    "Create and fund your own projects",
    "Support causes you care about",
    "Track your donations in one place",
    "Connect with a community of creators"
  ];

  return (
    <div className="py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Left side - Benefits */}
            <div className="md:w-5/12 bg-gradient-to-br from-primary-500 to-primary-600 p-8 text-white">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6">Join TrueFunding Today</h2>
                <p className="mb-8 text-primary-100">
                  Create an account to start funding projects or launch your own campaign.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                      className="flex items-start"
                    >
                      <FiCheckCircle className="mt-0.5 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-primary-400/30">
                  <div className="flex items-center">
                    <img 
                      src="https://source.unsplash.com/random/100x100/?portrait" 
                      alt="User" 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">"TrueFunding helped me raise $25,000 for my startup in just 3 weeks!"</p>
                      <p className="text-sm text-primary-200 mt-1">— Sarah Johnson, Entrepreneur</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right side - Registration Form */}
            <div className="md:w-7/12 p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
                  <p className="text-gray-600">Fill in your details to get started</p>
                </div>
                
                <ModernRegister />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernRegisterPage;
