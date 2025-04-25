import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const PrivacyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <Link
              to="/register"
              className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              At TrueFunding, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect several types of information from and about users of our platform, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Personal identifiers (name, email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Profile information (profile picture, biography)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Usage data (how you interact with our platform)</li>
              <li>Device information (IP address, browser type, operating system)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Providing and maintaining our platform</li>
              <li>Processing transactions and managing your account</li>
              <li>Communicating with you about campaigns and updates</li>
              <li>Improving our platform and user experience</li>
              <li>Protecting against fraud and unauthorized access</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. How We Share Your Information</h2>
            <p className="text-gray-600 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Campaign creators (for processing contributions)</li>
              <li>Service providers (payment processors, hosting providers)</li>
              <li>Legal authorities (when required by law)</li>
              <li>Business partners (with your consent)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Your Data Protection Rights</h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Right to access your personal data</li>
              <li>Right to rectify inaccurate data</li>
              <li>Right to erasure (right to be forgotten)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@truefunding.com.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/register"
              className="inline-block px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;
