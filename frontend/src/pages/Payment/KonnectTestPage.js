import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import apiService from '../../utils/apiService';
import { useAuth } from '../../utils/AuthContext';

const KonnectTestPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaignId: '1', // Default to campaign ID 1
    amount: 10, // Default amount in TND
    description: 'Test donation',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  // Update form data when user data is available
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || user.username || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert amount to millimes (1 TND = 1000 millimes)
      const amountInDT = parseFloat(formData.amount);
      const amountInMillimes = Math.round(amountInDT * 1000);

      console.log('Amount in DT:', amountInDT);
      console.log('Amount in millimes:', amountInMillimes);

      const paymentData = {
        ...formData,
        amount: amountInMillimes
      };

      console.log('Sending payment data:', paymentData);

      // Initialize Konnect payment
      const response = await apiService.konnect.initializePayment(paymentData);

      console.log('Konnect response:', response);

      toast.success('Payment initialized successfully! Redirecting...');

      // Redirect to Konnect payment page
      setTimeout(() => {
        window.location.href = response.payUrl;
      }, 2000);
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error(error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Konnect Payment Test</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign ID</label>
            <input
              type="text"
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (DT)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Initializing Payment...' : 'Initialize Konnect Payment'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Testing Instructions</h2>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Fill in the form above with test data</li>
            <li>Click "Initialize Konnect Payment"</li>
            <li>You will be redirected to the Konnect payment page</li>
            <li>Complete the payment process</li>
            <li>You will be redirected back to the success or failure page</li>
          </ol>
        </div>
      </div>
    </motion.div>
  );
};

export default KonnectTestPage;
