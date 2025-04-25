import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const TermsPage = () => {
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
            <h1 className="text-3xl font-bold text-gray-800">Terms and Conditions</h1>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to TrueFunding. These Terms and Conditions govern your use of our website and services. By accessing or using TrueFunding, you agree to be bound by these Terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Definitions</h2>
            <p className="text-gray-600 mb-4">
              <strong>"Service"</strong> refers to the TrueFunding website and crowdfunding platform.<br />
              <strong>"User"</strong> refers to individuals who register and use our platform.<br />
              <strong>"Campaign"</strong> refers to fundraising projects created on our platform.<br />
              <strong>"Contribution"</strong> refers to financial support provided to campaigns.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Account Registration</h2>
            <p className="text-gray-600 mb-4">
              To use certain features of our Service, you must register for an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. User Conduct</h2>
            <p className="text-gray-600 mb-4">
              You agree not to use the Service for any illegal purposes or in violation of any applicable laws. You will not post content that is defamatory, obscene, or infringing on intellectual property rights.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Campaigns</h2>
            <p className="text-gray-600 mb-4">
              Campaign creators are responsible for fulfilling the promises made in their campaigns. TrueFunding does not guarantee that campaigns will succeed or that campaign goals will be met.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Contributions</h2>
            <p className="text-gray-600 mb-4">
              By making a contribution, you understand that you are supporting a project, not making a purchase. There is no guarantee that projects will deliver on their goals.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Fees</h2>
            <p className="text-gray-600 mb-4">
              TrueFunding charges fees for using our platform. These fees are clearly disclosed before you make a contribution or create a campaign.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Service and its original content, features, and functionality are owned by TrueFunding and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              TrueFunding shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on the Service and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us at support@truefunding.com.
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

export default TermsPage;
