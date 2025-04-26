const axios = require('axios');
const { Campaign, User, Transaction } = require('../models');
const { validationResult } = require('express-validator');

// Konnect API configuration
const KONNECT_API_URL = process.env.KONNECT_API_URL || 'https://api.konnect.network/api/v2';
const KONNECT_API_KEY = process.env.KONNECT_API_KEY || 'YOUR_KONNECT_API_KEY'; // Replace with your actual API key
const KONNECT_RECEIVER_WALLET_ID = process.env.KONNECT_RECEIVER_WALLET_ID || 'YOUR_WALLET_ID'; // Replace with your actual wallet ID

// Base URL for frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Initialize a payment with Konnect
 * @route POST /api/konnect/init-payment
 */
exports.initializePayment = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, campaignId, description, firstName, lastName, email, phoneNumber, orderId } = req.body;
    const userId = req.user.id;

    // Verify campaign exists
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Prepare Konnect payment request
    const konnectPayload = {
      receiverWalletId: KONNECT_RECEIVER_WALLET_ID,
      amount: amount, // Already in millimes
      description: description,
      type: "immediate",
      lifespan: 30, // minutes
      token: "TND",
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      orderId: orderId,
      silentWebhook: true,
      checkoutForm: true,
      webhook: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/konnect/webhook`,
      successUrl: `${FRONTEND_URL}/payment/success?ref={paymentRef}&campaign=${campaignId}`,
      failUrl: `${FRONTEND_URL}/payment/failure?ref={paymentRef}&campaign=${campaignId}`,
      acceptedPaymentMethods: [
        "bank_card",
        "wallet",
        "e-DINAR"
      ]
    };

    // Call Konnect API
    const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, konnectPayload, {
      headers: {
        'x-api-key': KONNECT_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // Store payment reference in database for later verification
    await Transaction.create({
      userId,
      campaignId,
      amount: amount / 1000, // Convert millimes back to TND for storage
      paymentMethod: 'konnect',
      paymentReference: response.data.paymentRef,
      status: 'pending',
      description: description
    });

    // Return payment URL to frontend
    return res.status(200).json({
      payUrl: response.data.payUrl,
      paymentRef: response.data.paymentRef
    });

  } catch (error) {
    console.error('Error initializing Konnect payment:', error.response?.data || error);
    return res.status(500).json({ 
      message: 'Failed to initialize payment',
      error: error.response?.data || error.message
    });
  }
};

/**
 * Get payment details from Konnect
 * @route GET /api/konnect/payment/:paymentRef
 */
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentRef } = req.params;

    // Call Konnect API
    const response = await axios.get(`${KONNECT_API_URL}/payments/${paymentRef}`, {
      headers: {
        'x-api-key': KONNECT_API_KEY
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error getting Konnect payment details:', error.response?.data || error);
    return res.status(500).json({ 
      message: 'Failed to get payment details',
      error: error.response?.data || error.message
    });
  }
};

/**
 * Handle Konnect webhook
 * @route POST /api/konnect/webhook
 */
exports.handleWebhook = async (req, res) => {
  try {
    const { paymentRef, status } = req.body;

    // Verify payment reference exists in our database
    const transaction = await Transaction.findOne({ where: { paymentReference: paymentRef } });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update transaction status
    if (status === 'completed') {
      transaction.status = 'completed';
      
      // Update campaign donated amount
      const campaign = await Campaign.findByPk(transaction.campaignId);
      if (campaign) {
        campaign.currentAmount = (parseFloat(campaign.currentAmount) || 0) + parseFloat(transaction.amount);
        campaign.donorsCount = (parseInt(campaign.donorsCount) || 0) + 1;
        await campaign.save();
      }
    } else if (status === 'failed') {
      transaction.status = 'failed';
    }

    await transaction.save();

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing Konnect webhook:', error);
    return res.status(500).json({ message: 'Failed to process webhook' });
  }
};

/**
 * Verify payment status
 * @route GET /api/konnect/verify/:paymentRef
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentRef } = req.params;

    // Get payment details from Konnect
    const response = await axios.get(`${KONNECT_API_URL}/payments/${paymentRef}`, {
      headers: {
        'x-api-key': KONNECT_API_KEY
      }
    });

    // Get transaction from database
    const transaction = await Transaction.findOne({ where: { paymentReference: paymentRef } });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update transaction status if needed
    if (response.data.status === 'completed' && transaction.status !== 'completed') {
      transaction.status = 'completed';
      
      // Update campaign donated amount
      const campaign = await Campaign.findByPk(transaction.campaignId);
      if (campaign) {
        campaign.currentAmount = (parseFloat(campaign.currentAmount) || 0) + parseFloat(transaction.amount);
        campaign.donorsCount = (parseInt(campaign.donorsCount) || 0) + 1;
        await campaign.save();
      }
      
      await transaction.save();
    }

    return res.status(200).json({
      status: response.data.status,
      transactionStatus: transaction.status,
      amount: transaction.amount,
      campaignId: transaction.campaignId
    });
  } catch (error) {
    console.error('Error verifying Konnect payment:', error.response?.data || error);
    return res.status(500).json({ 
      message: 'Failed to verify payment',
      error: error.response?.data || error.message
    });
  }
};
