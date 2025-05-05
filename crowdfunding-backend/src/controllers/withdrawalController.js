const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { sequelize } = require('../config/database');

// Minimum amount required for withdrawal (in DT)
const MIN_FORWARD_AMOUNT = 50;

/**
 * Request to forward funds to Konnect
 * @route POST /api/withdrawals/request
 */
exports.requestForwardToKonnect = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        status: 'error',
        message: 'Campaign ID is required'
      });
    }

    // Find the campaign
    const campaign = await Campaign.findOne({
      where: { id: campaignId, userId }
    });

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaign not found or you do not have permission to withdraw funds'
      });
    }

    // Check if the campaign has raised enough funds
    if (campaign.donated < MIN_FORWARD_AMOUNT) {
      return res.status(400).json({
        status: 'error',
        message: `You need to raise at least ${MIN_FORWARD_AMOUNT} DT before you can forward funds to Konnect`,
        minAmount: MIN_FORWARD_AMOUNT,
        currentAmount: campaign.donated
      });
    }

    // Create a forward-to-Konnect transaction
    const transaction = await Transaction.create({
      amount: campaign.donated,
      method: 'konnect_forward',
      status: 'PENDING',
      donorId: userId,
      campaignId: campaign.id,
      description: `Funds forwarded to Konnect from campaign: ${campaign.title}`
    });

    // Return success response
    return res.status(200).json({
      status: 'success',
      message: 'Funds will be forwarded to your Konnect account. You will be able to withdraw from there.',
      transaction
    });
  } catch (error) {
    console.error('Error requesting withdrawal:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process withdrawal request',
      error: error.message
    });
  }
};

/**
 * Check if a campaign is eligible for forwarding funds to Konnect
 * @route GET /api/withdrawals/check/:campaignId
 */
exports.checkForwardEligibility = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const { campaignId } = req.params;

    if (!campaignId) {
      return res.status(400).json({
        status: 'error',
        message: 'Campaign ID is required'
      });
    }

    // Find the campaign
    const campaign = await Campaign.findOne({
      where: { id: campaignId, userId }
    });

    if (!campaign) {
      return res.status(404).json({
        status: 'error',
        message: 'Campaign not found or you do not have permission to withdraw funds'
      });
    }

    // Check if the campaign has raised enough funds
    const isEligible = campaign.donated >= MIN_FORWARD_AMOUNT;

    // Return eligibility status
    return res.status(200).json({
      status: 'success',
      isEligible,
      minAmount: MIN_FORWARD_AMOUNT,
      currentAmount: campaign.donated,
      message: isEligible
        ? 'Campaign is eligible to forward funds to Konnect'
        : `You need to raise at least ${MIN_FORWARD_AMOUNT} DT before you can forward funds to Konnect`
    });
  } catch (error) {
    console.error('Error checking forward eligibility:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to check eligibility for forwarding funds to Konnect',
      error: error.message
    });
  }
};

module.exports.MIN_FORWARD_AMOUNT = MIN_FORWARD_AMOUNT;
