const Campaign = require('../models/Campaign');
const User = require('../models/User');
const path = require('path');

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching all campaigns:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    console.log('Request files:', req.files);
    console.log('Request body:', req.body);

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, target, category, endDate } = req.body;

    // Validate required fields
    if (!title || !description || !target) {
      return res.status(400).json({
        message: 'Missing required fields. Please provide title, description, and target amount.'
      });
    }

    // Handle main image URL
    let imageUrl = null;
    let files = [];

    // Process main image
    if (req.files && req.files.image && req.files.image.length > 0) {
      const mainImage = req.files.image[0];
      imageUrl = `/uploads/${mainImage.filename}`.replace(/\\/g, '/');
    }

    // Process additional images
    if (req.files && req.files.additionalImages) {
      files = req.files.additionalImages.map(file => {
        return {
          url: `/uploads/${file.filename}`.replace(/\\/g, '/'),
          name: file.originalname,
          type: file.mimetype
        };
      });
    }

    console.log('Creating campaign with files:', files);

    const campaign = await Campaign.create({
      title,
      description,
      target: parseFloat(target),
      imageUrl,
      files,
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

    console.log('Update request files:', req.files);
    console.log('Update request body:', req.body);

    const updateData = { ...req.body };

    // Handle main image update if a new file is uploaded
    if (req.files && req.files.image && req.files.image.length > 0) {
      const mainImage = req.files.image[0];
      updateData.imageUrl = `/uploads/${mainImage.filename}`.replace(/\\/g, '/');
    }

    // Process additional images
    if (req.files && req.files.additionalImages) {
      const additionalFiles = req.files.additionalImages.map(file => {
        return {
          url: `/uploads/${file.filename}`.replace(/\\/g, '/'),
          name: file.originalname,
          type: file.mimetype
        };
      });

      // If we have existing files, merge them with the new ones
      if (campaign.files && Array.isArray(campaign.files)) {
        updateData.files = [...campaign.files, ...additionalFiles];
      } else {
        updateData.files = additionalFiles;
      }
    }

    await campaign.update(updateData);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'profileImage', 'role']
        }
      ]
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    console.log('Campaign with user data:', JSON.stringify(campaign, null, 2));
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign by ID:', error);
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

exports.startNewIteration = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const currentCampaign = await Campaign.findByPk(id);
    if (!currentCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user owns the campaign
    if (currentCampaign.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to iterate this campaign' });
    }

    // Create new iteration
    const newCampaign = await Campaign.create({
      title: currentCampaign.title,
      description: currentCampaign.description,
      target: currentCampaign.target,
      imageUrl: currentCampaign.imageUrl,
      category: currentCampaign.category,
      userId: currentCampaign.userId,
      iteration: currentCampaign.iteration + 1,
      previousIterationId: currentCampaign.id
    });

    // Update the previous campaign
    await currentCampaign.update({
      iterationEndReason: reason,
      status: 'completed'
    });

    res.status(201).json({
      message: 'New iteration started successfully',
      campaign: newCampaign
    });
  } catch (error) {
    console.error('Error starting new iteration:', error);
    res.status(500).json({
      message: 'Failed to start new iteration',
      error: error.message
    });
  }
};

exports.getPreviousIterations = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const iterations = [];
    let currentCampaign = campaign;

    while (currentCampaign.previousIterationId) {
      const previousIteration = await Campaign.findByPk(currentCampaign.previousIterationId);
      if (previousIteration) {
        iterations.push(previousIteration);
        currentCampaign = previousIteration;
      } else {
        break;
      }
    }

    res.json(iterations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};