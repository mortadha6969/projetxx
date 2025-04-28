const axios = require('axios');
const { sequelize } = require('../config/database');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// Konnect API configuration
const KONNECT_API_URL = process.env.KONNECT_API_URL || 'https://api.konnect.network/api/v2';
const KONNECT_API_KEY = process.env.KONNECT_API_KEY || 'YOUR_KONNECT_API_KEY'; // Replace with your actual API key
const KONNECT_RECEIVER_WALLET_ID = process.env.KONNECT_RECEIVER_WALLET_ID || 'YOUR_WALLET_ID'; // Replace with your actual wallet ID

// Always use test mode for now
const USING_TEST_CREDENTIALS = true;

// Log the credentials being used
console.log('Konnect API Key:', KONNECT_API_KEY);
console.log('Konnect Receiver Wallet ID:', KONNECT_RECEIVER_WALLET_ID);
console.log('Using test credentials:', USING_TEST_CREDENTIALS);

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
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Request body:', req.body);

    const { amount, campaignId, description, firstName, lastName, email, phoneNumber, orderId } = req.body;

    // Check if required fields are present
    if (!amount) {
      return res.status(400).json({ errors: [{ msg: 'Amount is required' }] });
    }
    if (!campaignId) {
      return res.status(400).json({ errors: [{ msg: 'Campaign ID is required' }] });
    }
    if (!email) {
      return res.status(400).json({ errors: [{ msg: 'Email is required' }] });
    }

    const userId = req.user?.id;
    if (!userId) {
      console.log('Warning: No user ID found in request');
      return res.status(401).json({ errors: [{ msg: 'Authentication required' }] });
    }
    console.log('User ID:', userId);

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
      successUrl: `${FRONTEND_URL}/payment/success?ref={paymentRef}&campaign=${campaignId}&amount=${amount/1000}&originalAmount=${amount/1000}`,
      failUrl: `${FRONTEND_URL}/payment/failure?ref={paymentRef}&campaign=${campaignId}&amount=${amount/1000}&originalAmount=${amount/1000}`,
      acceptedPaymentMethods: [
        "bank_card",
        "wallet",
        "e-DINAR"
      ]
    };

    // Log the payload being sent to Konnect
    console.log('Konnect API URL:', `${KONNECT_API_URL}/payments/init-payment`);
    console.log('Konnect payload:', JSON.stringify(konnectPayload, null, 2));
    console.log('Konnect API key (first 10 chars):', KONNECT_API_KEY.substring(0, 10) + '...');
    console.log('Using test credentials:', USING_TEST_CREDENTIALS);

    let konnectResponse;

    // If using test credentials, simulate a successful response
    if (USING_TEST_CREDENTIALS) {
      console.log('Using test mode - simulating Konnect API response');

      // Generate a random payment reference
      const paymentRef = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Calculate amount in DT for the URL
      const amountInDT = amount / 1000;
      console.log('Amount in millimes:', amount);
      console.log('Amount in DT for URL:', amountInDT);

      // Simulate a Konnect response with the exact amount
      konnectResponse = {
        data: {
          payUrl: `${FRONTEND_URL}/payment/success?ref=${paymentRef}&campaign=${campaignId}&test=true&amount=${amountInDT}&originalAmount=${amountInDT}`,
          paymentRef: paymentRef
        }
      };

      console.log('Simulated Konnect API response:', konnectResponse.data);
    } else {
      try {
        // Call actual Konnect API
        const response = await axios.post(`${KONNECT_API_URL}/payments/init-payment`, konnectPayload, {
          headers: {
            'x-api-key': KONNECT_API_KEY,
            'Content-Type': 'application/json'
          }
        });

        console.log('Konnect API response:', response.data);
        konnectResponse = response;
      } catch (apiError) {
        console.error('Konnect API error:', apiError.response?.data || apiError.message);
        return res.status(500).json({
          message: 'Failed to initialize payment with Konnect',
          error: apiError.response?.data || apiError.message
        });
      }
    }

    try {
      // Store payment reference in database for later verification
      await Transaction.create({
        donorId: userId,
        campaignId,
        amount: amount / 1000, // Convert millimes back to TND for storage
        method: 'konnect',
        paymentReference: konnectResponse.data.paymentRef,
        status: 'PENDING',
        description: description
      });
    } catch (dbError) {
      console.error('Database error when storing transaction:', dbError);
      // Continue anyway, as the payment has been initialized
    }

    // Return payment URL to frontend
    return res.status(200).json({
      payUrl: konnectResponse.data.payUrl,
      paymentRef: konnectResponse.data.paymentRef
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

    // Check if this is a test payment
    const isTestPayment = paymentRef.startsWith('test_');

    if (isTestPayment || USING_TEST_CREDENTIALS) {
      console.log('Using test mode - simulating Konnect payment details');
      // Get amount from query parameter
      const amountFromQuery = req.query.amount;
      const amount = amountFromQuery ? parseFloat(amountFromQuery) : 10;
      const amountInMillimes = amount ? Math.round(amount * 1000) : 10000;

      console.log('Amount from query (DT):', amountFromQuery);
      console.log('Parsed amount (DT):', amount);
      console.log('Amount in millimes:', amountInMillimes);

      // Simulate a successful payment response
      return res.status(200).json({
        status: 'completed',
        amount: amountInMillimes,
        amountInDT: amount,
        paymentRef: paymentRef,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      // Call Konnect API
      const response = await axios.get(`${KONNECT_API_URL}/payments/${paymentRef}`, {
        headers: {
          'x-api-key': KONNECT_API_KEY
        }
      });

      return res.status(200).json(response.data);
    }
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
    console.log('Webhook received:', req.body);
    const { paymentRef, status } = req.body;

    // Check if this is a test payment
    const isTestPayment = paymentRef && paymentRef.startsWith('test_');

    if (isTestPayment) {
      console.log('Test payment webhook received');
      return res.status(200).json({ message: 'Test webhook processed successfully' });
    }

    // Verify payment reference exists in our database
    const transaction = await Transaction.findOne({ where: { paymentReference: paymentRef } });
    if (!transaction) {
      console.log('Transaction not found for payment reference:', paymentRef);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    console.log('Found transaction:', transaction.id, 'with status:', transaction.status);

    // Update transaction status
    if (status === 'completed') {
      transaction.status = 'COMPLETED';

      // Update campaign donated amount
      const campaign = await Campaign.findByPk(transaction.campaignId);
      if (campaign) {
        console.log('Updating campaign:', campaign.id);
        console.log('Current donated:', campaign.donated, 'Current donors:', campaign.donors, 'Adding:', transaction.amount);

        // Calculate new values
        const newDonated = (parseFloat(campaign.donated) || 0) + parseFloat(transaction.amount);
        const newDonors = (parseInt(campaign.donors) || 0) + 1;

        console.log('New donated amount:', newDonated);
        console.log('New donors count:', newDonors);

        // Update campaign using direct SQL query to ensure it works
        try {
          const [updateResult] = await sequelize.query(
            'UPDATE campaigns SET donated = ?, donors = ?, updated_at = NOW() WHERE id = ?',
            {
              replacements: [newDonated, newDonors, campaign.id],
              type: sequelize.QueryTypes.UPDATE
            }
          );
          console.log('SQL update result:', updateResult);
        } catch (sqlError) {
          console.error('SQL update error:', sqlError);
        }

        // Also update the model instance
        campaign.donated = newDonated;
        campaign.donors = newDonors;
        await campaign.save();

        console.log('Updated campaign - donated:', campaign.donated, 'donors:', campaign.donors);
      } else {
        console.log('Campaign not found:', transaction.campaignId);
      }
    } else if (status === 'failed') {
      transaction.status = 'FAILED';
    }

    await transaction.save();
    console.log('Updated transaction status to:', transaction.status);

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
    console.log('Verifying payment:', paymentRef);
    console.log('Query params:', req.query);
    console.log('User in request:', req.user ? `ID: ${req.user.id}` : 'Not authenticated');

    // Extract campaign ID and amount from URL
    const campaignId = req.query.campaign;
    const amountFromQuery = req.query.amount;
    console.log('Campaign ID from query:', campaignId);
    console.log('Amount from query (DT):', amountFromQuery);

    // Parse amount as a float to ensure it's a number
    const amount = amountFromQuery ? parseFloat(amountFromQuery) : null;
    console.log('Parsed amount (DT):', amount);

    // Check if this is a test payment
    const isTestPayment = paymentRef && paymentRef.startsWith('test_');
    console.log('Is test payment:', isTestPayment);
    console.log('Using test credentials:', USING_TEST_CREDENTIALS);

    let response;

    if (isTestPayment || USING_TEST_CREDENTIALS) {
      console.log('Using test mode - simulating Konnect payment verification');
      // Calculate amount in millimes for the response
      const amountInMillimes = amount ? Math.round(amount * 1000) : 10000;
      console.log('Using amount in millimes for response:', amountInMillimes);

      // Simulate a successful payment response
      response = {
        data: {
          status: 'completed',
          amount: amountInMillimes,
          paymentRef: paymentRef,
          amountInDT: amount || 10
        }
      };
      console.log('Simulated response:', response.data);
    } else {
      console.log('Calling real Konnect API');
      // Get payment details from Konnect
      response = await axios.get(`${KONNECT_API_URL}/payments/${paymentRef}`, {
        headers: {
          'x-api-key': KONNECT_API_KEY
        }
      });
      console.log('Real API response:', response.data);
    }

    // For test payments, we need to update the campaign
    if (isTestPayment || USING_TEST_CREDENTIALS) {
      console.log('Test payment - handling test payment update');

      // Get campaign ID from query parameter
      let campaignId = req.query.campaign;

      // If not found, use default
      if (!campaignId) {
        campaignId = '1';
      }

      // Ensure it's a string
      campaignId = String(campaignId);
      console.log('Campaign ID for test payment:', campaignId);
      console.log('User ID from request:', req.user?.id);

      try {
        // Find the campaign
        const campaign = await Campaign.findByPk(campaignId);
        if (campaign) {
          console.log('Found campaign for test payment:', campaign.id);
          console.log('Current donated amount:', campaign.donated, 'Current donors:', campaign.donors);

          // Update campaign donated amount - use exact amount from query or default to 10 DT
          const donationAmount = amount !== null && !isNaN(amount) ? amount : 10;
          console.log('Using donation amount (DT):', donationAmount);

          // Log the exact value to make sure it's correct
          console.log('Donation amount type:', typeof donationAmount);
          console.log('Donation amount value:', donationAmount);
          console.log('Before update - donated:', campaign.donated, 'type:', typeof campaign.donated);
          console.log('Before update - donors:', campaign.donors, 'type:', typeof campaign.donors);

          // Calculate new values
          const newDonated = (parseFloat(campaign.donated) || 0) + donationAmount;
          const newDonors = (parseInt(campaign.donors) || 0) + 1;

          console.log('New donated amount:', newDonated);
          console.log('New donors count:', newDonors);

          // Update campaign using direct SQL query to ensure it works
          try {
            const [updateResult] = await sequelize.query(
              'UPDATE campaigns SET donated = ?, donors = ?, updated_at = NOW() WHERE id = ?',
              {
                replacements: [newDonated, newDonors, campaign.id],
                type: sequelize.QueryTypes.UPDATE
              }
            );
            console.log('SQL update result:', updateResult);
          } catch (sqlError) {
            console.error('SQL update error:', sqlError);
          }

          // Also update the model instance
          campaign.donated = newDonated;
          campaign.donors = newDonors;

          // Save changes
          try {
            await campaign.save();
            console.log('Campaign saved successfully');
          } catch (saveError) {
            console.error('Error saving campaign:', saveError);
            throw saveError;
          }

          console.log('Updated campaign - donated:', campaign.donated, 'donors:', campaign.donors);

          // Get donor ID if available
          const donorId = req.user?.id;
          console.log('Donor ID for transaction:', donorId || 'Anonymous donation');

          // Check if a transaction with this payment reference already exists
          const existingTransaction = await Transaction.findOne({
            where: { paymentReference: paymentRef }
          });

          if (existingTransaction) {
            console.log('Transaction already exists with payment reference:', paymentRef);
            console.log('Existing transaction ID:', existingTransaction.id, 'amount:', existingTransaction.amount);

            // Return the existing transaction data
            return res.status(200).json({
              status: 'completed',
              transactionStatus: 'COMPLETED',
              amount: existingTransaction.amount,
              campaignId: campaign.id,
              donationAmount: existingTransaction.amount,
              message: 'Transaction already processed'
            });
          }

          // Create a transaction record for this test payment with the EXACT donation amount
          const transaction = await Transaction.create({
            donorId: donorId || null, // Can be null for anonymous donations
            campaignId: campaign.id,
            amount: donationAmount,
            method: 'konnect-test',
            status: 'COMPLETED',
            paymentReference: paymentRef,
            description: `Test donation of ${donationAmount} DT`
          });

          console.log('Created transaction record with ID:', transaction.id, 'and amount:', transaction.amount);

          console.log('Created transaction record for test payment');

          // Return simulated transaction data
          return res.status(200).json({
            status: 'completed',
            transactionStatus: 'COMPLETED',
            amount: donationAmount,
            campaignId: campaign.id,
            donationAmount: donationAmount // Include the exact donation amount
          });
        } else {
          console.log('Campaign not found for test payment:', campaignId);
          // Return simulated transaction data without updating
          const donationAmount = amount !== null && !isNaN(amount) ? amount : 10;
          console.log('Using donation amount (DT) for response:', donationAmount);
          return res.status(200).json({
            status: 'completed',
            transactionStatus: 'COMPLETED',
            amount: donationAmount,
            campaignId: campaignId,
            donationAmount: donationAmount
          });
        }
      } catch (error) {
        console.error('Error handling test payment:', error);
        // Return simulated transaction data without updating
        const donationAmount = amount !== null && !isNaN(amount) ? amount : 10;
        console.log('Using donation amount (DT) for error response:', donationAmount);
        return res.status(200).json({
          status: 'completed',
          transactionStatus: 'COMPLETED',
          amount: donationAmount,
          campaignId: campaignId || '1',
          donationAmount: donationAmount
        });
      }
    }

    // For real payments, get transaction from database
    console.log('Looking up transaction in database');
    const transaction = await Transaction.findOne({ where: { paymentReference: paymentRef } });

    if (!transaction) {
      console.log('Transaction not found in database');
      return res.status(404).json({ message: 'Transaction not found' });
    }

    console.log('Found transaction:', transaction.id);

    // Update transaction status if needed
    if (response.data.status === 'completed' && transaction.status !== 'COMPLETED') {
      console.log('Updating transaction status to completed');
      transaction.status = 'COMPLETED';

      // Update campaign donated amount
      const campaign = await Campaign.findByPk(transaction.campaignId);
      if (campaign) {
        console.log('Updating campaign:', campaign.id);
        console.log('Before update - donated:', campaign.donated, 'donors:', campaign.donors);

        // Calculate new values
        const newDonated = (parseFloat(campaign.donated) || 0) + parseFloat(transaction.amount);
        const newDonors = (parseInt(campaign.donors) || 0) + 1;

        console.log('New donated amount:', newDonated);
        console.log('New donors count:', newDonors);

        // Update campaign using direct SQL query to ensure it works
        try {
          const [updateResult] = await sequelize.query(
            'UPDATE campaigns SET donated = ?, donors = ?, updated_at = NOW() WHERE id = ?',
            {
              replacements: [newDonated, newDonors, campaign.id],
              type: sequelize.QueryTypes.UPDATE
            }
          );
          console.log('SQL update result:', updateResult);
        } catch (sqlError) {
          console.error('SQL update error:', sqlError);
        }

        // Also update the model instance
        campaign.donated = newDonated;
        campaign.donors = newDonors;
        await campaign.save();

        console.log('Updated campaign - donated:', campaign.donated, 'donors:', campaign.donors);
      }

      await transaction.save();
      console.log('Transaction updated');
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
