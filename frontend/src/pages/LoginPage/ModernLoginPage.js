import React from 'react';
import { motion } from 'framer-motion';
import ModernLogin from '../../components/Login/ModernLogin';
import { FiShield } from 'react-icons/fi';

const ModernLoginPage = () => {
  return (
    <div className="py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Left side - Login Form */}
            <div className="md:w-7/12 p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                  <p className="text-gray-600">Sign in to your account to continue</p>
                </div>
                
                <ModernLogin />
              </motion.div>
            </div>
            
            {/* Right side - Benefits */}
            <div className="md:w-5/12 bg-gradient-to-br from-primary-500 to-primary-600 p-8 text-white">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full flex flex-col justify-center"
              >
                <div className="mx-auto bg-white/20 p-4 rounded-full mb-6">
                  <FiShield className="w-10 h-10" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4 text-center">Trusted by Thousands</h2>
                <p className="text-primary-100 text-center mb-8">
                  Join the thousands of creators and supporters who use TrueFunding every day to bring amazing projects to life.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="italic text-sm mb-3">
                      "TrueFunding made it so easy to raise money for my art installation. The platform is intuitive and the community is incredibly supportive."
                    </p>
                    <div className="flex items-center">
                      <img 
                        src="https://source.unsplash.com/random/100x100/?portrait1" 
                        alt="User" 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <p className="text-sm font-medium">Michael Chen, Artist</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="italic text-sm mb-3">
                      "As a backer, I love how easy it is to discover and support new projects. The platform keeps me updated on all my contributions."
                    </p>
                    <div className="flex items-center">
                      <img 
                        src="https://source.unsplash.com/random/100x100/?portrait2" 
                        alt="User" 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <p className="text-sm font-medium">Olivia Rodriguez, Supporter</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginPage;
