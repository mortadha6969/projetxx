/**
 * Konnect Payment Service
 * This service handles integration with the Konnect payment gateway for Tunisia
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Konnect API configuration
const KONNECT_API_URL = `${API_BASE_URL}/konnect`; // This will be proxied through our backend

const konnectService = {
  /**
   * Initialize a payment with Konnect
   * @param {Object} paymentData - Payment information
   * @param {number} paymentData.amount - Amount in TND (will be converted to millimes)
   * @param {string} paymentData.campaignId - Campaign ID
   * @param {string} paymentData.description - Payment description
   * @param {Object} paymentData.user - User information
   * @returns {Promise<Object>} - Payment URL and reference
   */
  initializePayment: async (paymentData) => {
    try {
      console.log('Initializing Konnect payment:', paymentData);
      
      // Convert TND to millimes (1 TND = 1000 millimes)
      const amountInMillimes = Math.round(paymentData.amount * 1000);
      
      const response = await axios.post(`${KONNECT_API_URL}/init-payment`, {
        amount: amountInMillimes,
        campaignId: paymentData.campaignId,
        description: paymentData.description || `Donation to campaign #${paymentData.campaignId}`,
        firstName: paymentData.user.firstName || paymentData.user.username,
        lastName: paymentData.user.lastName || '',
        email: paymentData.user.email,
        phoneNumber: paymentData.user.phone || '',
        orderId: `donation-${Date.now()}`, // Generate a unique order ID
      });
      
      console.log('Konnect payment initialized:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error initializing Konnect payment:', error);
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get payment details from Konnect
   * @param {string} paymentRef - Payment reference
   * @returns {Promise<Object>} - Payment details
   */
  getPaymentDetails: async (paymentRef) => {
    try {
      const response = await axios.get(`${KONNECT_API_URL}/payment/${paymentRef}`);
      return response.data;
    } catch (error) {
      console.error('Error getting Konnect payment details:', error);
      throw error.response?.data || error;
    }
  },
  
  /**
   * Verify a payment was successful
   * @param {string} paymentRef - Payment reference
   * @returns {Promise<boolean>} - Whether payment was successful
   */
  verifyPayment: async (paymentRef) => {
    try {
      const paymentDetails = await konnectService.getPaymentDetails(paymentRef);
      return paymentDetails.status === 'completed';
    } catch (error) {
      console.error('Error verifying Konnect payment:', error);
      return false;
    }
  }
};

export default konnectService;
