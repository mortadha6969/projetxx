import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedCampaigns from "../../components/FeaturedCampaigns/FeaturedCampaigns";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import { FiArrowRight } from "react-icons/fi";

const SimpleHome = () => {
  const { isAuthenticated } = useAuth();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Projects Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Featured Projects
            </h2>
            <p className="text-gray-600">
              Discover projects that need your support
            </p>
          </div>
          
          <FeaturedCampaigns />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Call to Action */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {isAuthenticated ? "Ready to Start Your Project?" : "Join Our Community"}
            </h2>
            <p className="text-gray-600 mb-6">
              {isAuthenticated
                ? "Create your project and start raising funds today."
                : "Sign up to support projects or create your own."}
            </p>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                to={isAuthenticated ? "/create-campaign" : "/register"}
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 transition duration-200"
              >
                {isAuthenticated ? "Create Project" : "Sign Up Now"}
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SimpleHome;
