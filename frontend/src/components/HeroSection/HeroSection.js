import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { FiArrowRight } from "react-icons/fi";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-16 md:py-24 mt-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
                Fund Your Ideas, <br />
                <span className="text-primary-500">Make an Impact</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                TrueFunding makes it easy to raise money for your projects and support causes you care about.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={isAuthenticated ? "/create-campaign" : "/register"}
                  className="px-6 py-3 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 transition duration-200 flex items-center"
                >
                  {isAuthenticated ? "Start a Campaign" : "Get Started"}
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/campaigns"
                  className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition duration-200"
                >
                  Browse Projects
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <img
                  src="/images/crowdfunding-image.webp"
                  alt="Crowdfunding"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-700/10"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
