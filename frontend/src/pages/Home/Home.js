import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedCampaigns from "../../components/FeaturedCampaigns/FeaturedCampaigns";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import TestimonialSection from "../../components/TestimonialSection/TestimonialSection";
import CallToAction from "../../components/CallToAction/CallToAction";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Campaigns Section */}
      <motion.section
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Campaigns
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover innovative projects and inspiring causes that need your support.
            </p>
          </motion.div>
          
          <FeaturedCampaigns />
          
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link
              to="/campaigns"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-300"
            >
              View All Campaigns
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Call to Action */}
      <CallToAction
        title={isAuthenticated ? "Start Your Campaign Today" : "Join Our Community"}
        description={
          isAuthenticated
            ? "Create your campaign and start raising funds for your cause."
            : "Sign up to support campaigns or create your own fundraising project."
        }
        buttonText={isAuthenticated ? "Create Campaign" : "Sign Up Now"}
        buttonLink={isAuthenticated ? "/create-campaign" : "/register"}
      />
    </div>
  );
};

export default Home;
