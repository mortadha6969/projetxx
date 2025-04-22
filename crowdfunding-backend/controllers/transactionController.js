// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // TODO: Add proper admin check here
    // For now, we'll allow any authenticated user to access all transactions
    // In a production app, you would check if the user has admin privileges

    // Use Sequelize findAll instead of Mongoose find
    const transactions = await Transaction.findAll({
      include: [
        { model: Campaign, as: 'campaign' },
        { model: User, as: 'donor' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Use Sequelize findByPk instead of Mongoose findById
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        { model: Campaign, as: 'campaign' },
        { model: User, as: 'donor' }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    // Check if user is authorized to view this transaction
    // Either the user is the donor or the campaign creator
    if (transaction.donorId !== userId && transaction.campaign.userId !== userId) {
      // TODO: Add proper admin check here
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to view this transaction'
      });
    }

    res.status(200).json({
      status: 'success',
      transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

// Process a transaction (update status to COMPLETED)
exports.processTransaction = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{ model: Campaign, as: 'campaign' }]
    });

    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    // Check if user is authorized to process this transaction
    // Only the campaign creator should be able to process transactions
    if (transaction.campaign.userId !== userId) {
      // TODO: Add proper admin check here
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to process this transaction'
      });
    }

    if (transaction.status !== 'PENDING') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot process transaction with status: ${transaction.status}`
      });
    }

    // Update transaction status
    await transaction.update({ status: 'COMPLETED' });

    // Here you would integrate with a payment service

    // If the transaction is for a campaign donation, update campaign stats
    if (transaction.campaignId) {
      const campaign = await Campaign.findByPk(transaction.campaignId);
      if (campaign) {
        await campaign.increment('donated', { by: transaction.amount });
        await campaign.increment('donors');
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Transaction processed successfully',
      transaction
    });
  } catch (error) {
    console.error('Error processing transaction:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process transaction',
      error: error.message
    });
  }
};

// Refund a transaction
exports.refundTransaction = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{ model: Campaign, as: 'campaign' }]
    });

    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    // Check if user is authorized to refund this transaction
    // Only the campaign creator should be able to refund transactions
    if (transaction.campaign.userId !== userId) {
      // TODO: Add proper admin check here
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to refund this transaction'
      });
    }

    if (transaction.status !== 'COMPLETED') {
      return res.status(400).json({
        status: 'error',
        message: `Cannot refund transaction with status: ${transaction.status}`
      });
    }

    // Update transaction status
    await transaction.update({ status: 'REFUNDED' });

    // Here you would integrate with a payment service for refund

    // If the transaction is for a campaign donation, update campaign stats
    if (transaction.campaignId) {
      const campaign = await Campaign.findByPk(transaction.campaignId);
      if (campaign) {
        await campaign.decrement('donated', { by: transaction.amount });
        await campaign.decrement('donors');
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Transaction refunded successfully',
      transaction
    });
  } catch (error) {
    console.error('Error refunding transaction:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to refund transaction',
      error: error.message
    });
  }
};
