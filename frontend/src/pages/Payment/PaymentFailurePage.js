import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiXCircle, FiArrowLeft } from 'react-icons/fi';

const PaymentFailurePage = () => {
  const location = useLocation();

  // Get campaign ID and test mode from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const campaignId = queryParams.get('campaign');
  const paymentRef = queryParams.get('ref');
  const isTestMode = queryParams.get('test') === 'true';

  // Log for debugging
  console.log('Payment failure page loaded with:', {
    campaignId,
    paymentRef,
    isTestMode
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiXCircle className="text-red-500 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6 text-center">
            We couldn't process your payment at this time. No funds have been deducted from your account.
            {paymentRef && <span className="block mt-2">Reference: {paymentRef}</span>}
          </p>

          <div className="w-full max-w-md bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Common Reasons for Payment Failure</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Insufficient funds in your account</li>
              <li>Incorrect card information</li>
              <li>Transaction declined by your bank</li>
              <li>Connection issues during payment processing</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <Link
              to={campaignId ? `/campaign/${campaignId}` : '/campaigns'}
              className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Return to Campaign
            </Link>
            <Link
              to="/"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentFailurePage;
