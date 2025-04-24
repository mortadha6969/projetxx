import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const SimpleCallToAction = ({ title, description, buttonText, buttonLink }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-12 bg-primary-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          <Link
            to={buttonLink}
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 transition duration-200"
          >
            {buttonText}
            <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SimpleCallToAction;
