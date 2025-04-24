import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiEdit, FiDollarSign, FiCheckCircle } from "react-icons/fi";

const HowItWorks = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      icon: <FiEdit className="text-3xl text-primary-500" />,
      number: "01",
      title: "Create Your Project",
      description:
        "Share your story and set your funding goal in just a few minutes.",
    },
    {
      icon: <FiDollarSign className="text-3xl text-primary-500" />,
      number: "02",
      title: "Get Funded",
      description:
        "Share with friends and watch as people support your campaign.",
    },
    {
      icon: <FiCheckCircle className="text-3xl text-primary-500" />,
      number: "03",
      title: "Make It Happen",
      description:
        "Receive your funds and bring your project to life.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            How TrueFunding Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start your project in minutes and get the funding you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start mb-4">
                <div className="bg-primary-50 p-3 rounded-md mr-4">
                  {step.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-primary-500 mb-1">
                    Step {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
