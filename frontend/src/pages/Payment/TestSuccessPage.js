import React from 'react';
import { Link } from 'react-router-dom';

const TestSuccessPage = () => {
  // Generate a test payment reference
  const generateTestPaymentRef = () => {
    return `test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  // Create test URLs for different campaigns
  const testUrls = [
    {
      name: 'Campaign #3 - 20 DT',
      url: `/payment/success?ref=${generateTestPaymentRef()}&campaign=3&amount=20&originalAmount=20&test=true`
    },
    {
      name: 'Campaign #4 - 50 DT',
      url: `/payment/success?ref=${generateTestPaymentRef()}&campaign=4&amount=50&originalAmount=50&test=true`
    },
    {
      name: 'Campaign #3 - 100 DT',
      url: `/payment/success?ref=${generateTestPaymentRef()}&campaign=3&amount=100&originalAmount=100&test=true`
    }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Test Payment Success Page</h1>
      <p className="text-gray-600 mb-6">
        Click on one of the links below to test the payment success page with different parameters.
      </p>

      <div className="space-y-4">
        {testUrls.map((testUrl, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-md">
            <h2 className="font-semibold text-lg mb-2">{testUrl.name}</h2>
            <Link
              to={testUrl.url}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors inline-block"
            >
              Test This URL
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TestSuccessPage;
