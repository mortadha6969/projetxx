const Campaign = require('../models/Campaign');

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from auth middleware
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, target, imageUrl, category, endDate } = req.body;

    // Validate required fields
    if (!title || !description || !target || !imageUrl) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide title, description, target amount, and image URL.' 
      });
    }

    const campaign = await Campaign.create({
      title,
      description,
      target: parseFloat(target),
      imageUrl,
      category: category || 'General',
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId
    });

    res.status(201).json({ 
      message: 'Campaign created successfully', 
      campaign 
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ 
      message: 'Failed to create campaign', 
      error: error.message 
    });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Check if user owns the campaign
    if (campaign.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this campaign' });
    }

    await campaign.update(req.body);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user owns the campaign
    if (campaign.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to delete this campaign' });
    }

    await campaign.destroy();
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.shareOnSocialMedia = async (req, res) => {
  res.json({ message: 'Social media sharing functionality to be implemented' });
};